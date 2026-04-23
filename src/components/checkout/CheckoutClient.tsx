// REWRITE FILE
// src/components/checkout/CheckoutClient.tsx

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AddonSelector } from './AddonSelector'
import { CheckoutForm } from './CheckoutForm'
import { OrderSummary } from './OrderSummary'

import type {
  CheckoutAddon,
  CheckoutProduct,
} from '@/types/checkout'

interface CheckoutClientProps {
  product: CheckoutProduct
  addons: CheckoutAddon[]
  initialSelectedIds: string[]
  userEmail: string
}

export function CheckoutClient({
  product,
  addons,
  initialSelectedIds,
  userEmail,
}: CheckoutClientProps) {
  const router = useRouter()

  const [selectedIds, setSelectedIds] =
    useState<string[]>(
      initialSelectedIds
    )

  /* Sync URL */
  useEffect(() => {
    const params =
      new URLSearchParams()

    params.set(
      'productId',
      product.id
    )

    if (
      selectedIds.length >
      0
    ) {
      params.set(
        'addons',
        selectedIds.join(
          ','
        )
      )
    }

    router.replace(
      `/checkout?${params.toString()}`,
      { scroll: false }
    )
  }, [
    selectedIds,
    product.id,
    router,
  ])

  /* Selected addons */
  const selectedAddons =
    useMemo(() => {
      return addons.filter(
        (addon) =>
          selectedIds.includes(
            addon.id
          )
      )
    }, [
      addons,
      selectedIds,
    ])

  /* Totals */
  const basePrice =
    Number(
      product.price || 0
    )

  const addonsTotal =
    selectedAddons.reduce(
      (
        sum,
        addon
      ) =>
        sum +
        Number(
          addon.price || 0
        ),
      0
    )

  const total =
    basePrice +
    addonsTotal

  function toggleAddon(
    addonId: string
  ) {
    setSelectedIds(
      (prev) =>
        prev.includes(
          addonId
        )
          ? prev.filter(
              (
                id
              ) =>
                id !==
                addonId
            )
          : [
              ...prev,
              addonId,
            ]
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-8 xl:gap-12">
      {/* LEFT */}
      <div className="space-y-6">
        {addons.length >
          0 && (
          <AddonSelector
            addons={addons}
            selected={
              selectedIds
            }
            onToggle={
              toggleAddon
            }
          />
        )}

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#F28C00] font-semibold">
              Payment
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#0F4C5C]">
              Complete Purchase
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Secure checkout powered by Paystack.
            </p>
          </div>

          <CheckoutForm
            productId={
              product.id
            }
            productTitle={
              product.title
            }
            total={total}
            selectedAddons={
              selectedAddons
            }
            userEmail={
              userEmail
            }
          />
        </div>
      </div>

      {/* RIGHT */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <OrderSummary
          product={
            product
          }
          selectedAddons={
            selectedAddons
          }
          basePrice={
            basePrice
          }
          addonsTotal={
            addonsTotal
          }
          total={total}
        />
      </aside>
    </div>
  )
}