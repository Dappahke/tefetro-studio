'use client'

import { PriceDisplayCompact } from './PriceDisplayCompact'

interface Addon {
  id: string
  name: string
  description: string | null
  price: number
  type: 'drawing' | 'service'
}

interface AddonSelectorProps {
  addons: Addon[]
  type: 'drawing' | 'service'
  selected: string[]
  onToggle: (addonId: string) => void
}

export function AddonSelector({ addons, type, selected, onToggle }: AddonSelectorProps) {
  if (addons.length === 0) return null

  return (
    <div className="space-y-3">
      {addons.map((addon) => {
        const isSelected = selected.includes(addon.id)

        return (
          <div
            key={addon.id}
            onClick={() => onToggle(addon.id)}
            className={`
              relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${isSelected 
                ? 'border-tefetra bg-tefetra/5 shadow-accent' 
                : 'border-mist/50 bg-white hover:border-sage/50 hover:shadow-soft'
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className={`
                w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                ${isSelected 
                  ? 'border-tefetra bg-tefetra text-white' 
                  : 'border-mist bg-white'
                }
              `}>
                {isSelected && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h4 className={`font-semibold ${isSelected ? 'text-tefetra-700' : 'text-deep-700'}`}>
                    {addon.name}
                  </h4>
                  <PriceDisplayCompact 
                    amountKES={addon.price} 
                    className={isSelected ? 'text-tefetra' : 'text-neutral-600'}
                  />
                </div>
                
                {addon.description && (
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                    {addon.description}
                  </p>
                )}

                {/* Type Badge */}
                <span className={`
                  inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide
                  ${type === 'service' 
                    ? 'bg-sage/10 text-sage' 
                    : 'bg-deep/10 text-deep-600'
                  }
                `}>
                  {type === 'service' ? 'Creates Project' : 'Included in Download'}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}