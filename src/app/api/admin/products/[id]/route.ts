import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/dal'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { audit } from '@/lib/security/audit-logger'

// GET: Single product with addons
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    await verifyAdmin()

    const { id } = params

    // Fetch product
    const { data: product, error: productError } = await adminClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Fetch linked addons
    const { data: linkedAddons } = await adminClient
      .from('product_addons')
      .select('addon_id')
      .eq('product_id', id)

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        linked_addons: linkedAddons?.map((la: any) => la.addon_id) || [],
      },
    })

  } catch (err) {
    console.error('Admin product GET error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH: Update product
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const session = await verifyAdmin()

    const { id } = params
    const body = await request.json()

    const { title, description, price, category, file_path, addon_ids, ...specs } = body

    // Update product
    const { data: product, error: productError } = await adminClient
      .from('products')
      .update({
        title,
        description: description || null,
        price: price ? Number(price) : undefined,
        category: category || undefined,
        file_path: file_path || undefined,
        bedrooms: specs.bedrooms !== undefined ? specs.bedrooms : undefined,
        bathrooms: specs.bathrooms !== undefined ? specs.bathrooms : undefined,
        floors: specs.floors !== undefined ? specs.floors : undefined,
        plinth_area: specs.plinth_area !== undefined ? specs.plinth_area : undefined,
        length: specs.length !== undefined ? specs.length : undefined,
        width: specs.width !== undefined ? specs.width : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (productError) throw productError

    // Update addon links if provided
    if (addon_ids !== undefined) {
      // Remove existing links
      await adminClient
        .from('product_addons')
        .delete()
        .eq('product_id', id)

      // Add new links
      if (addon_ids.length > 0) {
        const addonLinks = addon_ids.map((addonId: string) => ({
          product_id: id,
          addon_id: addonId,
        }))

        await adminClient
          .from('product_addons')
          .insert(addonLinks)
      }
    }

    return NextResponse.json({
      success: true,
      data: product,
    })

  } catch (err) {
    console.error('Admin product PATCH error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE: Delete product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const session = await verifyAdmin()

    const { id } = params

    // Delete addon links first (foreign key constraint)
    await adminClient
      .from('product_addons')
      .delete()
      .eq('product_id', id)

    // Delete product
    const { error: deleteError } = await adminClient
      .from('products')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: 'Product deleted',
    })

  } catch (err) {
    console.error('Admin product DELETE error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}