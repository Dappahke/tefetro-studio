import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/dal'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { audit } from '@/lib/security/audit-logger'
import { env } from '@/lib/env'
import { createHash, timingSafeEqual } from 'crypto'

// Token format: orderId:expiresAt:signature
// Signature = HMAC(orderId + expiresAt, DOWNLOAD_SECRET)

function verifyDownloadToken(token: string): { orderId: string; expiresAt: number } | null {
  try {
    const [orderId, expiresAtStr, signature] = token.split(':')
    if (!orderId || !expiresAtStr || !signature) return null

    const expiresAt = parseInt(expiresAtStr, 10)
    if (isNaN(expiresAt)) return null

    // Check if expired
    if (Date.now() > expiresAt) return null

    // Verify signature
    const expectedSignature = createHash('sha256')
      .update(`${orderId}:${expiresAtStr}:${env.server.DOWNLOAD_SECRET}`)
      .digest('hex')

    // Timing-safe comparison to prevent timing attacks
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null
    }

    return { orderId, expiresAt }
  } catch {
    return null
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Rate limiting
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.regenerateLink.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Verify token
    const tokenData = verifyDownloadToken(token)
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired download link' },
        { status: 403 }
      )
    }

    const { orderId, expiresAt } = tokenData

    // Authentication required
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify order ownership
    const supabase = await createClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, product:products(file_path)')
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      )
    }

    // Double-check expiry in database
    if (new Date(order.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Download link expired', orderId },
        { status: 410 }
      )
    }

    // Generate fresh signed URL for Supabase Storage
    const filePath = order.product?.file_path
    if (!filePath) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    const { data: signedUrlData, error: urlError } = await adminClient.storage
      .from('drawings')
      .createSignedUrl(filePath, 60 * 5) // 5 minutes for actual download

    if (urlError || !signedUrlData) {
      return NextResponse.json(
        { error: 'Failed to generate download URL' },
        { status: 500 }
      )
    }

    // Log download
    await audit.downloadCompleted({
      userId: session.user.id,
      orderId,
      ip: identifier,
    })

    // Return the temporary URL or stream based on your preference
    // Option 1: Redirect to signed URL (simple, but URL is visible)
    // return NextResponse.redirect(signedUrlData.signedUrl)

    // Option 2: Return URL for frontend to handle (more control)
    return NextResponse.json({
      success: true,
      downloadUrl: signedUrlData.signedUrl,
      expiresIn: 300, // 5 minutes
      filename: filePath.split('/').pop(),
    })

  } catch (err) {
    console.error('Download error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}