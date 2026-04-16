'use client'

import { ProductCard } from './ProductCard'

interface Product {
  id: string
  title: string
  price: number
  category: string | null
  elevation_images?: string[] | null
  bedrooms?: number
  bathrooms?: number
  plinth_area?: number
}

interface ProductGridProps {
  products: Product[]
  total: number
  limit: number
  offset: number
}

export function ProductGrid({ products, total, limit, offset }: ProductGridProps) {
  const hasMore = total > offset + limit
  const showingStart = offset + 1
  const showingEnd = Math.min(offset + products.length, total)

  if (products.length === 0) {
    return (
      <div className="text-center py-16 md:py-24">
        <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-deep-700">No plans found</h3>
        <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Count - Clean and minimal */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">
          Showing <span className="font-semibold text-deep-700">{showingStart}-{showingEnd}</span> of{' '}
          <span className="font-semibold text-deep-700">{total}</span> plans
        </span>
        {hasMore && (
          <span className="text-sage text-sm">Scroll for more</span>
        )}
      </div>

      {/* Grid - Mobile-first responsive using auto-fit [^12^] [^19^] */}
      <div 
        className="grid gap-4 md:gap-6"
        style={{
          // Mobile: 1 column (minmax ensures cards don't get too narrow)
          // Tablet: 2 columns when space allows
          // Desktop: 3 columns max with 320px minimum
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))'
        }}
      >
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product}
            priority={index < 4} // Prioritize first 4 images for LCP [^11^]
          />
        ))}
      </div>

      {/* Load More - Simple text button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button className="text-sage font-medium hover:text-deep transition-colors flex items-center gap-2">
            Load more plans
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}