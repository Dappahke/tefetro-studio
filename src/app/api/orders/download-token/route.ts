// src/app/api/orders/download-token/route.ts

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

import { adminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/dal'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ---------------------------------- */
/* Token Builder                      */
/* ---------------------------------- */

function createDownloadToken(
  orderId: string,
  expiresAt: number
) {
  const signature = createHash('sha256')
    .update(`${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`)
    .digest('hex')

  return `${orderId}:${expiresAt}:${signature}`
}

/* ---------------------------------- */
/* Verify with Paystack (self-heal)   */
/* ---------------------------------- */

async function verifyWithPaystack(reference: string) {
  const secret = env.server.PAYSTACK_SECRET_KEY?.trim()

  if (!secret) return null

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
    }
  )

  if (!res.ok) return null

  const data = await res.json()
  return data.status && data.data?.status === 'success' ? data.data : null
}

/* ---------------------------------- */
/* GET                                */
/* ---------------------------------- */

export async function GET(request: Request) {
  try {
    /* Auth */
    const session = await verifySession()

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const sessionUserId = session.user.id
    const sessionEmail = (session.user.email || session.email || '').trim().toLowerCase()

    /* Params */
    const url = new URL(request.url)
    const reference = url.searchParams.get('reference')
    const orderIdParam = url.searchParams.get('orderId')

    if (!reference && !orderIdParam) {
      return NextResponse.json(
        { error: 'reference or orderId is required' },
        { status: 400 }
      )
    }

    /* Find Order */
    let query = adminClient
      .from('orders')
      .select(
        `
        id,
        user_id,
        email,
        payment_ref,
        status,
        expires_at,
        product_id,
        regeneration_count
      `
      )
      .limit(1)

    if (reference) {
      query = query.eq('payment_ref', reference)
    } else {
      query = query.eq('id', orderIdParam)
    }

    let { data: order, error } = await query.single()

    /* ── SELF-HEAL: Order missing, verify with Paystack ── */
    if ((error || !order) && reference) {
      console.log('[DOWNLOAD] Order not found locally, verifying with Paystack:', reference)

      const paystackData = await verifyWithPaystack(reference)

      if (!paystackData) {
        return NextResponse.json(
          { error: 'Order not found and payment not verified' },
          { status: 404 }
        )
      }

      /* Create order from Paystack data */
      const metadata = paystackData.metadata || {}
      const email = paystackData.customer?.email || sessionEmail

      const { data: inserted, error: insertError } = await adminClient
        .from('orders')
        .insert({
          user_id: sessionUserId,
          email,
          product_id: metadata.product_id || null,
          addons: metadata.addons || [],
          total: paystackData.amount / 100,
          payment_ref: reference,
          status: 'paid',
          metadata: paystackData,
        })
        .select(
          `
          id,
          user_id,
          email,
          payment_ref,
          status,
          expires_at,
          product_id,
          regeneration_count
        `
        )
        .single()

      if (insertError || !inserted) {
        console.error('[DOWNLOAD] Self-heal insert failed:', insertError)
        return NextResponse.json(
          { error: 'Failed to create order from payment' },
          { status: 500 }
        )
      }

      order = inserted
      console.log('[DOWNLOAD] Order self-healed:', order.id)
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    /* Ownership Validation */
    const orderUserId = order.user_id
    const orderEmail = (order.email || '').trim().toLowerCase()

    const ownsByUserId = !!orderUserId && orderUserId === sessionUserId
    const ownsByEmail = !orderUserId && !!orderEmail && orderEmail === sessionEmail

    if (!ownsByUserId && !ownsByEmail) {
      return NextResponse.json(
        { error: 'Unauthorized order access' },
        { status: 403 }
      )
    }

    /* Self-heal old rows missing user_id */
    if (!orderUserId && ownsByEmail) {
      await adminClient
        .from('orders')
        .update({ user_id: sessionUserId })
        .eq('id', order.id)
    }

    /* Status Validation */
    if (order.status !== 'paid' && order.status !== 'completed') {
      return NextResponse.json(
        { error: `Order status is ${order.status}` },
        { status: 403 }
      )
    }

    /* Token Build */
    const expiresAt = Date.now() + 1000 * 60 * 5 // 5 minutes
    const token = createDownloadToken(order.id, expiresAt)

    const currentCount = Number(order.regeneration_count || 0)

    /* Persist Token */
    await adminClient
      .from('orders')
      .update({
        download_url: token,
        expires_at: new Date(expiresAt).toISOString(),
        last_regenerated_at: new Date().toISOString(),
        regeneration_count: currentCount + 1,
      })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      token,
      expiresAt,
      redirectUrl: `/download?token=${encodeURIComponent(token)}`,
      orderId: order.id,
    })
  } catch (error) {
    console.error('download-token error:', error)
    return NextResponse.json(
      { error: 'Unable to create download token' },
      { status: 500 }
    )
  }
}