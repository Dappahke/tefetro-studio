// src/app/api/paystack/verify/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ error: 'Reference required' }, { status: 400 })
    }

    const secret = process.env.PAYSTACK_SECRET_KEY?.trim()
    if (!secret) {
      return NextResponse.json({ error: 'Misconfigured' }, { status: 500 })
    }

    // Verify with Paystack directly
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      }
    )

    const paystackData = await paystackRes.json()

    if (!paystackData.status || paystackData.data?.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment not verified', paystackMessage: paystackData.message },
        { status: 400 }
      )
    }

    const data = paystackData.data
    const metadata = data.metadata || {}

    const supabase = await createClient()

    // Check if order already exists
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_ref', reference)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ status: 'already_exists', orderId: existing.id })
    }

    // Create order from Paystack data
    const { data: inserted, error: insertError } = await supabase
      .from('orders')
      .insert({
        user_id: metadata.user_id || null,
        email: data.customer?.email,
        product_id: metadata.product_id || null,
        addons: metadata.addons || [],
        total: data.amount / 100,
        payment_ref: reference,
        status: 'paid',
        metadata: data,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[VERIFY] Insert failed:', insertError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    return NextResponse.json({ status: 'created', orderId: inserted.id })
  } catch (error: any) {
    console.error('[VERIFY] Error:', error.message || error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}