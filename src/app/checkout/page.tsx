// REWRITE FILE
// src/app/checkout/page.tsx

import { notFound, redirect } from 'next/navigation'

import { verifySession } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'

import { CheckoutClient } from '@/components/checkout/CheckoutClient'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

import type {
  CheckoutAddon,
  CheckoutProduct,
} from '@/types/checkout'

interface CheckoutPageProps {
  searchParams: {
    productId?: string
    addons?: string
  }
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const session =
    await verifySession()

  if (!session) {
    redirect(
      '/login?redirectTo=/checkout'
    )
  }

  const productId =
    searchParams.productId

  if (!productId) {
    redirect('/products')
  }

  const supabase =
    await createClient()

  /* Product */
  const {
    data: productRow,
  } = await supabase
    .from('products')
    .select('*')
    .eq(
      'id',
      productId
    )
    .single()

  if (!productRow) {
    notFound()
  }

  const product: CheckoutProduct =
    {
      id: productRow.id,
      slug:
        productRow.slug ??
        null,
      title:
        productRow.title,
      description:
        productRow.description ??
        null,
      price: Number(
        productRow.price ||
          0
      ),
      category:
        productRow.category ??
        null,
      file_path:
        productRow.file_path ??
        null,
      elevation_images:
        productRow.elevation_images ??
        [],
      bedrooms:
        productRow.bedrooms ??
        null,
      bathrooms:
        productRow.bathrooms ??
        null,
      floors:
        productRow.floors ??
        null,
      plinth_area:
        productRow.plinth_area ??
        null,
    }

  /* Addons */
  const {
    data: addonRows,
  } = await supabase
    .from(
      'product_addons'
    )
    .select(
      `
      addon_id,
      price_override,
      addons (*)
    `
    )
    .eq(
      'product_id',
      productId
    )

  const addons: CheckoutAddon[] =
    (
      addonRows ||
      []
    ).map(
      (
        row: any
      ) => ({
        id:
          row.addons.id,
        name:
          row.addons
            .name ||
          'Addon',
        price: Number(
          row.price_override ??
            row
              .addons
              .price ??
            0
        ),
        type:
          row.addons
            .type ===
            'service'
            ? 'service'
            : row
                .addons
                .type ===
              'digital'
            ? 'digital'
            : 'drawing',
        description:
          row.addons
            .description ??
          null,
        badge:
          row.addons
            .badge ??
          null,
        featured:
          row.addons
            .featured ??
          false,
        sort_order:
          row.addons
            .sort_order ??
          100,
        icon:
          row.addons
            .icon ??
          null,
        active:
          row.addons
            .active ??
          true,
        requires_pdf:
          row.addons
            .requires_pdf ??
          false,
        short_pitch:
          row.addons
            .short_pitch ??
          null,
      })
    )

  const initialSelectedIds =
    searchParams.addons
      ?.split(',')
      .filter(Boolean) ||
    []

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          className="mb-8"
          items={[
            {
              label:
                'Products',
              href: '/products',
            },
            {
              label:
                product.title,
              href: `/products/${product.id}`,
            },
            {
              label:
                'Checkout',
              href: '/checkout',
            },
          ]}
        />

        <CheckoutClient
          product={
            product
          }
          addons={
            addons
          }
          initialSelectedIds={
            initialSelectedIds
          }
          userEmail={
            session.email
          }
        />
      </section>
    </main>
  )
}