// REWRITE FILE
// src/components/checkout/OrderSummary.tsx

'use client'

import { PriceDisplayCompact } from './PriceDisplayCompact'

import type {
  CheckoutAddon,
  CheckoutProduct,
} from '@/types/checkout'

interface OrderSummaryProps {
  product: CheckoutProduct
  selectedAddons: CheckoutAddon[]
  basePrice: number
  addonsTotal: number
  total: number
}

export function OrderSummary({
  product,
  selectedAddons,
  basePrice,
  addonsTotal,
  total,
}: OrderSummaryProps) {
  const code = `TSB${
    product.category
      ?.slice(0, 1)
      .toUpperCase() ||
    'X'
  }${product.id.slice(-4)}`

  const rawImage =
    product.elevation_images?.[0] ||
    product.file_path

  const imageUrl = rawImage
    ? rawImage.startsWith(
        'http'
      )
      ? rawImage
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${rawImage}`
    : null

  const hasService =
    selectedAddons.some(
      (a) =>
        a.type ===
        'service'
    )

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F4C5C]">
          Order Summary
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Review purchase details
        </p>
      </div>

      {/* Product */}
      <div className="flex gap-4 pb-5 border-b border-slate-200">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                imageUrl
              }
              alt={
                product.title
              }
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 7h16M7 3v4m10-4v4M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <code className="text-[10px] font-mono bg-[#0F4C5C]/10 text-[#0F4C5C] px-2 py-1 rounded-md">
              {code}
            </code>

            {product.category && (
              <span className="text-xs capitalize text-slate-400">
                {
                  product.category
                }
              </span>
            )}
          </div>

          <h3 className="font-semibold text-[#0F4C5C] line-clamp-2">
            {product.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
            {product.description ||
              'Architectural drawing package.'}
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <Line
          label="Base Plan"
          value={
            <PriceDisplayCompact
              amountKES={
                basePrice
              }
            />
          }
        />

        {selectedAddons.length >
          0 && (
          <>
            {selectedAddons.map(
              (
                addon
              ) => (
                <Line
                  key={
                    addon.id
                  }
                  label={
                    addon.name
                  }
                  value={
                    <PriceDisplayCompact
                      amountKES={
                        addon.price
                      }
                      className="text-sm"
                    />
                  }
                />
              )
            )}

            <Line
              label="Add-ons"
              value={
                <PriceDisplayCompact
                  amountKES={
                    addonsTotal
                  }
                />
              }
            />
          </>
        )}

        <div className="pt-4 border-t border-slate-200 flex items-end justify-between gap-4">
          <div>
            <p className="font-bold text-lg text-[#0F4C5C]">
              Total
            </p>

            <p className="text-xs text-slate-400">
              Inclusive of taxes
            </p>
          </div>

          <PriceDisplayCompact
            amountKES={
              total
            }
            className="text-3xl font-bold text-[#F28C00]"
          />
        </div>
      </div>

      {/* Included */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
        <h4 className="font-semibold text-sm text-[#0F4C5C] mb-3">
          What's Included
        </h4>

        <ul className="space-y-2 text-sm text-slate-600">
          <Bullet text="Instant PDF download" />
          <Bullet text="Secure access link" />
          <Bullet text="Construction license included" />

          {hasService && (
            <Bullet text="Professional service request submitted" />
          )}
        </ul>
      </div>

      {/* Support */}
      <div className="text-center text-xs text-slate-500">
        Need help?{' '}
        <a
          href="mailto:support@tefetra.studio"
          className="font-semibold text-[#0F4C5C] hover:underline"
        >
          Contact support
        </a>
      </div>
    </div>
  )
}

function Line({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-600">
        {label}
      </span>

      <div>{value}</div>
    </div>
  )
}

function Bullet({
  text,
}: {
  text: string
}) {
  return (
    <li className="flex items-center gap-2">
      <svg
        className="w-4 h-4 text-[#6faa99]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>

      {text}
    </li>
  )
}