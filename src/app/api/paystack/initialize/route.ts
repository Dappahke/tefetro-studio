// NEW FILE
// src/app/api/paystack/initialize/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      email,
      total,
      productId,
      productTitle,
      addons = [],
    } = body

    const secret =
      process.env.PAYSTACK_SECRET_KEY

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL

    if (!secret) {
      return NextResponse.json(
        {
          error:
            'Missing PAYSTACK_SECRET_KEY',
        },
        { status: 500 }
      )
    }

    const amount =
      Math.round(
        Number(total) * 100
      )

    const response =
      await fetch(
        'https://api.paystack.co/transaction/initialize',
        {
          method:
            'POST',
          headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            {
              email,
              amount,
              currency:
                'KES',
              callback_url: `${siteUrl}/checkout/success`,
              metadata: {
                product_id:
                  productId,
                product_title:
                  productTitle,
                addons,
              },
            }
          ),
        }
      )

    const data =
      await response.json()

    if (!data.status) {
      return NextResponse.json(
        {
          error:
            data.message ||
            'Unable to initialize payment',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        authorization_url:
          data.data.authorization_url,
        reference:
          data.data.reference,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Payment initialization failed',
      },
      { status: 500 }
    )
  }
}