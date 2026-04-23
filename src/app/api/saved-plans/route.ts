// src/app/api/saved-plans/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase =
      await createClient()

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser()

    if (!user) {
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

    const {
      data,
      error,
    } =
      await supabase
        .from(
          'saved_plans'
        )
        .select(
          `
          id,
          created_at,
          product_id,
          products (
            id,
            slug,
            title,
            price,
            category,
            bedrooms,
            bathrooms,
            plinth_area,
            elevation_images
          )
        `
        )
        .eq(
          'user_id',
          user.id
        )
        .order(
          'created_at',
          {
            ascending: false,
          }
        )

    if (error)
      throw error

    return NextResponse.json(
      data
    )
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Unable to fetch saved plans.',
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(
  req: Request
) {
  try {
    const supabase =
      await createClient()

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser()

    if (!user) {
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

    const {
      productId,
    } =
      await req.json()

    if (!productId) {
      return NextResponse.json(
        {
          error:
            'Product required',
        },
        {
          status: 400,
        }
      )
    }

    const {
      error,
    } =
      await supabase
        .from(
          'saved_plans'
        )
        .upsert(
          {
            user_id:
              user.id,
            product_id:
              productId,
          },
          {
            onConflict:
              'user_id,product_id',
          }
        )

    if (error)
      throw error

    return NextResponse.json(
      {
        success: true,
      }
    )
  } catch {
    return NextResponse.json(
      {
        error:
          'Unable to save plan.',
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  req: Request
) {
  try {
    const supabase =
      await createClient()

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser()

    if (!user) {
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

    const {
      productId,
    } =
      await req.json()

    const {
      error,
    } =
      await supabase
        .from(
          'saved_plans'
        )
        .delete()
        .eq(
          'user_id',
          user.id
        )
        .eq(
          'product_id',
          productId
        )

    if (error)
      throw error

    return NextResponse.json(
      {
        success: true,
      }
    )
  } catch {
    return NextResponse.json(
      {
        error:
          'Unable to remove plan.',
      },
      {
        status: 500,
      }
    )
  }
}