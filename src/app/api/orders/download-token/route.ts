// NEW FILE
// src/app/api/orders/download-token/route.ts

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

import { adminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/dal'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function createDownloadToken(
  orderId: string,
  expiresAt: number
) {
  const signature =
    createHash('sha256')
      .update(
        `${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`
      )
      .digest('hex')

  return `${orderId}:${expiresAt}:${signature}`
}

export async function GET(
  request: Request
) {
  try {
    const session =
      await verifySession()

    if (!session) {
      return NextResponse.json(
        {
          error:
            'Authentication required',
        },
        { status: 401 }
      )
    }

    const url =
      new URL(
        request.url
      )

    const reference =
      url.searchParams.get(
        'reference'
      )

    const orderIdParam =
      url.searchParams.get(
        'orderId'
      )

    if (
      !reference &&
      !orderIdParam
    ) {
      return NextResponse.json(
        {
          error:
            'reference or orderId is required',
        },
        { status: 400 }
      )
    }

    /* ---------------------------------- */
    /* Find Order                         */
    /* ---------------------------------- */

    let query =
      adminClient
        .from('orders')
        .select(
          `
          id,
          user_id,
          payment_ref,
          status,
          expires_at,
          product_id
        `
        )
        .eq(
          'user_id',
          session.user.id
        )
        .limit(1)

    if (reference) {
      query =
        query.eq(
          'payment_ref',
          reference
        )
    } else {
      query =
        query.eq(
          'id',
          orderIdParam
        )
    }

    const {
      data: order,
      error,
    } = await query.single()

    if (
      error ||
      !order
    ) {
      return NextResponse.json(
        {
          error:
            'Order not found',
        },
        { status: 404 }
      )
    }

    /* ---------------------------------- */
    /* Validate Status                    */
    /* ---------------------------------- */

    if (
      order.status !==
        'paid' &&
      order.status !==
        'completed'
    ) {
      return NextResponse.json(
        {
          error: `Order status is ${order.status}`,
        },
        { status: 403 }
      )
    }

    /* ---------------------------------- */
    /* Token Expiry                       */
    /* ---------------------------------- */

    const expiresAt =
      Date.now() +
      1000 *
        60 *
        5 // 5 mins

    const token =
      createDownloadToken(
        order.id,
        expiresAt
      )

    /* ---------------------------------- */
    /* Persist token                      */
    /* ---------------------------------- */

    await adminClient
      .from('orders')
      .update({
        download_url:
          token,
        expires_at:
          new Date(
            expiresAt
          ).toISOString(),
        last_regenerated_at:
          new Date().toISOString(),
        regeneration_count:
          1,
      })
      .eq(
        'id',
        order.id
      )

    return NextResponse.json(
      {
        success: true,
        token,
        expiresAt,
        redirectUrl: `/download?token=${encodeURIComponent(
          token
        )}`,
        orderId:
          order.id,
      }
    )
  } catch (error) {
    console.error(
      'download-token error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Unable to create download token',
      },
      { status: 500 }
    )
  }
}