// src/app/api/protected/downloads/route.ts

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { adminClient } from '@/lib/supabase/admin'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function verifyToken(token: string) {
  const parts = token.split(':')
  if (parts.length !== 3) return null
  const [orderId, expiresRaw, signature] = parts
  const expiresAt = Number(expiresRaw)
  if (Date.now() > expiresAt) return null
  const expected = createHash('sha256')
    .update(`${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`)
    .digest('hex')
  if (expected !== signature) return null
  return { orderId, expiresAt }
}

function extractFilename(path: string) {
  const split = path.split('/')
  return split[split.length - 1] || 'file.pdf'
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 })
    }

    const verified = verifyToken(token)
    if (!verified) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    console.log(`🔐 Token verified for order: ${verified.orderId}`)

    // Get order with product and addons through the junction table
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select(`
        id,
        status,
        addons,
        product_id,
        product:products(
          id,
          title,
          file_path
        )
      `)
      .eq('id', verified.orderId)
      .single()

    if (orderError || !order) {
      console.error('Order fetch error:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log(`📦 Order found: ${order.id}, status: ${order.status}`)

    if (order.status !== 'paid' && order.status !== 'completed') {
      return NextResponse.json({ error: 'Order not eligible for download' }, { status: 403 })
    }

    // Handle product - Supabase returns product as an array when using select with relation
    const productArray = order.product as any
    const product = Array.isArray(productArray) && productArray.length > 0 ? productArray[0] : productArray
    
    if (!product || !product.id) {
      console.error('Product not found in order:', order)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log(`📄 Product: ${product.title}`)

    const files: any[] = []

    // 1. Add main product file
    if (product.file_path) {
      console.log(`📁 Generating signed URL for main file: ${product.file_path}`)
      const signed = await adminClient.storage
        .from('drawings')
        .createSignedUrl(product.file_path, 300)

      if (signed.data?.signedUrl) {
        files.push({
          id: 'main',
          title: product.title,
          filename: extractFilename(product.file_path),
          url: signed.data.signedUrl,
          type: 'main',
          badge: 'Main Drawing'
        })
        console.log(`✅ Main file signed URL created`)
      } else {
        console.error(`❌ Failed to create signed URL for main file: ${product.file_path}`)
      }
    } else {
      console.warn(`⚠️ No file_path found for product ${product.id}`)
    }

    // 2. Get selected addon IDs from the order
    let selectedAddonIds: string[] = []
    if (order.addons) {
      if (Array.isArray(order.addons)) {
        selectedAddonIds = order.addons
      } else if (typeof order.addons === 'string') {
        try {
          const parsed = JSON.parse(order.addons)
          selectedAddonIds = Array.isArray(parsed) ? parsed : []
        } catch (e) {
          console.error('Failed to parse addons JSON:', e)
        }
      }
    }

    console.log(`📦 Selected addon IDs from order:`, selectedAddonIds)

    // 3. Fetch addon details from the junction table
    if (selectedAddonIds.length > 0) {
      const { data: productAddons, error: addonsError } = await adminClient
        .from('product_addons')
        .select(`
          addon_id,
          document_path,
          price_override,
          addon:addons(
            id,
            name,
            description,
            type,
            badge,
            price
          )
        `)
        .eq('product_id', product.id)
        .in('addon_id', selectedAddonIds)

      if (addonsError) {
        console.error('Error fetching product addons:', addonsError)
      } else if (productAddons && productAddons.length > 0) {
        console.log(`✅ Found ${productAddons.length} addons in junction table`)
        
        for (const pa of productAddons) {
          // Handle addon - it might be an array
          const addonArray = pa.addon as any
          const addon = Array.isArray(addonArray) && addonArray.length > 0 ? addonArray[0] : addonArray
          
          if (!addon) {
            console.warn(`⚠️ Addon not found for ID: ${pa.addon_id}`)
            continue
          }

          // Use document_path from junction table
          const filePath = pa.document_path
          
          if (!filePath) {
            console.warn(`⚠️ No document_path for addon: ${addon.name} (${addon.id})`)
            continue
          }

          console.log(`📁 Generating signed URL for addon: ${addon.name} -> ${filePath}`)
          const signed = await adminClient.storage
            .from('drawings')
            .createSignedUrl(filePath, 300)

          if (signed.data?.signedUrl) {
            files.push({
              id: addon.id,
              title: addon.name,
              filename: extractFilename(filePath),
              url: signed.data.signedUrl,
              type: 'addon',
              badge: addon.badge || (addon.type === 'service' ? 'Service' : 'Add-on')
            })
            console.log(`✅ Addon file signed URL created: ${addon.name}`)
          } else {
            console.error(`❌ Failed to create signed URL for addon: ${addon.name}`, filePath)
          }
        }
      } else {
        console.warn(`⚠️ No addons found in product_addons for product ${product.id}`)
      }
    } else {
      console.log(`ℹ️ No addons selected for this order`)
    }

    console.log(`🎉 Total files prepared: ${files.length} (${files.filter(f => f.type === 'main').length} main, ${files.filter(f => f.type === 'addon').length} addons)`)

    return NextResponse.json({
      success: true,
      productTitle: product.title,
      expiresInMinutes: 5,
      files,
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed. Please contact support.' },
      { status: 500 }
    )
  }
}