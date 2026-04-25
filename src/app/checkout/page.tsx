// src/app/checkout/page.tsx

import { notFound, redirect } from 'next/navigation'

import { verifySession } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'

import { CheckoutClient } from '@/components/checkout/CheckoutClient'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

import type { CheckoutAddon, CheckoutProduct } from '@/types/checkout'

interface CheckoutPageProps {
  searchParams: {
    productId?: string
    addons?: string
  }
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await verifySession()
  if (!session) redirect('/login?redirectTo=/checkout')

  const productId = searchParams.productId
  if (!productId) redirect('/products')

  const supabase = await createClient()

  /* ── Product ── */
  const { data: productRow, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (productError || !productRow) notFound()

  const product: CheckoutProduct = {
    id: productRow.id,
    slug: productRow.slug ?? null,
    title: productRow.title,
    description: productRow.description ?? null,
    price: Number(productRow.price || 0),
    category: productRow.category ?? null,
    file_path: productRow.file_path ?? null,
    elevation_images: productRow.elevation_images ?? [],
    bedrooms: productRow.bedrooms ?? null,
    bathrooms: productRow.bathrooms ?? null,
    floors: productRow.floors ?? null,
    plinth_area: productRow.plinth_area ?? null,
  }

  /* ── Addons (via junction table) ── */
  const { data: rows, error: addonError } = await supabase
    .from('product_addons')
    .select(
      `
      addon_id,
      price_override,
      document_path,
      addons (
        id, name, price, type, description,
        badge, featured, sort_order, icon,
        active, requires_pdf, short_pitch
      )
    `
    )
    .eq('product_id', productId)

  if (addonError) {
    console.error('Addons fetch error:', addonError.message)
  }

  const safeRows = !rows ? [] : rows

  const addons: CheckoutAddon[] = safeRows
    .map((row: any) => {
      const a = row?.addons as {
        id: string
        name: string | null
        price: number | null
        type: string | null
        description: string | null
        badge: string | null
        featured: boolean | null
        sort_order: number | null
        icon: string | null
        active: boolean | null
        requires_pdf: boolean | null
        short_pitch: string | null
      } | null | undefined

      if (!a || a.active === false) return null

      const mapped: CheckoutAddon = {
        id: a.id,
        name: a.name || 'Addon',
        price: Number(row.price_override ?? a.price ?? 0),
        type:
          a.type === 'service'
            ? 'service'
            : a.type === 'digital'
            ? 'digital'
            : 'drawing',
        description: a.description ?? null,
        badge: a.badge ?? null,
        featured: a.featured ?? false,
        sort_order: a.sort_order ?? 100,
        icon: a.icon ?? null,
        active: a.active ?? true,
        requires_pdf: a.requires_pdf ?? false,
        short_pitch: a.short_pitch ?? null,
      }

      return mapped
    })
    .filter((item): item is CheckoutAddon => item !== null)
    .sort((a, b) => (a.sort_order ?? 100) - (b.sort_order ?? 100))

  const initialSelectedIds = searchParams.addons?.split(',').filter(Boolean) || []

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          className="mb-8"
          items={[
            { label: 'Products', href: '/products' },
            { label: product.title, href: `/products/${product.id}` },
            { label: 'Checkout', href: '/checkout' },
          ]}
        />

        <CheckoutClient
          product={product}
          addons={addons}
          initialSelectedIds={initialSelectedIds}
          userEmail={session.email}
          userId={session.user?.id} // Pass user ID for webhook order linking
        />
      </section>
    </main>
  )
}