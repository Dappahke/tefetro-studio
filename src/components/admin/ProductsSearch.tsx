// src/components/admin/ProductsSearch.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Filter, ChevronDown } from 'lucide-react'

export function ProductsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [showFilters, setShowFilters] = useState(false)

  const updateFilters = (newQuery: string, newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }
    
    if (newCategory) {
      params.set('category', newCategory)
    } else {
      params.delete('category')
    }
    
    router.push(`/admin/products?${params.toString()}`, { scroll: false })
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    updateFilters(value, category)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateFilters(query, value)
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    router.push('/admin/products', { scroll: false })
  }

  const hasFilters = query || category

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title, description, or ID..."
            className="w-full pl-9 pr-10 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-blueprint-400 focus:ring-2 focus:ring-blueprint-100 outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 bg-white border border-neutral-200 rounded-xl text-neutral-700 focus:border-blueprint-400 focus:ring-2 focus:ring-blueprint-100 outline-none transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="residential">🏠 Residential</option>
            <option value="commercial">🏢 Commercial</option>
            <option value="industrial">🏭 Industrial</option>
            <option value="bungalow">🏡 Bungalow</option>
            <option value="maisonette">🏘️ Maisonette</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blueprint-50 text-blueprint-700 rounded-full">
              Search: {query}
              <button onClick={() => handleSearch('')} className="hover:text-blueprint-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blueprint-50 text-blueprint-700 rounded-full">
              Category: {category}
              <button onClick={() => handleCategoryChange('')} className="hover:text-blueprint-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}