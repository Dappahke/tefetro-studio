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
    // Rate limiting - strict for order creation
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

    // CRITICAL: Verify payment with Paystack immediately
    // This prevents fake payment references from being accepted
    const verifyRes = await fetch(`${PAYSTACK_VERIFY_URL}/${paymentRef}`, {
      headers: { 
        Authorization: `Bearer ${env.server.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Ensure fresh verification
    })

    if (!verifyRes.ok) {
      await audit.paymentFailed({ 
        email, 
        paymentRef, 
        reason: `Paystack API error: ${verifyRes.status}` 
      })
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    const verifyData = await verifyRes.json()
    
    // Strict verification checks
    if (!verifyData?.status || !verifyData?.data || verifyData.data.status !== 'success') {
      await audit.paymentFailed({ 
        email, 
        paymentRef, 
        reason: `Payment not successful: ${verifyData?.data?.status || 'unknown'}` 
      })
      return NextResponse.json(
        { success: false, error: 'Payment not successful' },
        { status: 400 }
      )
    }

    // Verify customer email matches (prevents using someone else's payment)
    const paystackEmail = verifyData.data.customer?.email?.toLowerCase()
    if (paystackEmail && paystackEmail !== email.toLowerCase()) {
      await audit.paymentFailed({ 
        email, 
        paymentRef, 
        reason: `Email mismatch: ${paystackEmail} vs ${email}` 
      })
      return NextResponse.json(
        { success: false, error: 'Payment email mismatch' },
        { status: 400 }
      )
    }

    // Fetch product with file path
    const supabase = await createClient()
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*, product_addons!inner(addon:addons(*))')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // CRITICAL FIX: Validate addons belong to this product and calculate true price
    let addonData: any[] = []
    let addonsTotal = 0
    
    if (addons?.length > 0) {
      // Get valid addon IDs for this product from the joined data
      const validAddonIds = product.product_addons?.map((pa: any) => pa.addon?.id) || []
      
      // Filter only addons that are actually linked to this product
      const selectedAddons = product.product_addons?.filter((pa: any) => 
        addons.includes(pa.addon?.id)
      ) || []

      if (selectedAddons.length !== addons.length) {
        // Someone tried to add an addon not linked to this product
        await audit.paymentFailed({ 
          email, 
          paymentRef, 
          reason: `Invalid addons selected: ${addons.filter((id: string) => 
            !validAddonIds.includes(id)
          ).join(', ')}` 
        })
        return NextResponse.json(
          { success: false, error: 'Invalid addons selected for this product' },
          { status: 400 }
        )
      }

      addonData = selectedAddons.map((pa: any) => pa.addon)
      addonsTotal = addonData.reduce((sum, a) => sum + Number(a.price), 0)
    }

    // Calculate expected total
    const basePrice = Number(product.price)
    const expectedTotal = basePrice + addonsTotal

    // CRITICAL: Verify Paystack amount matches our calculated total
    // Amount from Paystack is in kobo (smallest currency unit)
    const paystackAmount = Number(verifyData.data.amount)
    const expectedAmountKobo = Math.round(expectedTotal * 100)
    
    if (paystackAmount !== expectedAmountKobo) {
      await audit.paymentFailed({ 
        email, 
        paymentRef, 
        reason: `Amount mismatch: expected ${expectedAmountKobo} kobo, got ${paystackAmount} kobo`,
        metadata: { expected: expectedTotal, received: paystackAmount / 100 }
      })
      return NextResponse.json(
        { success: false, error: 'Payment amount verification failed' },
        { status: 400 }
      )
    }

    // Check for duplicate order (prevent double fulfillment)
    const { data: existingOrder } = await adminClient
      .from('orders')
      .select('id, status')
      .eq('payment_ref', paymentRef)
      .single()

    if (existingOrder) {
      // Already processed - return existing order info with orderId in data
      return NextResponse.json({
        success: true,
        message: 'Order already processed',
        data: {
          orderId: existingOrder.id,
          status: existingOrder.status
        }
      })
    }

    // Generate download URL (24 hour expiry)
    const { data: signedUrlData, error: urlError } = await adminClient.storage
      .from('drawings')
      .createSignedUrl(product.file_path, 60 * 60 * 24)

    if (urlError || !signedUrlData) {
      console.error('Download URL generation failed:', urlError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    const downloadUrl = signedUrlData.signedUrl
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Insert order with all details
    const { data: orderData, error: insertError } = await adminClient
      .from('orders')
      .insert({
        user_id: user.id,
        email,
        product_id: productId,
        total: expectedTotal,
        payment_ref: paymentRef,
        download_url: downloadUrl,
        expires_at: expiresAt,
        status: 'completed',
        addons: addonData.map((a: any) => ({ 
          id: a.id, 
          name: a.name, 
          price: a.price, 
          type: a.type 
        })),
        metadata: {
          paystack_reference: paymentRef,
          paystack_channel: verifyData.data.channel,
          paystack_paid_at: verifyData.data.paid_at,
          ip_address: identifier
        }
      })
      .select()
      .single()

    if (insertError) {
      console.error('Order insertion failed:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create order record' },
        { status: 500 }
      )
    }

    // Handle service addons (create project requests)
    const serviceAddons = addonData.filter((a: any) => a.type === 'service')
    if (serviceAddons.length > 0) {
      const projectInserts = serviceAddons.map((addon: any) => ({
        user_id: user.id,
        order_id: orderData.id,
        email,
        service_type: addon.name, // Use addon name as service type
        status: 'pending',
        description: `Service addon: ${addon.description || addon.name}`,
        created_at: new Date().toISOString()
      }))

      const { error: projectError } = await adminClient
        .from('projects')
        .insert(projectInserts)

      if (projectError) {
        console.error('Project creation failed:', projectError)
        // Don't fail the order, just log it
      } else {
        // Notify admin of new service projects
        try {
          await notifyAdminOfProject(email, serviceAddons.map((a: any) => a.name).join(', '))
        } catch (err) {
          console.error('Admin notification failed:', err)
        }
      }
    }

    // Send receipt email with download link
    try {
      await sendReceiptEmail(email, {
        orderId: orderData.id,
        productTitle: product.title,
        total: expectedTotal,
        downloadUrl,
        expiresAt
      })
    } catch (emailError) {
      console.error('Receipt email failed:', emailError)
      // Don't fail the order if email fails
    }

    // Audit log
    await audit.paymentSuccess({
      userId: user.id,
      email,
      orderId: orderData.id,
      amount: expectedTotal,
      paymentRef,
      metadata: {
        productId,
        addonsCount: addonData.length,
        channel: verifyData.data.channel
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment successful',
      data: {
        orderId: orderData.id,
        downloadUrl,
        expiresAt,
        total: expectedTotal
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