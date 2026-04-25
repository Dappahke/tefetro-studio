// src/app/download/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

import { env } from '@/lib/env'
import { adminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ---------------------------------- */
/* Token Verification                 */
/* ---------------------------------- */

function verifyToken(
  token: string
) {
  try {
    const parts =
      token.split(':')

    if (
      parts.length !== 3
    ) {
      return null
    }

    const [
      orderId,
      expiresAtRaw,
      signature,
    ] = parts

    const expiresAt =
      Number(
        expiresAtRaw
      )

    if (
      !orderId ||
      !expiresAt ||
      !signature
    ) {
      return null
    }

    if (
      Date.now() >
      expiresAt
    ) {
      return null
    }

    const expected =
      createHash(
        'sha256'
      )
        .update(
          `${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`
        )
        .digest(
          'hex'
        )

    if (
      expected !==
      signature
    ) {
      return null
    }

    return {
      orderId,
    }
  } catch {
    return null
  }
}

/* ---------------------------------- */
/* GET                                */
/* ---------------------------------- */

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      slug: string
    }
  }
) {
  try {
    const token =
      request.nextUrl.searchParams.get(
        'token'
      )

    if (!token) {
      return NextResponse.json(
        {
          error:
            'Missing token',
        },
        {
          status: 401,
        }
      )
    }

    const verified =
      verifyToken(
        token
      )

    if (!verified) {
      return NextResponse.json(
        {
          error:
            'Invalid or expired token',
        },
        {
          status: 401,
        }
      )
    }

    /* ---------------------------------- */
    /* Get Order + Product               */
    /* ---------------------------------- */

    const {
      data: order,
      error,
    } =
      await adminClient
        .from(
          'orders'
        )
        .select(
          `
          id,
          status,
          product:products(
            id,
            title,
            file_path
          )
        `
        )
        .eq(
          'id',
          verified.orderId
        )
        .single()

    if (
      error ||
      !order
    ) {
      return NextResponse.json(
        {
          error:
            'Order not found',
        },
        {
          status: 404,
        }
      )
    }

    if (
      order.status !==
        'paid' &&
      order.status !==
        'completed'
    ) {
      return NextResponse.json(
        {
          error:
            'Order not paid',
        },
        {
          status: 403,
        }
      )
    }

    const product =
      Array.isArray(
        order.product
      )
        ? order
            .product[0]
        : order.product

    const filePath =
      product
        ?.file_path

    if (
      !filePath
    ) {
      return NextResponse.json(
        {
          error:
            'File unavailable',
        },
        {
          status: 404,
        }
      )
    }

    /* ---------------------------------- */
    /* Signed URL via Service Role       */
    /* ---------------------------------- */

    const {
      data:
        signedData,
      error:
        signError,
    } =
      await adminClient
        .storage
        .from(
          'drawings'
        )
        .createSignedUrl(
          filePath,
          60
        )

    if (
      signError ||
      !signedData
        ?.signedUrl
    ) {
      return NextResponse.json(
        {
          error:
            'Unable to create file link',
        },
        {
          status: 500,
        }
      )
    }

    /* ---------------------------------- */
    /* Redirect User                     */
    /* ---------------------------------- */

    return NextResponse.redirect(
      signedData.signedUrl,
      302
    )
  } catch (
    error
  ) {
    console.error(
      'download route error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Download failed',
      },
      {
        status: 500,
      }
    )
  }
}