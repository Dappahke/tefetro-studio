import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { createHash } from 'crypto'
import { env } from '@/lib/env'

// This MUST match the verification function in the download endpoint
// Token format: orderId:expiresAt:signature
function generateDownloadToken(orderId: string): string {
  // Token expires in 5 minutes (300 seconds)
  const expiresAt = Date.now() + 5 * 60 * 1000
  
  // Create signature using HMAC-SHA256 - MUST match verification
  const signature = createHash('sha256')
    .update(`${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`)
    .digest('hex')
  
  // Return token in the exact format: orderId:expiresAt:signature
  return `${orderId}:${expiresAt}:${signature}`
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    console.log('Generate token request received')

    // Verify user is authenticated
    const session = await verifySession()
    if (!session) {
      console.log('Unauthorized: No session')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = await params
    console.log('Generating token for order:', orderId, 'User:', session.user.id)

    // Verify the order belongs to this user and is completed
    // Use adminClient to bypass RLS
    const { data: order, error } = await adminClient
      .from('orders')
      .select('id, status, user_id')
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .single()

    if (error || !order) {
      console.error('Order not found:', { orderId, userId: session.user.id, error })
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.status !== 'completed') {
      console.log('Order not completed:', { orderId, status: order.status })
      return NextResponse.json(
        { error: 'Order not completed yet' },
        { status: 403 }
      )
    }

    // Generate the download token
    const token = generateDownloadToken(orderId)
    console.log('Token generated successfully for order:', orderId)

    return NextResponse.json({
      success: true,
      token: token,
      downloadUrl: `/download?token=${encodeURIComponent(token)}`,
      expiresIn: 300 // 5 minutes in seconds
    })

  } catch (err) {
    console.error('Token generation error:', err)
    return NextResponse.json(
      { error: 'Failed to generate download token' },
      { status: 500 }
    )
  }
}