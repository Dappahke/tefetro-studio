import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/dal'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'
import { logAuditEvent } from '@/lib/security/audit-logger' // Import the function, not the object

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

    // Fetch linked addons with price overrides and documents
    const { data: linkedAddons } = await adminClient
      .from('product_addons')
      .select('addon_id, price_override, document_path')
      .eq('product_id', id)

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        linked_addons: linkedAddons || [],
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

// POST: Create product
export async function POST(request: Request) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const session = await verifyAdmin()

    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    console.log('POST body:', body)

    const { 
      title, 
      description, 
      price, 
      category, 
      file_path,
      elevation_images,
      addons,
      bedrooms,
      bathrooms,
      floors,
      plinth_area,
      length,
      width,
    } = body

    // Validate required fields
    if (!title || !price) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      )
    }

    // Create product
    const { data: product, error: productError } = await adminClient
      .from('products')
      .insert({
        title,
        description: description || null,
        price: Number(price),
        category: category || 'residential',
        file_path: file_path || null,
        elevation_images: Array.isArray(elevation_images) ? elevation_images : [],
        bedrooms: bedrooms !== undefined ? Number(bedrooms) || null : null,
        bathrooms: bathrooms !== undefined ? Number(bathrooms) || null : null,
        floors: floors !== undefined ? Number(floors) || 1 : 1,
        plinth_area: plinth_area !== undefined ? Number(plinth_area) || null : null,
        length: length !== undefined ? Number(length) || null : null,
        width: width !== undefined ? Number(width) || null : null,
      })
      .select()
      .single()

    if (productError) {
      console.error('Product insert error:', productError)
      throw productError
    }

    // Create addon links with price overrides and documents
    if (addons && Array.isArray(addons) && addons.length > 0) {
      const addonLinks = addons.map((addon: any) => ({
        product_id: product.id,
        addon_id: addon.addon_id,
        price_override: addon.price_override !== undefined && addon.price_override !== null 
          ? Number(addon.price_override) 
          : null,
        document_path: addon.document_path || null,
      }))

      const { error: addonError } = await adminClient
        .from('product_addons')
        .insert(addonLinks)

      if (addonError) {
        console.error('Addon insert error:', addonError)
        throw addonError
      }
    }

    // Log audit using logAuditEvent
    await logAuditEvent({
      event: 'project_created', // Using project_created as closest match, or add 'product_created' to AuditEvent type
      userId: session.user.id,
      metadata: { productId: product.id, title, price },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })

  } catch (err) {
    console.error('Admin product POST error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create product' },
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

    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    console.log('PATCH body:', body)
    console.log('Product ID:', id)

    const { 
      title, 
      description, 
      price, 
      category, 
      file_path,
      elevation_images,
      addons,
      bedrooms,
      bathrooms,
      floors,
      plinth_area,
      length,
      width,
    } = body

    // Build update object dynamically
    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description || null
    if (price !== undefined) updateData.price = Number(price)
    if (category !== undefined) updateData.category = category
    if (file_path !== undefined) updateData.file_path = file_path || null
    if (elevation_images !== undefined) {
      updateData.elevation_images = Array.isArray(elevation_images) ? elevation_images : []
    }
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms !== '' ? Number(bedrooms) || null : null
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms !== '' ? Number(bathrooms) || null : null
    if (floors !== undefined) updateData.floors = floors !== '' ? Number(floors) || 1 : 1
    if (plinth_area !== undefined) updateData.plinth_area = plinth_area !== '' ? Number(plinth_area) || null : null
    if (length !== undefined) updateData.length = length !== '' ? Number(length) || null : null
    if (width !== undefined) updateData.width = width !== '' ? Number(width) || null : null

    console.log('Update data:', updateData)

    // Check if we have anything to update
    if (Object.keys(updateData).length === 0 && !addons) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Update product if we have data
    let product = null
    if (Object.keys(updateData).length > 0) {
      const { data: updatedProduct, error: productError } = await adminClient
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (productError) {
        console.error('Product update error:', productError)
        throw new Error(`Database error: ${productError.message}`)
      }
      product = updatedProduct
    }

    // Update addon links with price overrides and documents
    if (addons !== undefined && Array.isArray(addons)) {
      console.log('Updating addons:', addons)

      // Remove existing links
      const { error: deleteError } = await adminClient
        .from('product_addons')
        .delete()
        .eq('product_id', id)

      if (deleteError) {
        console.error('Addon delete error:', deleteError)
        throw deleteError
      }

      // Add new links
      if (addons.length > 0) {
        const addonLinks = addons.map((addon: any) => ({
          product_id: id,
          addon_id: addon.addon_id,
          price_override: addon.price_override !== undefined && addon.price_override !== null 
            ? Number(addon.price_override) 
            : null,
          document_path: addon.document_path || null,
        }))

        console.log('Inserting addon links:', addonLinks)

        const { error: addonError } = await adminClient
          .from('product_addons')
          .insert(addonLinks)

        if (addonError) {
          console.error('Addon insert error:', addonError)
          throw new Error(`Addon error: ${addonError.message}`)
        }
      }
    }

    // Log audit using logAuditEvent
    await logAuditEvent({
      event: 'project_status_updated', // Using this as closest match for product update
      userId: session.user.id,
      metadata: { productId: id, action: 'product_updated', changes: Object.keys(updateData) },
    })

    return NextResponse.json({
      success: true,
      data: product || { id },
    })

  } catch (err) {
    console.error('Admin product PATCH error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update product' },
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

    // Log audit using logAuditEvent
    await logAuditEvent({
      event: 'project_status_updated', // Using this as closest match
      userId: session.user.id,
      metadata: { productId: id, action: 'product_deleted' },
    })

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