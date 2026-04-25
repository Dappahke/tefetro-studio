// src/app/api/webhooks/paystack/route.ts

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

import { env } from '@/lib/env'
import { adminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

function signPayload(payload: string, secret: string) {
  return crypto
    .createHmac('sha512', secret.trim())
    .update(payload)
    .digest('hex')
}

function safeCompare(a: string, b: string) {
  try {
    const aa = Buffer.from(a)
    const bb = Buffer.from(b)

    if (aa.length !== bb.length) {
      return false
    }

    return crypto.timingSafeEqual(aa, bb)
  } catch {
    return false
  }
}

/* ---------------------------------- */
/* POST                               */
/* ---------------------------------- */

export async function POST(request: Request) {
  try {
    /* Headers */
    const hdr = headers()

    const signature =
      hdr.get('x-paystack-signature') ||
      hdr.get('X-Paystack-Signature') ||
      hdr.get('X-PAYSTACK-SIGNATURE') ||
      ''

    const secret = env.server.PAYSTACK_SECRET_KEY?.trim() || ''
    const rawBody = await request.text()

    /* Debug Logs */
    console.log('[PAYSTACK WEBHOOK]', {
      hasSignature: !!signature,
      signaturePrefix: signature.slice(0, 12),
      secretExists: !!secret,
      secretPrefix: secret.slice(0, 10),
      bodyLength: rawBody.length,
    })

    /* Validate Inputs */
    if (!signature) {
      console.error('[PAYSTACK] Missing signature header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!secret) {
      console.error('[PAYSTACK] Missing PAYSTACK_SECRET_KEY')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    /* Signature Check */
    const expected = signPayload(rawBody, secret)
    const valid = safeCompare(signature, expected)

    if (!valid) {
      console.error('[PAYSTACK] Signature mismatch', {
        received: signature.slice(0, 12),
        expected: expected.slice(0, 12),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    /* Parse Payload */
    const body = JSON.parse(rawBody)
    const { event, data } = body

    console.log('[PAYSTACK] Verified', {
      event,
      reference: data?.reference,
    })

    /* Only handle successful charges */
    if (event !== 'charge.success') {
      return NextResponse.json({ received: true })
    }

    const reference = data.reference
    const email = data.customer?.email || null
    const total = Number(data.amount || 0) / 100
    const metadata = data.metadata || {}

    /* Duplicate Check */
    const { data: existing } = await adminClient
      .from('orders')
      .select('id')
      .eq('payment_ref', reference)
      .maybeSingle()

    if (existing) {
      console.log('[PAYSTACK] Duplicate ignored', reference)
      return NextResponse.json({ received: true })
    }

    /* Insert Order */
    const { error: insertError } = await adminClient.from('orders').insert({
      user_id: metadata.user_id || null,
      email,
      product_id: metadata.product_id || null,
      addons: metadata.addons || [],
      total,
      payment_ref: reference,
      status: 'paid',
      metadata: data,
    })

    if (insertError) {
      console.error('[PAYSTACK] Insert failed', insertError)
      return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
    }

    console.log('[PAYSTACK] Order created', reference)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[PAYSTACK] Fatal', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}