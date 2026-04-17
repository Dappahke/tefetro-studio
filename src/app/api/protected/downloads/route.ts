import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/dal'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { env } from '@/lib/env'
import { createHash, timingSafeEqual } from 'crypto'

// Token format: orderId:expiresAt:signature
function verifyDownloadToken(token: string): { 
  orderId: string; 
  expiresAt: number;
  valid: boolean 
} | null {
  try {
    const parts = token.split(':')
    if (parts.length !== 3) return null

    const [orderId, expiresAtStr, signature] = parts
    if (!orderId || !expiresAtStr || !signature) return null

    const expiresAt = parseInt(expiresAtStr, 10)
    if (isNaN(expiresAt) || expiresAt <= 0) return null

    if (Date.now() > expiresAt) {
      return { orderId, expiresAt, valid: false }
    }

    const expectedSignature = createHash('sha256')
      .update(`${orderId}:${expiresAtStr}:${env.server.DOWNLOAD_SECRET}`)
      .digest('hex')

    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (sigBuffer.length !== expectedBuffer.length) return null

    const valid = timingSafeEqual(sigBuffer, expectedBuffer)
    return { orderId, expiresAt, valid }

  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    // Get token from query parameter
    const url = new URL(request.url)
    const rawToken = url.searchParams.get('token')
    
    if (!rawToken) {
      console.error('No token provided in request')
      return NextResponse.json(
        { error: 'No download token provided' },
        { status: 400 }
      )
    }
    
    // Decode the token
    const token = decodeURIComponent(rawToken)
    
    console.log('Download request for token:', token.substring(0, 50) + '...')

    // Rate limiting
    const identifier = getIdentifier(request)
    
    let rateLimit = { success: true }
    try {
      rateLimit = await limiters.download.check(identifier)
    } catch (err) {
      console.warn('Rate limiter not available, skipping')
    }
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many download attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Verify token
    const tokenData = verifyDownloadToken(token)
    
    if (!tokenData) {
      console.error('Invalid token format:', token)
      return NextResponse.json(
        { error: 'Invalid download link format' },
        { status: 403 }
      )
    }

    if (!tokenData.valid) {
      console.log('Token expired for order:', tokenData.orderId)
      return NextResponse.json(
        { 
          error: 'Download link has expired', 
          orderId: tokenData.orderId,
          canRegenerate: true 
        },
        { status: 410 }
      )
    }

    const { orderId } = tokenData

    // Verify authentication
    const session = await verifySession()
    if (!session) {
      console.log('No session for download:', orderId)
      return NextResponse.json(
        { error: 'Authentication required to download' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', session.user.id, 'looking for order:', orderId)

    // Fetch order with adminClient - REMOVED non-existent columns (file_name, file_size, mime_type)
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select(`
        *,
        product:products!product_id(
          id, 
          title, 
          file_path
        )
      `)
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', { 
        orderId, 
        userId: session.user.id, 
        error: orderError 
      })
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      )
    }

    console.log('Order found:', { orderId, status: order.status })

    // Verify order status
    if (order.status !== 'completed') {
      console.log('Order not completed:', { orderId, status: order.status })
      return NextResponse.json(
        { error: `Order is ${order.status}. Download not available.` },
        { status: 403 }
      )
    }

    // Check expiry
    const dbExpiry = new Date(order.expires_at)
    if (dbExpiry < new Date()) {
      console.log('Order expired:', { orderId, expires_at: order.expires_at })
      return NextResponse.json(
        { 
          error: 'Download link has expired', 
          orderId,
          canRegenerate: true 
        },
        { status: 410 }
      )
    }

    // Get file path
    const filePath = order.product?.file_path
    if (!filePath) {
      console.error('No file path for product:', order.product_id)
      return NextResponse.json(
        { error: 'File not available for this product' },
        { status: 404 }
      )
    }

    console.log('Generating signed URL for file:', filePath)

    // Generate signed URL
    const { data: signedUrlData, error: urlError } = await adminClient.storage
      .from('drawings')
      .createSignedUrl(filePath, 60 * 5) // 5 minutes

    if (urlError || !signedUrlData) {
      console.error('Signed URL generation failed:', urlError)
      return NextResponse.json(
        { error: 'Failed to generate download URL. The file may not exist.' },
        { status: 500 }
      )
    }

    console.log('Download ready for order:', orderId)

    // Extract filename from file path
    const filename = filePath.split('/').pop() || 'Architectural-Plan.pdf'

    // Return download info
    return NextResponse.json({
      success: true,
      downloadUrl: signedUrlData.signedUrl,
      expiresIn: 300,
      filename: filename,
      fileSize: null,
      mimeType: 'application/pdf',
      orderId,
      productTitle: order.product?.title || 'Architectural Plan'
    })

  } catch (err) {
    console.error('Download error:', err)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}