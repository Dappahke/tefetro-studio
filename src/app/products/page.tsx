import { Suspense } from 'react'
import { fetchProducts } from '@/lib/dal'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductSearch } from '@/components/products/ProductSearch'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // fetchProducts returns { products, total, limit, offset }
  const { products, total, limit, offset } = await fetchProducts(searchParams)

  return (
    <main className="min-h-screen bg-canvas">
      {/* Hero Section */}
      <section className="bg-deep text-canvas py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Architectural Plans
          </h1>
          <p className="text-lg text-mist max-w-2xl">
            Professional digital drawings ready for immediate download. 
            Licensed for construction across East Africa.
          </p>
        </div>
      </section>

      {/* Filters & Search - Client Components need Suspense */}
      <section className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-sm border-b border-mist/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <Suspense fallback={<div className="h-10 w-64 bg-mist/30 rounded-xl animate-pulse" />}>
            <ProductSearch />
          </Suspense>
          <Suspense fallback={<div className="h-10 w-32 bg-mist/30 rounded-xl animate-pulse" />}>
            <ProductFilters />
          </Suspense>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid 
              products={products} 
              total={total}
              limit={limit}
              offset={offset}
            />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl h-96 animate-pulse shadow-soft" />
      ))}
    </div>
  )
}