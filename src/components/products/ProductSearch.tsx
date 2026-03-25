'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ProductSearchProps {
  placeholder?: string
}

export function ProductSearch({ placeholder = 'Search plans...' }: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isFocused, setIsFocused] = useState(false)

  // Debounced search
  const debouncedSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }
      
      // Reset to first page on new search
      params.delete('page')
      
      router.push(`/products?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Simple debounce with setTimeout
    const timeoutId = setTimeout(() => {
      debouncedSearch(value)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={`relative flex-1 max-w-md transition-all duration-200 ${isFocused ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative flex items-center bg-white rounded-xl border-2 
        ${isFocused ? 'border-tefetra shadow-accent' : 'border-mist/50 shadow-soft'}
        transition-all duration-200
      `}>
        {/* Search Icon */}
        <div className="pl-4 pr-3 text-sage">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3 pr-10 bg-transparent text-deep-700 placeholder-neutral-400 focus:outline-none"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 text-neutral-400 hover:text-alert transition-colors rounded-full hover:bg-alert/10"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Hint */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-medium border border-mist/30 text-sm text-neutral-600 z-50">
          <p className="font-medium text-deep-700 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {['2 bedroom', 'modern', 'duplex', 'commercial'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term)
                  debouncedSearch(term)
                }}
                className="px-3 py-1 bg-canvas rounded-full text-xs hover:bg-sage/20 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}