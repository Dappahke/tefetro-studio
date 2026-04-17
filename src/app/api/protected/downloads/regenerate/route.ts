import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { audit } from '@/lib/security/audit-logger'
import { createHash } from 'crypto'
import { env } from '@/lib/env'

// Token generation function (same as in generate endpoint)
function generateDownloadToken(orderId: string): string {
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
  const signature = createHash('sha256')
    .update(`${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`)
    .digest('hex')
  return `${orderId}:${expiresAt}:${signature}`
}

export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting for regeneration
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.regenerateLink.check(identifier)
    
    if (!rateLimit.success) {
      await audit.securityEvent({
        event: 'regenerate_rate_limited',
        ip: identifier,
        metadata: { 
          retry_after: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }
      })
      
      return NextResponse.json(
        { error: 'Too many regeneration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      )
    }

    // Verify order belongs to user
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('id, status, user_id, regeneration_count')
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return NextResponse.json(
        { error: 'Order not completed yet' },
        { status: 403 }
      )
    }

    // Limit regeneration attempts (max 3 per order)
    if (order.regeneration_count >= 3) {
      return NextResponse.json(
        { error: 'Maximum regeneration attempts reached. Please contact support.' },
        { status: 403 }
      )
    }

    // Generate new token
    const newToken = generateDownloadToken(orderId)
    
    // Update regeneration count in database
    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        regeneration_count: (order.regeneration_count || 0) + 1,
        last_regenerated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update regeneration count:', updateError)
    }

    await audit.downloadLinkGenerated({
      userId: session.user.id,
      orderId: orderId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    })

    return NextResponse.json({
      success: true,
      token: newToken,
      downloadUrl: `/download?token=${encodeURIComponent(newToken)}`,
      expiresIn: 300,
      remainingAttempts: 2 - (order.regeneration_count || 0)
    })

  } catch (err) {
    console.error('Regeneration error:', err)
    return NextResponse.json(
      { error: 'Failed to regenerate download link' },
      { status: 500 }
    )
  }
}