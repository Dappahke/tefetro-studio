// src/app/api/protected/downloads/route.ts

import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/dal'
import {
  limiters,
  getIdentifier,
} from '@/lib/security/rate-limiter'
import { env } from '@/lib/env'
import {
  createHash,
  timingSafeEqual,
} from 'crypto'

export const dynamic =
  'force-dynamic'

export const revalidate = 0

/* ---------------------------------- */
/* Token Format                       */
/* orderId:expiresAt:signature        */
/* ---------------------------------- */

function verifyDownloadToken(
  token: string
):
  | {
      orderId: string
      expiresAt: number
      valid: boolean
    }
  | null {
  try {
    const parts =
      token.split(':')

    if (
      parts.length !== 3
    )
      return null

    const [
      orderId,
      expiresAtStr,
      signature,
    ] = parts

    if (
      !orderId ||
      !expiresAtStr ||
      !signature
    )
      return null

    const expiresAt =
      parseInt(
        expiresAtStr,
        10
      )

    if (
      isNaN(
        expiresAt
      )
    )
      return null

    if (
      Date.now() >
      expiresAt
    ) {
      return {
        orderId,
        expiresAt,
        valid: false,
      }
    }

    const expected =
      createHash(
        'sha256'
      )
        .update(
          `${orderId}:${expiresAtStr}:${env.server.DOWNLOAD_SECRET}`
        )
        .digest(
          'hex'
        )

    const a =
      Buffer.from(
        signature
      )

    const b =
      Buffer.from(
        expected
      )

    if (
      a.length !==
      b.length
    )
      return null

    const valid =
      timingSafeEqual(
        a,
        b
      )

    return {
      orderId,
      expiresAt,
      valid,
    }
  } catch (
    error
  ) {
    console.error(
      'Token verify failed:',
      error
    )
    return null
  }
}

/* ---------------------------------- */
/* GET                                */
/* ---------------------------------- */

export async function GET(
  request: Request
) {
  try {
    /* ------------------------------ */
    /* Query Params                   */
    /* ------------------------------ */

    const url =
      new URL(
        request.url
      )

    const rawToken =
      url.searchParams.get(
        'token'
      )

    if (
      !rawToken
    ) {
      return NextResponse.json(
        {
          error:
            'Missing token',
        },
        {
          status: 400,
        }
      )
    }

    const token =
      decodeURIComponent(
        rawToken
      )

    /* ------------------------------ */
    /* Rate Limit                     */
    /* ------------------------------ */

    try {
      const identifier =
        getIdentifier(
          request
        )

      const result =
        await limiters.download.check(
          identifier
        )

      if (
        !result.success
      ) {
        return NextResponse.json(
          {
            error:
              'Too many attempts. Please try again later.',
          },
          {
            status: 429,
          }
        )
      }
    } catch {
      console.warn(
        'Rate limiter unavailable'
      )
    }

    /* ------------------------------ */
    /* Verify Token                   */
    /* ------------------------------ */

    const parsed =
      verifyDownloadToken(
        token
      )

    if (
      !parsed
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid token',
        },
        {
          status: 403,
        }
      )
    }

    if (
      !parsed.valid
    ) {
      return NextResponse.json(
        {
          error:
            'Download link expired',
          orderId:
            parsed.orderId,
          canRegenerate:
            true,
        },
        {
          status: 410,
        }
      )
    }

    /* ------------------------------ */
    /* Auth Required                  */
    /* ------------------------------ */

    const session =
      await verifySession()

    if (
      !session
    ) {
      return NextResponse.json(
        {
          error:
            'Authentication required',
        },
        {
          status: 401,
        }
      )
    }

    /* ------------------------------ */
    /* Fetch Order                    */
    /* ------------------------------ */

    const {
      data: order,
      error:
        orderError,
    } =
      await adminClient
        .from(
          'orders'
        )
        .select(
          `
          id,
          user_id,
          status,
          expires_at,
          product_id,
          product:products!product_id(
            id,
            title,
            file_path
          )
        `
        )
        .eq(
          'id',
          parsed.orderId
        )
        .eq(
          'user_id',
          session.user.id
        )
        .single()

    if (
      orderError ||
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

    /* ------------------------------ */
    /* Status Fix                     */
    /* Allow paid OR completed        */
    /* ------------------------------ */

    if (
      order.status !==
        'paid' &&
      order.status !==
        'completed'
    ) {
      return NextResponse.json(
        {
          error: `Order is ${order.status}. Download unavailable.`,
        },
        {
          status: 403,
        }
      )
    }

    /* ------------------------------ */
    /* Expiry Check                   */
    /* ------------------------------ */

    if (
      order.expires_at
    ) {
      const dbExpiry =
        new Date(
          order.expires_at
        )

      if (
        dbExpiry <
        new Date()
      ) {
        return NextResponse.json(
          {
            error:
              'Download link expired',
            orderId:
              order.id,
            canRegenerate:
              true,
          },
          {
            status: 410,
          }
        )
      }
    }

    /* ------------------------------ */
    /* File Path                      */
    /* ------------------------------ */

      const product = Array.isArray(order.product)
        ? order.product[0]
        : order.product

      const filePath =
        product?.file_path

    if (
      !filePath
    ) {
      return NextResponse.json(
        {
          error:
            'No file available',
        },
        {
          status: 404,
        }
      )
    }

    /* ------------------------------ */
    /* Signed URL                     */
    /* ------------------------------ */

    const {
      data:
        signedData,
      error:
        signedError,
    } =
      await adminClient.storage
        .from(
          'drawings'
        )
        .createSignedUrl(
          filePath,
          60 * 5
        )

    if (
      signedError ||
      !signedData
    ) {
      return NextResponse.json(
        {
          error:
            'Unable to generate secure file link',
        },
        {
          status: 500,
        }
      )
    }

    const filename =
      filePath
        .split('/')
        .pop() ||
      'Architectural-Plan.pdf'

    return NextResponse.json(
      {
        success: true,
        orderId:
          order.id,
        filename,
        fileSize: null,
        mimeType:
          'application/pdf',
        expiresIn: 300,
        downloadUrl:
          signedData.signedUrl,
        productTitle:
          product?.title ||
          'Architectural Plan',
      }
    )
  } catch (
    error
  ) {
    console.error(
      'Download route error:',
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