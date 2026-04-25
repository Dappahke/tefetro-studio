// src/app/api/protected/downloads/route.ts
// FINAL API RESPONSE FOR PREMIUM DOWNLOAD PAGE

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

import { adminClient } from '@/lib/supabase/admin'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type OrderRow = {
  id: string
  status: string
  addons: any
  product: {
    title: string
    file_path: string
    addon_documents: any
  } | null
}

/* ---------------------------------- */
/* Verify Token                       */
/* ---------------------------------- */

function verifyToken(
  token: string
) {
  const parts =
    token.split(':')

  if (
    parts.length !== 3
  )
    return null

  const [
    orderId,
    expiresRaw,
    signature,
  ] = parts

  const expiresAt =
    Number(
      expiresRaw
    )

  if (
    Date.now() >
    expiresAt
  )
    return null

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
  )
    return null

  return {
    orderId,
    expiresAt,
  }
}

/* ---------------------------------- */
/* GET                                */
/* ---------------------------------- */

export async function GET(
  request: Request
) {
  try {
    const url =
      new URL(
        request.url
      )

    const token =
      url.searchParams.get(
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
    /* Load Order                         */
    /* ---------------------------------- */

    const {
      data,
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
          addons,
          product:products(
            title,
            file_path,
            addon_documents
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
      !data
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

    const order =
      data as unknown as OrderRow

    if (
      order.status !==
        'paid' &&
      order.status !==
        'completed'
    ) {
      return NextResponse.json(
        {
          error:
            'Order not eligible',
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

    if (!product) {
      return NextResponse.json(
        {
          error:
            'Missing product',
        },
        {
          status: 404,
        }
      )
    }

    const files: any[] =
      []

    /* ---------------------------------- */
    /* Main Product File                  */
    /* ---------------------------------- */

    if (
      product.file_path
    ) {
      const signed =
        await adminClient.storage
          .from(
            'drawings'
          )
          .createSignedUrl(
            product.file_path,
            300
          )

      if (
        signed.data
          ?.signedUrl
      ) {
        files.push({
          id: 'main',
          title:
            product.title,
          filename:
            extractFilename(
              product.file_path
            ),
          url: signed
            .data
            .signedUrl,
          type: 'main',
        })
      }
    }

    /* ---------------------------------- */
    /* Addons                             */
    /* ---------------------------------- */

    const selected =
      Array.isArray(
        order.addons
      )
        ? order.addons
        : []

    const docs =
      product
        .addon_documents ||
      {}

    for (const addonId of selected) {
      const doc =
        docs[
          addonId
        ]

      if (!doc)
        continue

      const signed =
        await adminClient.storage
          .from(
            'drawings'
          )
          .createSignedUrl(
            doc.path,
            300
          )

      if (
        signed.data
          ?.signedUrl
      ) {
        files.push({
          id:
            addonId,
          title:
            doc.title ||
            addonId,
          filename:
            extractFilename(
              doc.path
            ),
          url: signed
            .data
            .signedUrl,
          type: 'addon',
          badge:
            'Selected',
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        productTitle:
          product.title,
        expiresInMinutes: 5,
        files,
      }
    )
  } catch (
    error
  ) {
    console.error(
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

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

function extractFilename(
  path: string
) {
  const split =
    path.split('/')

  return (
    split[
      split.length -
        1
    ] ||
    'file.pdf'
  )
}