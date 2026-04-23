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

function createSignature(
  payload: string,
  secret: string
) {
  return crypto
    .createHmac(
      'sha512',
      secret.trim()
    )
    .update(payload)
    .digest('hex')
}

function safeEqual(
  a: string,
  b: string
) {
  try {
    const aa =
      Buffer.from(
        a
      )

    const bb =
      Buffer.from(
        b
      )

    if (
      aa.length !==
      bb.length
    ) {
      return false
    }

    return crypto.timingSafeEqual(
      aa,
      bb
    )
  } catch {
    return false
  }
}

/* ---------------------------------- */
/* POST                               */
/* ---------------------------------- */

export async function POST(
  request: Request
) {
  try {
    const hdr =
      await headers()

    const signature =
      hdr.get(
        'x-paystack-signature'
      )

    const rawBody =
      await request.text()

    const secret =
      env.server
        .PAYSTACK_SECRET_KEY

    /* ---------------------------------- */
    /* Debug Logs                         */
    /* ---------------------------------- */

    console.log(
      '[PAYSTACK WEBHOOK]',
      {
        hasSignature:
          !!signature,
        sigPrefix:
          signature?.slice(
            0,
            12
          ),
        secretExists:
          !!secret,
        secretPrefix:
          secret?.slice(
            0,
            10
          ),
        bodyLength:
          rawBody.length,
      }
    )

    /* ---------------------------------- */
    /* Header Missing                     */
    /* ---------------------------------- */

    if (
      !signature
    ) {
      console.error(
        '[PAYSTACK WEBHOOK] Missing signature header'
      )

      return NextResponse.json(
        {
          error:
            'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    /* ---------------------------------- */
    /* Secret Missing                     */
    /* ---------------------------------- */

    if (
      !secret
    ) {
      console.error(
        '[PAYSTACK WEBHOOK] Missing PAYSTACK_SECRET_KEY'
      )

      return NextResponse.json(
        {
          error:
            'Server misconfiguration',
        },
        {
          status: 500,
        }
      )
    }

    /* ---------------------------------- */
    /* Verify Signature                   */
    /* ---------------------------------- */

    const expected =
      createSignature(
        rawBody,
        secret
      )

    const verified =
      safeEqual(
        signature,
        expected
      )

    if (
      !verified
    ) {
      console.error(
        '[PAYSTACK WEBHOOK] Signature mismatch',
        {
          expectedPrefix:
            expected.slice(
              0,
              12
            ),
          receivedPrefix:
            signature.slice(
              0,
              12
            ),
        }
      )

      return NextResponse.json(
        {
          error:
            'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    /* ---------------------------------- */
    /* Parse Event                        */
    /* ---------------------------------- */

    const body =
      JSON.parse(
        rawBody
      )

    const {
      event,
      data,
    } = body

    console.log(
      '[PAYSTACK WEBHOOK] Verified',
      {
        event,
        reference:
          data?.reference,
      }
    )

    /* ---------------------------------- */
    /* Only Handle Success                */
    /* ---------------------------------- */

    if (
      event !==
      'charge.success'
    ) {
      return NextResponse.json(
        {
          received: true,
        }
      )
    }

    const reference =
      data.reference

    const customerEmail =
      data.customer
        ?.email ||
      null

    const amount =
      Number(
        data.amount ||
          0
      ) / 100

    const metadata =
      data.metadata ||
      {}

    /* ---------------------------------- */
    /* Duplicate Check                    */
    /* ---------------------------------- */

    const {
      data: existing,
    } =
      await adminClient
        .from(
          'orders'
        )
        .select(
          'id'
        )
        .eq(
          'payment_ref',
          reference
        )
        .maybeSingle()

    if (
      existing
    ) {
      console.log(
        '[PAYSTACK WEBHOOK] Duplicate ignored',
        reference
      )

      return NextResponse.json(
        {
          received: true,
        }
      )
    }

    /* ---------------------------------- */
    /* Insert Order                       */
    /* ---------------------------------- */

    const {
      error:
        insertError,
    } =
      await adminClient
        .from(
          'orders'
        )
        .insert({
          user_id:
            metadata.user_id ||
            null,

          email:
            customerEmail,

          product_id:
            metadata.product_id ||
            null,

          addons:
            metadata.addons ||
            [],

          total:
            amount,

          payment_ref:
            reference,

          status:
            'paid',

          metadata:
            metadata,
        })

    if (
      insertError
    ) {
      console.error(
        '[PAYSTACK WEBHOOK] Insert failed',
        insertError
      )

      return NextResponse.json(
        {
          error:
            'Insert failed',
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      '[PAYSTACK WEBHOOK] Order created',
      reference
    )

    return NextResponse.json(
      {
        received: true,
      }
    )
  } catch (
    error
  ) {
    console.error(
      '[PAYSTACK WEBHOOK] Fatal error',
      error
    )

    return NextResponse.json(
      {
        error:
          'Internal server error',
      },
      {
        status: 500,
      }
    )
  }
}