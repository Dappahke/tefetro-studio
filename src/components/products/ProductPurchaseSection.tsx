'use client'

import { useState } from 'react'
import { PriceDisplayCompact } from './PriceDisplayCompact'
import { cn } from '@/lib/utils'
import { FileText, PenTool, Check } from 'lucide-react'

interface Addon {
  id: string
  name: string
  description: string | null
  price: number
  type: 'drawing' | 'service'
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
  drawingAddons,
  serviceAddons
}: ProductPurchaseSectionProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const allAddons = [...drawingAddons, ...serviceAddons]
  const selectedAddonObjects = allAddons.filter(a => selectedAddons.includes(a.id))
  const addonsTotal = selectedAddonObjects.reduce((sum, a) => sum + a.price, 0)
  const grandTotal = price + addonsTotal

  // Toggle addon selection - immutable pattern [^148^]
  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)  // Remove [^147^]
        : [...prev, addonId]                  // Add [^148^]
    )
  }

  // Check if addon is selected
  const isSelected = (addonId: string) => selectedAddons.includes(addonId)

  return (
    <div className="space-y-6">
      {/* Drawing Addons */}
      {drawingAddons.length > 0 && (
        <div>
          <h3 className="font-semibold text-deep-700 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-deepBlue" />
            Drawing Enhancements
          </h3>
          <p className="text-sm text-neutral-500 mb-3">
            Add these to your plan purchase
          </p>
          <AddonSelector 
            addons={drawingAddons} 
            type="drawing"
            selected={selectedAddons}
            onToggle={handleAddonToggle}
          />
        </div>
      )}

      {/* Service Addons */}
      {serviceAddons.length > 0 && (
        <div>
          <h3 className="font-semibold text-deep-700 mb-3 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-sage" />
            Professional Services
          </h3>
          <p className="text-sm text-neutral-500 mb-3">
            Request expert assistance (creates project)
          </p>
          <AddonSelector 
            addons={serviceAddons} 
            type="service"
            selected={selectedAddons}
            onToggle={handleAddonToggle}
          />
        </div>
      )}

      {/* Total & Actions */}
      {selectedAddons.length > 0 && (
        <div className="bg-canvas rounded-2xl p-6 border border-mist/50">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Base Price</span>
              <PriceDisplayCompact amountKES={price} showToggle={false} className="text-neutral-700" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Addons ({selectedAddons.length})</span>
              <PriceDisplayCompact amountKES={addonsTotal} showToggle={false} className="text-neutral-700" />
            </div>
            <div className="flex justify-between pt-3 border-t border-mist/30">
              <span className="font-semibold text-deep-700">Total</span>
              <PriceDisplayCompact amountKES={grandTotal} showToggle={false} className="text-xl font-bold text-tefetra" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`/checkout?productId=${productId}&addons=${selectedAddons.join(',')}`}
              className={cn(
                "flex-1 text-center py-3 px-6 rounded-xl font-semibold",
                "bg-tefetra text-white",
                "hover:bg-tefetra-600 transition-colors",
                "shadow-sm hover:shadow-md"
              )}
            >
              Proceed to Checkout
            </a>
            <button 
              className={cn(
                "flex-1 py-3 px-6 rounded-xl font-semibold",
                "bg-white text-deep-700 border border-mist",
                "hover:bg-canvas transition-colors"
              )}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* No addons selected - show simple CTA */}
      {selectedAddons.length === 0 && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <a
            href={`/checkout?productId=${productId}`}
            className={cn(
              "flex-1 text-center py-4 px-8 rounded-xl font-semibold text-lg",
              "bg-tefetra text-white",
              "hover:bg-tefetra-600 transition-colors",
              "shadow-sm hover:shadow-md"
            )}
          >
            Buy Now
          </a>
          <button 
            className={cn(
              "flex-1 py-4 px-8 rounded-xl font-semibold text-lg",
              "bg-white text-deep-700 border-2 border-mist",
              "hover:bg-canvas transition-colors"
            )}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  )
}

// Sub-component: AddonSelector
interface AddonSelectorProps {
  addons: Addon[]
  type: 'drawing' | 'service'
  selected: string[]
  onToggle: (id: string) => void
}

function AddonSelector({ addons, type, selected, onToggle }: AddonSelectorProps) {
  if (addons.length === 0) return null

  return (
    <div className="space-y-3">
      {addons.map((addon) => {
        const isAddonSelected = selected.includes(addon.id)

        return (
          <label
            key={addon.id}
            className={cn(
              "relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer",
              "transition-all duration-200",
              isAddonSelected
                ? "border-tefetra bg-tefetra/5"
                : "border-mist/50 bg-white hover:border-sage/50"
            )}
          >
            {/* Hidden native checkbox with peer class [^142^] */}
            <input
              type="checkbox"
              checked={isAddonSelected}
              onChange={() => onToggle(addon.id)}
              className="peer sr-only" 
            />

            {/* Custom checkbox visual */}
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              "transition-colors duration-200",
              "peer-checked:bg-tefetra peer-checked:border-tefetra",
              "border-mist bg-white"
            )}>
              <Check 
                className={cn(
                  "w-3.5 h-3.5 text-white transition-transform duration-200",
                  isAddonSelected ? "scale-100" : "scale-0"
                )} 
                strokeWidth={3}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <h4 className={cn(
                  "font-semibold",
                  isAddonSelected ? "text-tefetra-700" : "text-deep-700"
                )}>
                  {addon.name}
                </h4>
                <PriceDisplayCompact 
                  amountKES={addon.price} 
                  showToggle={false}
                  className={isAddonSelected ? "text-tefetra" : "text-neutral-600"}
                />
              </div>

              {addon.description && (
                <p className="text-sm text-neutral-500 mt-1">
                  {addon.description}
                </p>
              )}

              {/* Type Badge */}
              <span className={cn(
                "inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide",
                type === 'service'
                  ? "bg-sage/10 text-sage"
                  : "bg-deepBlue/10 text-deepBlue"
              )}>
                {type === 'service' ? 'Creates Project' : 'Included in Download'}
              </span>
            </div>
          </label>
        )
      })}
    </div>
  )
}