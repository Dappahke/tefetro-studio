import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/dal'
import { CreateOrderSchema } from '@/lib/security/input-validation'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { audit } from '@/lib/security/audit-logger'
import { env } from '@/lib/env'
import { sendReceiptEmail, notifyAdminOfProject } from '@/lib/email'

const PAYSTACK_VERIFY_URL = 'https://api.paystack.co/transaction/verify'

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.createOrder.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Authentication required
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Input validation
    const validation = CreateOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { productId, paymentRef, addons } = validation.data
    const { user, email } = session

    // Verify payment with Paystack
    const verifyRes = await fetch(`${PAYSTACK_VERIFY_URL}/${paymentRef}`, {
      headers: { Authorization: `Bearer ${env.server.PAYSTACK_SECRET_KEY}` },
    })

    const verifyData = await verifyRes.json()
    if (!verifyData?.data || verifyData.data.status !== 'success') {
      await audit.paymentFailed({ email, paymentRef, reason: 'Payment verification failed' })
      return NextResponse.json(
        { success: false, error: 'Payment not successful' },
        { status: 400 }
      )
    }

    // Fetch product
    const supabase = await createClient()
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Fetch and validate addons (must be linked to this product)
    let addonData: any[] = []
    if (addons?.length > 0) {
      const { data: linkedAddons, error: addonError } = await supabase
        .from('product_addons')
        .select('addon:addons(*)')
        .eq('product_id', productId)
        .in('addon_id', addons)

      if (addonError || !linkedAddons || linkedAddons.length !== addons.length) {
        return NextResponse.json(
          { success: false, error: 'Invalid addons selected for this product' },
          { status: 400 }
        )
      }

      addonData = linkedAddons.map((la: any) => la.addon)
    }

    // Calculate true price
    const addonsTotal = addonData.reduce((sum, a) => sum + Number(a.price), 0)
    const expectedTotal = Number(product.price) + addonsTotal

    // Verify Paystack amount
    if (Number(verifyData.data.amount) !== expectedTotal * 100) {
      await audit.paymentFailed({ 
        email, 
        paymentRef, 
        reason: `Amount mismatch: expected ${expectedTotal * 100}, got ${verifyData.data.amount}` 
      })
      return NextResponse.json(
        { success: false, error: 'Payment amount mismatch' },
        { status: 400 }
      )
    }

    // Generate download link
    const { data: signedUrlData, error: urlError } = await adminClient.storage
      .from('drawings')
      .createSignedUrl(product.file_path, 60 * 60 * 24)

    if (urlError || !signedUrlData) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    const downloadUrl = signedUrlData.signedUrl
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Insert order
    const { data: orderData, error: insertError } = await adminClient
      .from('orders')
      .insert({
        user_id: user.id,
        email,
        product_id: productId,
        total: expectedTotal,
        payment_ref: paymentRef,
        download_url: downloadUrl,
        expires_at: expiresAt.toISOString(),
        addons: addonData.map((a: any) => ({ id: a.id, name: a.name, price: a.price, type: a.type })),
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.message.toLowerCase().includes('duplicate')) {
        return NextResponse.json({ success: true, message: 'Order already exists' })
      }
      throw insertError
    }

    // Handle service addons (create projects)
    const serviceAddons = addonData.filter((a: any) => a.type === 'service')
    if (serviceAddons.length > 0) {
      const serviceTypes = serviceAddons.map((a: any) => a.id)

      await adminClient.from('projects').insert({
        user_id: user.id,
        order_id: orderData.id,
        email,
        service_type: serviceTypes.join(', '),
        status: 'pending',
      })

      try {
        await notifyAdminOfProject(email, serviceTypes.join(', '))
      } catch (err) {
        console.error('Admin email failed:', err)
      }
    }

    // Send receipt email
    try {
      await sendReceiptEmail(email, downloadUrl)
    } catch (emailError) {
      console.error('Email failed:', emailError)
    }

    // Audit log
    await audit.paymentSuccess({
      userId: user.id,
      email,
      orderId: orderData.id,
      amount: expectedTotal,
      paymentRef,
    })

    return NextResponse.json({
      success: true,
      message: 'Payment successful',
      data: {
        orderId: orderData.id,
        downloadUrl,
        expiresAt,
      },
    })

  } catch (err) {
    console.error('CREATE ORDER ERROR:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}