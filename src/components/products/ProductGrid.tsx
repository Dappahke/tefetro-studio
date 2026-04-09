import { ProductCard } from './ProductCard'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  category: string | null
  file_path: string | null
  elevation_images?: string[] | null  // Added this field
  bedrooms?: number
  bathrooms?: number
  floors?: number
  plinth_area?: number
  length?: number
  width?: number
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
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-deep-700">No plans available</h3>
        <p className="text-neutral-600 mt-2">Check back soon for new architectural drawings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>
          Showing <span className="font-semibold text-deep-700">{showingStart}-{showingEnd}</span> of{' '}
          <span className="font-semibold text-deep-700">{total}</span> plans
        </span>
        {hasMore && (
          <span className="text-sage">Scroll to load more</span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More / Pagination */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button className="btn-secondary">
            Load More Plans
          </button>
        </div>
      )}
    </div>
  )
}