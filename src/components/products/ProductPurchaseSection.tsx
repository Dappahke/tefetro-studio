'use client'

import { useState } from 'react'
import { AddonSelector } from './AddonSelector'
import { QuickBuyButton } from './QuickBuyButton'
import { PriceDisplayCompact } from './PriceDisplayCompact'

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

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Drawing Addons */}
      {drawingAddons.length > 0 && (
        <div>
          <h3 className="font-semibold text-deep-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-tefetra" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Drawing Enhancements
          </h3>
          <p className="text-sm text-neutral-500 mb-3">Add these to your plan purchase</p>
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
            <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Professional Services
          </h3>
          <p className="text-sm text-neutral-500 mb-3">Request expert assistance (creates project)</p>
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
              <PriceDisplayCompact amountKES={price} className="text-neutral-700" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Addons ({selectedAddons.length})</span>
              <PriceDisplayCompact amountKES={addonsTotal} className="text-neutral-700" />
            </div>
            <div className="flex justify-between pt-3 border-t border-mist/30">
              <span className="font-semibold text-deep-700">Total</span>
              <PriceDisplayCompact amountKES={grandTotal} className="text-xl font-bold" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <QuickBuyButton 
              productId={productId} 
              selectedAddons={selectedAddons}
              className="flex-1"
              fullWidth
            />
            <button className="flex-1 btn-secondary py-3">
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* No addons selected - show simple Quick Buy */}
      {selectedAddons.length === 0 && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <QuickBuyButton 
            productId={productId} 
            className="flex-1"
            fullWidth
          />
          <button className="flex-1 btn-secondary py-4 text-lg">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  )
}