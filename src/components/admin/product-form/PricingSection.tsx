// src/components/admin/product-form/PricingSection.tsx
'use client'

import { PRICE_PRESETS } from './constants'
import { ProductFormState } from './types'
import { formatCurrency } from './helpers'

interface PricingSectionProps {
  form: ProductFormState
  updateField: <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => void
}

export function PricingSection({
  form,
  updateField,
}: PricingSectionProps) {
  const currentPrice = Number(form.price || 0)

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Pricing Strategy
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Set a competitive selling price for this plan.
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-2">
          <p className="text-xs text-slate-500">
            Current Price
          </p>
          <p className="font-semibold text-slate-800">
            {formatCurrency(currentPrice)}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Manual Price (KES)
        </label>

        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            updateField('price', e.target.value)
          }
          placeholder="50000"
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-600 mb-3">
          Quick Presets
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PRICE_PRESETS.map((price) => (
            <button
              key={price}
              type="button"
              onClick={() =>
                updateField('price', String(price))
              }
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                currentPrice === price
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:border-slate-400'
              }`}
            >
              {formatCurrency(price)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          Tip: Premium plans with multiple floors,
          commercial use, or larger plinth area can
          command higher pricing.
        </p>
      </div>
    </section>
  )
}