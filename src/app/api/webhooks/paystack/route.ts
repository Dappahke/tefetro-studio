import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { env } from '@/lib/env'
import { adminClient } from '@/lib/supabase/admin'
import { audit } from '@/lib/security/audit-logger'
import crypto from 'crypto'

// Verify Paystack webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', env.server.PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex')
  
  return hash === signature
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const signature = headersList.get('x-paystack-signature')
    
    if (!signature) {
      console.error('No Paystack signature header')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get raw body for signature verification
    const rawBody = await request.text()
    
    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = JSON.parse(rawBody)
    const { event, data } = body

    console.log('Paystack webhook received:', { event, reference: data?.reference })

    // Handle different event types
    switch (event) {
      case 'charge.success':
        // Payment was successful
        const { reference, amount, customer, metadata } = data
        
        // Check if order already exists
        const { data: existingOrder } = await adminClient
          .from('orders')
          .select('id')
          .eq('payment_ref', reference)
          .single()

        if (existingOrder) {
          console.log('Order already processed:', reference)
          return NextResponse.json({ received: true })
        }

        // Create order from webhook
        const { error: insertError } = await adminClient
          .from('orders')
          .insert({
            payment_ref: reference,
            amount: amount / 100, // Convert from kobo
            customer_email: customer.email,
            status: 'completed',
            metadata: metadata || {},
            created_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Failed to create order from webhook:', insertError)
          return NextResponse.json(
            { error: 'Failed to process order' },
            { status: 500 }
          )
        }

        // Log payment success (without webhookReceived)
        await audit.paymentSuccess({
          userId: metadata?.user_id || 'unknown',
          email: customer.email,
          orderId: metadata?.order_id || 'unknown',
          amount: amount / 100,
          paymentRef: reference,
          metadata: { source: 'webhook', ...metadata }
        })

        console.log('Order created from webhook:', reference)
        break

      case 'charge.dispute.create':
        console.log('Dispute created:', data.reference)
        break

      case 'charge.dispute.resolve':
        console.log('Dispute resolved:', data.reference)
        break

      default:
        console.log('Unhandled webhook event:', event)
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}