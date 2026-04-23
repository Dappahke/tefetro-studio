// src/components/checkout/AddonSelector.tsx

'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { PriceDisplayCompact } from './PriceDisplayCompact'
import type { CheckoutAddon } from '@/types/checkout'

interface Props {
  addons: CheckoutAddon[]
  selected: string[]
  onToggle: (id: string) => void
}

export function AddonSelector({
  addons,
  selected,
  onToggle,
}: Props) {
  const activeAddons = useMemo(() => {
    return addons
      .filter((a) => a.active !== false)
      .sort(
        (a, b) =>
          Number(a.sort_order || 100) -
          Number(b.sort_order || 100)
      )
  }, [addons])

  const drawings = activeAddons.filter(
    (a) =>
      a.type === 'drawing' ||
      a.type === 'digital'
  )

  const services = activeAddons.filter(
    (a) =>
      a.type === 'service'
  )

  if (!activeAddons.length) return null

  const totalSelected =
    selected.length

  return (
    <section className="space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-[#0F4C5C]/10 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C5C]/5 via-white to-[#F28C00]/5" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] bg-[#F28C00]/10 text-[#F28C00]">
              Smart Upsell
            </span>

            {totalSelected > 0 && (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] bg-[#6faa99]/10 text-[#6faa99]">
                {totalSelected} Selected
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C5C] leading-tight">
            Complete Your Building Package
          </h2>

          <p className="mt-3 text-sm md:text-base text-[#1E1E1E]/65 max-w-2xl">
            Most clients bundle technical drawings and professional services now
            to save time, reduce revisions, and start construction faster.
          </p>
        </div>
      </div>

      {/* DRAWINGS */}
      <AddonGroup
        title="Construction Drawings"
        subtitle="Download-ready files for approvals, pricing and execution."
        items={drawings}
        selected={selected}
        onToggle={onToggle}
        tone="teal"
      />

      {/* SERVICES */}
      <AddonGroup
        title="Professional Services"
        subtitle="Handled directly by our architects and project team."
        items={services}
        selected={selected}
        onToggle={onToggle}
        tone="orange"
      />
    </section>
  )
}

function AddonGroup({
  title,
  subtitle,
  items,
  selected,
  onToggle,
  tone,
}: {
  title: string
  subtitle: string
  items: CheckoutAddon[]
  selected: string[]
  onToggle: (id: string) => void
  tone: 'teal' | 'orange'
}) {
  if (!items.length) return null

  const isOrange =
    tone === 'orange'

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-5">
        <h3
          className={cn(
            'text-xl font-bold',
            isOrange
              ? 'text-[#F28C00]'
              : 'text-[#0F4C5C]'
          )}
        >
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#1E1E1E]/55">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {items.map((addon) => {
          const active =
            selected.includes(
              addon.id
            )

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() =>
                onToggle(
                  addon.id
                )
              }
              className={cn(
                'group w-full text-left rounded-2xl border p-5 transition-all duration-200',
                active
                  ? isOrange
                    ? 'border-[#F28C00] bg-[#F28C00]/5 ring-2 ring-[#F28C00]/10'
                    : 'border-[#0F4C5C] bg-[#0F4C5C]/5 ring-2 ring-[#0F4C5C]/10'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm hover:-translate-y-[1px]'
              )}
            >
              <div className="flex gap-4">
                {/* Toggle */}
                <div
                  className={cn(
                    'mt-1 h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition',
                    active
                      ? isOrange
                        ? 'border-[#F28C00] bg-[#F28C00] text-white'
                        : 'border-[#0F4C5C] bg-[#0F4C5C] text-white'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  )}
                >
                  {active && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {addon.icon && (
                      <span className="text-lg">
                        {addon.icon}
                      </span>
                    )}

                    <h4 className="font-semibold text-[#1E1E1E]">
                      {addon.name}
                    </h4>

                    {addon.badge && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-700">
                        {addon.badge}
                      </span>
                    )}

                    {addon.featured && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[#6faa99]/10 text-[#6faa99]">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-[#1E1E1E]/60">
                    {addon.short_pitch ||
                      addon.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {addon.requires_pdf && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-[#0F4C5C]/10 text-[#0F4C5C] uppercase tracking-wide">
                        Instant Download
                      </span>
                    )}

                    {addon.type ===
                      'service' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-[#F28C00]/10 text-[#F28C00] uppercase tracking-wide">
                        Team Delivered
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="shrink-0 text-right">
                  <PriceDisplayCompact
                    amountKES={Number(
                      addon.price
                    )}
                    className={cn(
                      'font-bold text-base',
                      isOrange
                        ? 'text-[#F28C00]'
                        : 'text-[#0F4C5C]'
                    )}
                  />

                  <p className="text-[11px] text-slate-400 mt-1">
                    one-time
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}