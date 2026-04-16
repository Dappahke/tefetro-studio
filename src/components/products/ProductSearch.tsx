'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ProductSearchProps {
  placeholder?: string
}

export function ProductSearch({ placeholder = 'Search plans...' }: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for immediate input feedback
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isFocused, setIsFocused] = useState(false)

  // Sync with URL changes (e.g., when cleared via filters)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    if (urlQuery !== query) {
      setQuery(urlQuery)
    }
  }, [searchParams])

  // Debounced search update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentUrlQuery = searchParams.get('q') || ''

      if (query !== currentUrlQuery) {
        const params = new URLSearchParams(searchParams.toString())

        if (query.trim()) {
          params.set('q', query.trim())
        } else {
          params.delete('q')
        }

        // Reset pagination
        params.delete('page')

        startTransition(() => {
          router.replace(`/products?${params.toString()}`, { scroll: false })
        })
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, router, searchParams])

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')

    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className={cn(
      'relative flex-1 max-w-md transition-all duration-200',
      isFocused && 'scale-[1.02]'
    )}>
      <div className={cn(
        'relative flex items-center bg-white rounded-xl border-2 overflow-hidden',
        'transition-all duration-200',
        isFocused ? 'border-tefetra shadow-sm' : 'border-mist/50',
        isPending && 'opacity-70'
      )}>
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
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full py-3 pr-10 bg-transparent',
            'text-deep-700 placeholder:text-neutral-400',
            'focus:outline-none'
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-3 p-1 rounded-full',
              'text-neutral-400 hover:text-alert hover:bg-alert/10',
              'transition-colors'
            )}
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}