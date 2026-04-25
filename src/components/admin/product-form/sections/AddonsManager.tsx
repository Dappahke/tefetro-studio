// sections/AddonsManager.tsx
'use client'

import { useState } from 'react'
import { FileText, DollarSign, Upload, Check, X, Package, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Addon {
  id: string
  name: string
  price: number
  type: 'drawing' | 'service'
  description?: string
  badge?: string
}

interface AddonsManagerProps {
  addons: Addon[]
  selected: string[]
  priceOverrides: Record<string, string>
  addonDocuments: Record<string, File | null>
  existingDocuments: Record<string, string>
  onToggle: (ids: string[]) => void
  onPriceChange: (overrides: Record<string, string>) => void
  onDocumentChange: (docs: Record<string, File | null>) => void
}

export function AddonsManager({
  addons,
  selected,
  priceOverrides,
  addonDocuments,
  existingDocuments,
  onToggle,
  onPriceChange,
  onDocumentChange,
}: AddonsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'drawing' | 'service'>('all')

  const drawings = addons.filter(a => a.type === 'drawing')
  const services = addons.filter(a => a.type === 'service')

  const filteredAddons = addons.filter(addon => {
    if (filterType !== 'all' && addon.type !== filterType) return false
    if (searchTerm && !addon.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  function toggleAddon(addonId: string) {
    if (selected.includes(addonId)) {
      onToggle(selected.filter(id => id !== addonId))
    } else {
      onToggle([...selected, addonId])
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search add-ons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-blueprint-400 focus:ring-2 focus:ring-blueprint-100"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'drawing', 'service'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                filterType === type
                  ? 'bg-blueprint-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              {type === 'all' ? 'All' : type === 'drawing' ? 'Drawings' : 'Services'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blueprint-50 to-white rounded-xl p-4 border border-blueprint-100">
          <p className="text-2xl font-bold text-blueprint-900">{drawings.length}</p>
          <p className="text-xs text-neutral-500">Available Drawings</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-4 border border-teal-100">
          <p className="text-2xl font-bold text-teal-900">{services.length}</p>
          <p className="text-xs text-neutral-500">Available Services</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100">
          <p className="text-2xl font-bold text-green-900">{selected.length}</p>
          <p className="text-xs text-neutral-500">Selected Items</p>
        </div>
      </div>

      {/* Addons List */}
      <div className="space-y-3">
        {filteredAddons.map((addon) => {
          const isSelected = selected.includes(addon.id)
          return (
            <div
              key={addon.id}
              className={cn(
                'rounded-xl border-2 p-4 transition-all',
                isSelected
                  ? 'border-blueprint-400 bg-blueprint-50/30'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={cn(
                        'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-blueprint-600 border-blueprint-600'
                          : 'border-neutral-300 hover:border-blueprint-400'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-neutral-900">{addon.name}</span>
                        {addon.badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{addon.badge}</span>
                        )}
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          addon.type === 'drawing' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        )}>
                          {addon.type === 'drawing' ? 'Drawing' : 'Service'}
                        </span>
                      </div>
                      {addon.description && (
                        <p className="text-sm text-neutral-500 mt-1">{addon.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">KES {addon.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Expanded settings when selected */}
                {isSelected && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-blueprint-200">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Price Override (Optional)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="number"
                          value={priceOverrides[addon.id] || ''}
                          onChange={(e) => onPriceChange({ ...priceOverrides, [addon.id]: e.target.value })}
                          placeholder={`Default: KES ${addon.price.toLocaleString()}`}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 focus:border-blueprint-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Document Upload</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.dwg,.zip"
                          onChange={(e) => onDocumentChange({ ...addonDocuments, [addon.id]: e.target.files?.[0] || null })}
                          className="hidden"
                          id={`file-${addon.id}`}
                        />
                        <label
                          htmlFor={`file-${addon.id}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm">
                            {addonDocuments[addon.id]?.name || existingDocuments[addon.id]?.split('/').pop() || 'Upload document'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredAddons.length === 0 && (
        <div className="text-center py-12 text-neutral-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No add-ons match your search</p>
        </div>
      )}
    </div>
  )
}