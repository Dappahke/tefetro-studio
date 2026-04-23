// src/components/admin/product-form/ServicesSection.tsx

'use client'

import { Addon, LinkedAddon } from './types'

interface ServicesSectionProps {
  addons: Addon[]
  selected: string[]
  linkedAddons?: LinkedAddon[]
  onToggle: (addonId: string) => void
}

function formatKES(value: number | string) {
  return `KES ${Number(value || 0).toLocaleString()}`
}

function getBadge(name: string) {
  const lower = name.toLowerCase()

  if (lower.includes('walkthrough')) {
    return {
      text: 'High Conversion',
      icon: '🎥',
      style:
        'bg-purple-100 text-purple-700',
    }
  }

  if (
    lower.includes('consult') ||
    lower.includes('visit')
  ) {
    return {
      text: 'Expert Advice',
      icon: '📍',
      style:
        'bg-green-100 text-green-700',
    }
  }

  if (
    lower.includes('supervision')
  ) {
    return {
      text: 'Professional',
      icon: '👷',
      style:
        'bg-blue-100 text-blue-700',
    }
  }

  if (
    lower.includes('contract')
  ) {
    return {
      text: 'Turnkey',
      icon: '🏗️',
      style:
        'bg-amber-100 text-amber-700',
    }
  }

  return {
    text: 'Service',
    icon: '⭐',
    style:
      'bg-slate-100 text-slate-700',
  }
}

export function ServicesSection({
  addons,
  selected,
  linkedAddons = [],
  onToggle,
}: ServicesSectionProps) {
  const serviceAddons =
    addons
      .filter(
        (addon) =>
          addon.type ===
            'service'
      )
      .sort(
        (a, b) =>
          (a.sort_order ||
            100) -
          (b.sort_order ||
            100)
      )

  const selectedTotal =
    serviceAddons
      .filter((addon) =>
        selected.includes(
          addon.id
        )
      )
      .reduce(
        (
          sum,
          addon
        ) =>
          sum +
          Number(
            addon.price
          ),
        0
      )

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Professional Services
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Optional premium services customers can add during checkout.
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-3">
          <p className="text-xs text-slate-500">
            Selected Total
          </p>

          <p className="font-semibold text-slate-800">
            {formatKES(
              selectedTotal
            )}
          </p>
        </div>
      </div>

      {serviceAddons.length ===
        0 && (
        <p className="text-sm text-slate-500">
          No professional services available.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {serviceAddons.map(
          (addon) => {
            const isSelected =
              selected.includes(
                addon.id
              ) ||
              linkedAddons.some(
                (
                  item
                ) =>
                  item.addon_id ===
                  addon.id
              )

            const badge =
              getBadge(
                addon.name
              )

            return (
              <div
                key={
                  addon.id
                }
                className={`rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? 'border-[#0F4C5C] bg-[#f4fafb]'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${badge.style}`}
                    >
                      <span>
                        {
                          badge.icon
                        }
                      </span>
                      {
                        badge.text
                      }
                    </span>

                    <h3 className="font-semibold text-slate-800 mt-3">
                      {
                        addon.name
                      }
                    </h3>

                    {addon.description && (
                      <p className="text-sm text-slate-500 mt-2">
                        {
                          addon.description
                        }
                      </p>
                    )}

                    {addon.short_pitch && (
                      <p className="text-xs text-slate-400 mt-2">
                        {
                          addon.short_pitch
                        }
                      </p>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    checked={
                      isSelected
                    }
                    onChange={() =>
                      onToggle(
                        addon.id
                      )
                    }
                    className="mt-1 h-5 w-5"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Service Fee
                    </p>

                    <p className="font-bold text-lg text-slate-800">
                      {formatKES(
                        addon.price
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onToggle(
                        addon.id
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      isSelected
                        ? 'bg-[#0F4C5C] text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isSelected
                      ? 'Included'
                      : 'Add'}
                  </button>
                </div>
              </div>
            )
          }
        )}
      </div>
    </section>
  )
}