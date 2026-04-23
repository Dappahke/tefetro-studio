'use client'

import { Bed, Bath, Building2, Ruler, Square } from 'lucide-react'

interface ProductSpecsProps {
  bedrooms?: number
  bathrooms?: number
  floors?: number
  plinthArea?: number
  length?: number
  width?: number
}

export function ProductSpecs({ bedrooms, bathrooms, floors, plinthArea, length, width }: ProductSpecsProps) {
  const sqft = plinthArea ? Math.round(plinthArea * 10.764) : null
  const dimensions = length && width ? `${length}m × ${width}m` : null

  const specs = [
    { icon: Bed, label: 'Bedrooms', value: bedrooms },
    { icon: Bath, label: 'Bathrooms', value: bathrooms },
    { icon: Building2, label: 'Floors', value: floors || 1 },
    { icon: Square, label: 'Area', value: plinthArea ? `${plinthArea} m²` : null },
    { icon: Ruler, label: 'Size', value: dimensions },
    { icon: Square, label: 'Sq Ft', value: sqft ? `${sqft.toLocaleString()} ft²` : null },
  ].filter((item) => item.value !== null && item.value !== undefined)

  return (
    <section className="rounded-3xl bg-white border border-black/5 p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-neutral-900">Technical Specifications</h3>
        <p className="text-sm text-neutral-500 mt-1">Essential property details at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {specs.map((spec) => {
          const Icon = spec.icon
          return (
            <div
              key={spec.label}
              className="rounded-2xl border border-black/5 bg-neutral-50 px-4 py-4 hover:bg-white transition"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-xl bg-white border border-black/5 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-neutral-700" />
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-neutral-500 font-medium">
                  {spec.label}
                </span>
              </div>

              <p className="text-xl md:text-2xl font-semibold text-neutral-900 leading-none">
                {spec.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-black/5">
        <p className="text-xs text-neutral-500 leading-6">
          Measurements are approximate and should be verified before construction.
        </p>
      </div>
    </section>
  )
}
