import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/dal'
import { RegenerateLinkSchema } from '@/lib/security/input-validation'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { audit } from '@/lib/security/audit-logger'
import { sendReceiptEmail } from '@/lib/email'
import { createHash, randomBytes } from 'crypto'
import { env } from '@/lib/env'

// Generate new download token
function generateDownloadToken(orderId: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  const signature = createHash('sha256')
    .update(`${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`)
    .digest('hex')
  
  return `${orderId}:${expiresAt}:${signature}`
}

export async function POST(request: Request) {
  try {
    // Rate limiting — strict for link regeneration
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.regenerateLink.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many regeneration attempts. Contact support.' },
        { status: 429 }
      )
    }

    // Authentication required
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate input
    const body = await request.json()
    const validation = RegenerateLinkSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    const { orderId } = validation.data

    // Verify order ownership and existence
    const supabase = await createClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, product:products(file_path, title)')
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Generate new signed URL for storage
    const filePath = order.product?.file_path
    if (!filePath) {
      return NextResponse.json(
        { error: 'Product file not available' },
        { status: 404 }
      )
    }

    const { data: signedUrlData, error: urlError } = await adminClient.storage
      .from('drawings')
      .createSignedUrl(filePath, 60 * 60 * 24) // 24 hours

    if (urlError || !signedUrlData) {
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    // Update order with new expiry
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        download_url: signedUrlData.signedUrl,
        expires_at: newExpiresAt,
      })
      .eq('id', orderId)

    if (updateError) {
      throw updateError
    }

    // Generate new token for future downloads
    const newToken = generateDownloadToken(orderId)

    // Log regeneration
    await audit.linkRegenerated({
      userId: session.user.id,
      orderId,
    })

    // Send new email
    try {
      await sendReceiptEmail(session.email, signedUrlData.signedUrl)
    } catch (emailError) {
      console.error('Regeneration email failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'New download link generated and sent to your email',
      token: newToken,
      expiresAt: newExpiresAt,
    })

  } catch (err) {
    console.error('Regenerate link error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}