// src/components/products/ProductSearch.tsx

'use client'

import {
  useEffect,
  useState,
  useTransition,
} from 'react'
import {
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductSearchProps {
  placeholder?: string
}

export function ProductSearch({
  placeholder = 'Search house plans, bungalow, maisonette...',
}: ProductSearchProps) {
  const router = useRouter()
  const searchParams =
    useSearchParams()

  const [isPending, startTransition] =
    useTransition()

  const [query, setQuery] =
    useState(
      searchParams.get(
        'q'
      ) || ''
    )

  const [focused, setFocused] =
    useState(false)

  useEffect(() => {
    const current =
      searchParams.get(
        'q'
      ) || ''

    if (
      current !==
      query
    ) {
      setQuery(
        current
      )
    }
  }, [searchParams])

  useEffect(() => {
    const timer =
      setTimeout(() => {
        const current =
          searchParams.get(
            'q'
          ) || ''

        if (
          current ===
          query
        )
          return

        const params =
          new URLSearchParams(
            searchParams.toString()
          )

        if (
          query.trim()
        ) {
          params.set(
            'q',
            query.trim()
          )
        } else {
          params.delete(
            'q'
          )
        }

        params.delete(
          'offset'
        )

        startTransition(
          () => {
            router.replace(
              `/products?${params.toString()}`,
              {
                scroll: false,
              }
            )
          }
        )
      }, 350)

    return () =>
      clearTimeout(
        timer
      )
  }, [
    query,
    router,
    searchParams,
  ])

  function clearSearch() {
    setQuery('')

    const params =
      new URLSearchParams(
        searchParams.toString()
      )

    params.delete(
      'q'
    )
    params.delete(
      'offset'
    )

    startTransition(
      () => {
        router.replace(
          `/products?${params.toString()}`,
          {
            scroll: false,
          }
        )
      }
    )
  }

  return (
    <div
      className={cn(
        'relative w-full max-w-2xl transition-all duration-300',
        focused &&
          'scale-[1.01]'
      )}
    >
      <div
        className={cn(
          'relative flex items-center rounded-2xl border bg-white shadow-sm transition-all duration-300',
          focused
            ? 'border-[#0F4C5C] shadow-lg shadow-slate-200/70'
            : 'border-slate-200',
          isPending &&
            'opacity-75'
        )}
      >
        <Search className="ml-4 h-5 w-5 text-slate-400" />

        <input
          type="text"
          value={query}
          onChange={(
            e
          ) =>
            setQuery(
              e.target
                .value
            )
          }
          onFocus={() =>
            setFocused(
              true
            )
          }
          onBlur={() =>
            setFocused(
              false
            )
          }
          placeholder={
            placeholder
          }
          className="h-14 w-full bg-transparent px-4 pr-12 text-slate-800 placeholder:text-slate-400 outline-none"
        />

        {query && (
          <button
            onClick={
              clearSearch
            }
            aria-label="Clear search"
            className="mr-3 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}