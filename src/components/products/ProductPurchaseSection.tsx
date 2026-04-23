'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { Check, FileText, Heart, Loader2, PenTool, ShieldCheck, Sparkles } from 'lucide-react'
import { PriceDisplayCompact } from '../checkout/PriceDisplayCompact'
import { cn } from '@/lib/utils'

interface Addon {
  id?: string
  name?: string
  description?: string | null
  price?: number
  type?: 'drawing' | 'service'
  [key: string]: any // Allow additional fields from database
}

interface ProductPurchaseSectionProps {
  productId: string
  price: number
  drawingAddons: Addon[]
  serviceAddons: Addon[]
}

export function ProductPurchaseSection({ 
  productId, 
  price, 
  drawingAddons = [], 
  serviceAddons = [] 
}: ProductPurchaseSectionProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [loadingSaved, startTransition] = useTransition()

  // Normalize addons to have consistent structure
  const normalizedDrawingAddons = useMemo(() => 
    drawingAddons.map((addon, index) => ({
      id: addon.id || `drawing-${index}`,
      name: addon.name || addon.title || 'Drawing Add-on',
      description: addon.description || addon.desc || null,
      price: addon.price || addon.amount || 0,
      type: 'drawing' as const,
      ...addon
    })), [drawingAddons]
  )

  const normalizedServiceAddons = useMemo(() => 
    serviceAddons.map((addon, index) => ({
      id: addon.id || `service-${index}`,
      name: addon.name || addon.title || 'Service Add-on',
      description: addon.description || addon.desc || null,
      price: addon.price || addon.amount || 0,
      type: 'service' as const,
      ...addon
    })), [serviceAddons]
  )

  const allAddons = [...normalizedDrawingAddons, ...normalizedServiceAddons]
  const selectedObjects = useMemo(() => allAddons.filter(a => selectedAddons.includes(a.id)), [allAddons, selectedAddons])
  const addonsTotal = selectedObjects.reduce((sum, item) => sum + (item.price || 0), 0)
  const grandTotal = price + addonsTotal

  const checkoutUrl = selectedAddons.length > 0
    ? `/checkout?productId=${productId}&addons=${selectedAddons.join(',')}`
    : `/checkout?productId=${productId}`

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch('/api/saved-plans')
        if (!res.ok) return
        const data = await res.json()
        setSaved(data.some((item: any) => item.product_id === productId))
      } catch {}
    }
    run()
  }, [productId])

  function toggleAddon(id: string) {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function toggleSaved() {
    startTransition(async () => {
      try {
        const method = saved ? 'DELETE' : 'POST'
        const res = await fetch('/api/saved-plans', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        if (res.ok) setSaved(!saved)
      } catch {}
    })
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl bg-white border border-black/5 shadow-xl p-6 md:p-7">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0F4C5C]/10 text-[#0F4C5C] px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
              Secure Purchase
            </div>

            <h3 className="mt-4 text-2xl font-semibold text-neutral-900">Get This Plan Today</h3>
            <p className="mt-2 text-sm text-neutral-500 max-w-lg">Premium architectural files delivered instantly after successful payment.</p>

            <div className="mt-6 grid gap-3 text-sm text-neutral-600">
              {['Instant order confirmation', 'Secure payment checkout', 'Professional ready-to-build files'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-neutral-50 border border-black/5 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold">Total</span>
              <ShieldCheck className="h-5 w-5 text-[#0F4C5C]" />
            </div>

            <PriceDisplayCompact amountKES={grandTotal} className="text-3xl font-semibold text-neutral-900" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Base Plan</span>
                <PriceDisplayCompact amountKES={price} className="text-neutral-700" />
              </div>

              {selectedAddons.length > 0 && (
                <div className="flex justify-between text-neutral-500">
                  <span>Add-ons ({selectedAddons.length})</span>
                  <PriceDisplayCompact amountKES={addonsTotal} className="text-neutral-700" />
                </div>
              )}
            </div>

            <div className="grid gap-3 pt-2">
              <Link href={checkoutUrl} className="inline-flex items-center justify-center rounded-2xl bg-[#0F4C5C] px-6 py-4 text-base font-semibold text-white hover:opacity-95 transition">
                Proceed to Checkout
              </Link>

              <button
                type="button"
                onClick={toggleSaved}
                disabled={loadingSaved}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 font-semibold transition',
                  saved ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-black/10 bg-white text-neutral-700 hover:bg-neutral-50'
                )}
              >
                {loadingSaved ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn('h-4 w-4', saved && 'fill-current')} />}
                {saved ? 'Saved' : 'Save Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {normalizedDrawingAddons.length > 0 && (
        <AddonBlock 
          title="Drawing Upgrades" 
          subtitle="Enhance your downloadable package." 
          icon={<FileText className="h-5 w-5 text-[#0F4C5C]" />} 
          addons={normalizedDrawingAddons} 
          selected={selectedAddons} 
          onToggle={toggleAddon} 
        />
      )}

      {normalizedServiceAddons.length > 0 && (
        <AddonBlock 
          title="Professional Services" 
          subtitle="Optional expert support for execution." 
          icon={<PenTool className="h-5 w-5 text-[#0F4C5C]" />} 
          addons={normalizedServiceAddons} 
          selected={selectedAddons} 
          onToggle={toggleAddon} 
        />
      )}
    </section>
  )
}

interface AddonBlockProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  addons: Array<{
    id: string
    name: string
    description: string | null
    price: number
    type: 'drawing' | 'service'
  }>
  selected: string[]
  onToggle: (id: string) => void
}

function AddonBlock({ title, subtitle, icon, addons, selected, onToggle }: AddonBlockProps) {
  if (!addons.length) return null
  
  return (
    <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="h-12 w-12 rounded-2xl bg-neutral-100 flex items-center justify-center">{icon}</div>
        <div>
          <h4 className="text-lg font-semibold text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        {addons.map(addon => {
          const active = selected.includes(addon.id)
          return (
            <label 
              key={addon.id} 
              className={cn(
                'block rounded-2xl border p-4 cursor-pointer transition', 
                active 
                  ? 'border-[#0F4C5C] bg-[#0F4C5C]/5' 
                  : 'border-black/5 hover:border-black/10'
              )}
            >
              <input 
                type="checkbox" 
                className="hidden" 
                checked={active} 
                onChange={() => onToggle(addon.id)} 
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900">{addon.name}</p>
                    {active && <Sparkles className="h-4 w-4 text-amber-500" />}
                  </div>
                  {addon.description && (
                    <p className="mt-1 text-sm text-neutral-500">{addon.description}</p>
                  )}
                </div>
                <PriceDisplayCompact amountKES={addon.price} className="font-semibold text-neutral-900 whitespace-nowrap" />
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}