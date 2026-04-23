// src/components/blog/CategoryFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Category {
  _id: string
  title: string
  slug: { current: string }
}

interface Props {
  categories: Category[]
}

export function CategoryFilter({ categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  const handleFilter = useCallback((slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    router.push(`/blog?${params.toString()}`)
  }, [router, searchParams])

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleFilter('all')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-[#0f2a44] text-white shadow-lg shadow-[#0f2a44]/20'
              : 'bg-[#eaf3fb] text-[#475569] hover:bg-[#0f2a44]/10'
          }`}
        >
          All Topics
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleFilter(category.slug.current)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.slug.current
                ? 'bg-[#0f2a44] text-white shadow-lg shadow-[#0f2a44]/20'
                : 'bg-[#eaf3fb] text-[#475569] hover:bg-[#0f2a44]/10'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>
    </section>
  )
}