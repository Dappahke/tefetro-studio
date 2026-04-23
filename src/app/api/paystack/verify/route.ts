// NEW FILE
// src/app/api/paystack/verify/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest
) {
  try {
    const reference =
      req.nextUrl.searchParams.get(
        'reference'
      )

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing payment reference',
        },
        { status: 400 }
      )
    }

    const secret =
      process.env.PAYSTACK_SECRET_KEY

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing PAYSTACK_SECRET_KEY',
        },
        { status: 500 }
      )
    }

    const response =
      await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method:
            'GET',
          headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type':
              'application/json',
          },
          cache: 'no-store',
        }
      )

    const data =
      await response.json()

    if (
      !data.status ||
      !data.data
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            data.message ||
            'Unable to verify payment',
        },
        { status: 400 }
      )
    }

    const payment =
      data.data

    const isPaid =
      payment.status ===
      'success'

    return NextResponse.json(
      {
        success:
          isPaid,
        reference:
          payment.reference,
        amount:
          Number(
            payment.amount
          ) / 100,
        currency:
          payment.currency,
        paid_at:
          payment.paid_at,
        customer:
          payment.customer,
        metadata:
          payment.metadata,
        gateway_response:
          payment.gateway_response,
        status:
          payment.status,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Payment verification failed',
      },
      { status: 500 }
    )
  }
}