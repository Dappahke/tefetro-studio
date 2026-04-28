import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),

  price: z.number().nonnegative(),

  category: z.string().min(1),
  subcategory: z.string().optional().nullable(),

  bedrooms: z.number().int().optional().nullable(),
  bathrooms: z.number().int().optional().nullable(),
  floors: z.number().int().optional().nullable(),

  plinth_area: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  width: z.number().optional().nullable(),

  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),

  file_path: z.string().optional().nullable(),
  elevation_images: z.array(z.string()).optional().default([]),

  addons: z
    .array(
      z.object({
        addon_id: z.string(),
        price_override: z.number().optional().nullable(),
        document_path: z.string().optional().nullable(),
      })
    )
    .optional()
    .default([]),
})

function cleanNumber(value: any) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const num = Number(value)

  return Number.isNaN(num) ? null : num
}

export async function POST(request: Request) {
  console.log('=== ADMIN PRODUCTS POST ===')

  try {
    // 1. Admin auth
    await verifyAdmin()

    // 2. Parse JSON
    let body: any

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // 3. Normalize incoming values
    const normalized = {
      title: body.title,
      description: body.description ?? null,
      slug: body.slug ?? null,

      price: cleanNumber(body.price) ?? 0,

      category: body.category,
      subcategory: body.subcategory ?? null,

      bedrooms: cleanNumber(body.bedrooms),
      bathrooms: cleanNumber(body.bathrooms),
      floors: cleanNumber(body.floors),

      plinth_area: cleanNumber(body.plinth_area),
      length: cleanNumber(body.length),
      width: cleanNumber(body.width),

      meta_title: body.meta_title ?? null,
      meta_description: body.meta_description ?? null,

      file_path: body.file_path ?? null,
      elevation_images: body.elevation_images || [],

      addons: body.addons || [],
    }

    // 4. Validate
    const validation = CreateProductSchema.safeParse(normalized)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validation.error.flatten(),
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // 5. Generate ID
    const id = `prod-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`

    // 6. Insert product
    const insertPayload = {
      id,

      title: data.title,
      description: data.description,
      slug: data.slug,

      price: data.price,

      category: data.category,
      subcategory: data.subcategory,

      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      floors: data.floors,

      plinth_area: data.plinth_area,
      length: data.length,
      width: data.width,

      meta_title: data.meta_title,
      meta_description: data.meta_description,

      file_path: data.file_path,
      elevation_images: data.elevation_images,
    }

    const { data: product, error: insertError } =
      await adminClient
        .from('products')
        .insert(insertPayload)
        .select()
        .single()

    if (insertError) {
      console.error(insertError)

      return NextResponse.json(
        {
          error: 'Failed to create product',
          details: insertError.message,
        },
        { status: 500 }
      )
    }

    // 7. Insert addons
    if (data.addons.length > 0) {
      const rows = data.addons.map((item) => ({
        product_id: id,
        addon_id: item.addon_id,
        price_override: item.price_override ?? null,
        document_path: item.document_path ?? null,
      }))

      const { error: addonError } = await adminClient
        .from('product_addons')
        .insert(rows)

      if (addonError) {
        console.error('Addon insert error:', addonError)
      }
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (err: any) {
    console.error(err)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err.message,
      },
      { status: 500 }
    )
  }
}

// GET products
export async function GET() {
  try {
    await verifyAdmin()

    const { data, error } = await adminClient
      .from('products')
      .select(
        `
        *,
        product_addons (
          addon_id,
          price_override,
          document_path,
          addon:addons (*)
        )
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch products',
          details: error.message,
        },
        { status: 500 }
      )
    }

    const products = (data || []).map((item: any) => ({
      ...item,
      addons:
        item.product_addons?.map((row: any) => ({
          ...row.addon,
          price_override: row.price_override,
          document_path: row.document_path,
        })) || [],
    }))

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err.message,
      },
      { status: 500 }
    )
  }
}