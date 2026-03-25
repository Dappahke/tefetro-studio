import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { PaystackWebhookSchema } from '@/lib/security/input-validation'
import { audit } from '@/lib/security/audit-logger'
import { env } from '@/lib/env'
import { sendReceiptEmail } from '@/lib/email'
import { createHash } from 'crypto'
import { logAuditEvent } from '@/lib/security/audit-logger'

// Verify Paystack webhook signature
function verifyPaystackSignature(body: string, signature: string): boolean {
  const hash = createHash('sha512')
    .update(body + env.server.PAYSTACK_SECRET_KEY)
    .digest('hex')
  
  return hash === signature
}

export const dynamic = 'force-dynamic' // ✅ App Router replacement

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    // Verify webhook is from Paystack
    if (!verifyPaystackSignature(body, signature)) {
      await logAuditEvent({
        event: 'payment_failed',
        metadata: { reason: 'Invalid webhook signature' },
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse and validate payload
    const payload = JSON.parse(body)
    const validation = PaystackWebhookSchema.safeParse(payload)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    const { event, data } = validation.data

    // Only handle successful charge events
    if (event !== 'charge.success') {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const { reference, amount, customer } = data

    // Check for duplicate (idempotency)
    const { data: existingOrder } = await adminClient
      .from('orders')
      .select('id')
      .eq('payment_ref', reference)
      .single()

    if (existingOrder) {
      // Already processed
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
    }

    // Find pending order by payment reference (if created by frontend)
    // Or create new order if frontend failed
    const { data: pendingOrder } = await adminClient
      .from('orders')
      .select('*')
      .eq('payment_ref', reference)
      .eq('status', 'pending')
      .single()

    if (pendingOrder) {
      // Update to completed
      const { error: updateError } = await adminClient
        .from('orders')
        .update({
          status: 'completed',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', pendingOrder.id)

      if (updateError) throw updateError

      await audit.paymentSuccess({
        userId: pendingOrder.user_id,
        email: pendingOrder.email,
        orderId: pendingOrder.id,
        amount: amount / 100,
        paymentRef: reference,
      })

      // Resend email (backup)
      try {
        await sendReceiptEmail(pendingOrder.email, pendingOrder.download_url)
      } catch (emailError) {
        console.error('Webhook email failed:', emailError)
      }
    } else {
      // No pending order found — frontend may have failed
      // Log for manual reconciliation
      await logAuditEvent({
        event: 'payment_success',
        metadata: {
          paymentRef: reference,
          amount: amount / 100,
          email: customer.email,
          note: 'No pending order found — requires manual reconciliation',
        },
      })
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (err) {
    console.error('Paystack webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}