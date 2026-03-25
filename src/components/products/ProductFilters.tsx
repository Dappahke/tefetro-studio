'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterSection {
  id: string
  label: string
  options: { value: string; label: string; count?: number }[]
}

const filterSections: FilterSection[] = [
  {
    id: 'category',
    label: 'Category',
    options: [
      { value: 'residential', label: 'Residential' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'industrial', label: 'Industrial' },
    ],
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms',
    options: [
      { value: '1', label: '1 Bedroom' },
      { value: '2', label: '2 Bedrooms' },
      { value: '3', label: '3 Bedrooms' },
      { value: '4', label: '4+ Bedrooms' },
    ],
  },
  {
    id: 'floors',
    label: 'Floors',
    options: [
      { value: '1', label: 'Single Story' },
      { value: '2', label: 'Two Story' },
      { value: '3', label: 'Three+ Story' },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    options: [
      { value: '0-50000', label: 'Under KES 50K' },
      { value: '50000-100000', label: 'KES 50K - 100K' },
      { value: '100000-250000', label: 'KES 100K - 250K' },
      { value: '250000+', label: 'KES 250K+' },
    ],
  },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Get current filters from URL
  const currentFilters = {
    category: searchParams.get('category') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    floors: searchParams.get('floors') || '',
    price: searchParams.get('price') || '',
  }

  const activeFilterCount = Object.values(currentFilters).filter(Boolean).length

  const toggleFilter = (sectionId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValue = params.get(sectionId)

    if (currentValue === value) {
      // Remove if already selected (toggle off)
      params.delete(sectionId)
    } else {
      // Set new value
      params.set(sectionId, value)
    }

    // Reset pagination
    params.delete('page')

    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Remove all filter params
    filterSections.forEach((section) => {
      params.delete(section.id)
    })
    
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId)
  }

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
          ${isOpen || activeFilterCount > 0
            ? 'bg-tefetra text-white shadow-accent'
            : 'bg-white text-deep-700 border-2 border-mist/50 hover:border-sage'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-sm">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-glass-lg border border-mist/30 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-mist/30">
            <h3 className="font-semibold text-deep-700">Filter Plans</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-alert hover:text-alert-600 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter Sections */}
          <div className="max-h-[60vh] overflow-y-auto">
            {filterSections.map((section) => (
              <div key={section.id} className="border-b border-mist/20 last:border-0">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-canvas/50 transition-colors"
                >
                  <span className="font-medium text-deep-700">{section.label}</span>
                  <svg
                    className={`w-4 h-4 text-sage transition-transform duration-200 ${activeSection === section.id ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Section Options */}
                {activeSection === section.id && (
                  <div className="px-4 pb-3 space-y-1">
                    {section.options.map((option) => {
                      const isActive = currentFilters[section.id as keyof typeof currentFilters] === option.value

                      return (
                        <button
                          key={option.value}
                          onClick={() => toggleFilter(section.id, option.value)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150
                            ${isActive
                              ? 'bg-tefetra/10 text-tefetra-700 border border-tefetra/30'
                              : 'text-neutral-600 hover:bg-canvas'
                            }
                          `}
                        >
                          <span>{option.label}</span>
                          {isActive && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer - Apply button (mobile mostly) */}
          <div className="px-4 py-3 border-t border-mist/30 bg-canvas/30">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full btn-primary py-2 text-sm"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Pills (shown outside dropdown) */}
      {activeFilterCount > 0 && !isOpen && (
        <div className="hidden md:flex items-center gap-2 ml-3">
          {filterSections.map((section) => {
            const activeValue = currentFilters[section.id as keyof typeof currentFilters]
            if (!activeValue) return null

            const option = section.options.find((o) => o.value === activeValue)
            if (!option) return null

            return (
              <span
                key={section.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-sage/10 text-sage-700 rounded-full text-sm"
              >
                {option.label}
                <button
                  onClick={() => toggleFilter(section.id, activeValue)}
                  className="hover:text-alert transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}