'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

const categories: FilterOption[] = [
  { value: '', label: 'All' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
]

const bedrooms: FilterOption[] = [
  { value: '', label: 'Any' },
  { value: '1', label: '1 Bed' },
  { value: '2', label: '2 Beds' },
  { value: '3', label: '3 Beds' },
  { value: '4', label: '4+ Beds' },
]

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get current values from URL
  const currentCategory = searchParams.get('category') || ''
  const currentBedrooms = searchParams.get('bedrooms') || ''

  // Update URL params [^25^] [^26^]
  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset pagination when filter changes
    params.delete('page')

    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false })
    })
  }, [router, searchParams])

  const clearFilters = () => {
    startTransition(() => {
      router.replace('/products', { scroll: false })
    })
  }

  const hasFilters = currentCategory || currentBedrooms

  return (
    <div className={cn(
      'sticky top-0 z-30 bg-canvas/95 backdrop-blur-sm border-b border-mist/30',
      'py-4 transition-opacity duration-200',
      isPending && 'opacity-70'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <span className="text-sm font-medium text-neutral-500 whitespace-nowrap mr-1">
              Type:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => updateFilter('category', cat.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
                  'transition-all duration-200',
                  currentCategory === cat.value
                    ? 'bg-tefetra text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-mist/50 border border-mist/50'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-8 bg-mist/50" />

          {/* Bedroom Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <span className="text-sm font-medium text-neutral-500 whitespace-nowrap mr-1">
              Beds:
            </span>
            {bedrooms.map((bed) => (
              <button
                key={bed.value}
                onClick={() => updateFilter('bedrooms', bed.value)}
                className={cn(
                  'px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap',
                  'transition-all duration-200',
                  currentBedrooms === bed.value
                    ? 'bg-deep text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-mist/50 border border-mist/50'
                )}
              >
                {bed.label}
              </button>
            ))}
          </div>

          {/* Clear button - only show when filters active */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className={cn(
                'ml-auto flex items-center gap-1.5 text-sm text-neutral-500',
                'hover:text-alert transition-colors whitespace-nowrap'
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}