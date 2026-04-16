import { Suspense } from 'react'
import { Metadata, Viewport } from 'next'
import { fetchProducts, fetchRandomElevationImages } from '@/lib/dal'
import { ProductGrid } from '@/components/products/ProductGrid'
import { FilterBar } from '@/components/products/FilterBar'
import { ProductSearch } from '@/components/products/ProductSearch'
import { HeroSlideshow } from '@/components/products/HeroSlideshow'

// Tefetra brand colors for SEO
const BRAND_COLORS = {
  orange: '#F28C00',
  teal: '#0F4C5C',
  dark: '#1E1E1E',
  cream: '#FAF9F6',
  deepBlue: '#1F4E79'
}

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// FIXED: Separate viewport export for themeColor
export async function generateViewport(): Promise<Viewport> {
  return {
    themeColor: BRAND_COLORS.teal
  }
}

// FIXED: generateMetadata without themeColor
export async function generateMetadata(
  { searchParams }: ProductsPageProps
): Promise<Metadata> {
  const params = await searchParams

  const category = typeof params.category === 'string' ? params.category : undefined
  const query = typeof params.q === 'string' ? params.q : undefined

  let title = 'Architectural Plans | Tefetra Studios'
  let description = 'Professional architectural drawings ready for immediate download. Licensed for construction across East Africa. Browse residential, commercial, and industrial building plans.'

  if (category && query) {
    title = `${query} ${category} Plans | Tefetra Studios`
    description = `Browse ${query} ${category} architectural plans. Professional drawings with instant download. Licensed for construction in Kenya and East Africa.`
  } else if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} Plans | Tefetra Studios`
    description = `Professional ${category} architectural plans ready for construction. Instant download with licensed drawings for East Africa.`
  } else if (query) {
    title = `${query} Plans | Tefetra Studios`
    description = `Search results for ${query} architectural plans. Professional drawings with instant download.`
  }

  const baseUrl = 'https://tefetra.studio/products'
  const searchParamsString = new URLSearchParams()
  if (category) searchParamsString.set('category', category)
  if (query) searchParamsString.set('q', query)
  const canonicalUrl = searchParamsString.toString() 
    ? `${baseUrl}?${searchParamsString.toString()}` 
    : baseUrl

  return {
    title,
    description,
    keywords: [
      'architectural plans',
      'house plans Kenya',
      'building plans East Africa',
      'construction drawings',
      'residential plans',
      'commercial plans',
      'architectural drawings',
      'Tefetra Studios',
      'instant download',
      'licensed construction'
    ],

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Tefetra Studios',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Tefetra Studios Architectural Plans'
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg']
    },

    alternates: {
      canonical: canonicalUrl
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

function generateStructuredData(products: any[], total: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Architectural Plans',
        description: 'Professional architectural drawings ready for immediate download',
        url: 'https://tefetra.studio/products',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: products.slice(0, 10).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.title,
              description: product.description,
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'KES',
                availability: 'https://schema.org/OnlineOnly'
              }
            }
          })),
          numberOfItems: total
        }
      }
    ]
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams

  // Fetch products and hero images in parallel
  const [{ products, total, limit, offset }, heroImages] = await Promise.all([
    fetchProducts(params),
    fetchRandomElevationImages(6)
  ])

  // Fix: Check if any filters are applied (excluding default 'all' category)
  const hasFilters = Object.keys(params).length > 0 && 
    (params.category !== 'all' || Boolean(params.q) || Boolean(params.bedrooms) || Boolean(params.floors) || Boolean(params.price))

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAF9F6] to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(products, total))
        }}
      />

      {/* Hero Slideshow Section */}
      <HeroSlideshow images={heroImages} />

      {/* Results Summary - Shows when filters are applied */}
      {hasFilters && (
        <div className="bg-[#0F4C5C]/5 border-b border-[#0F4C5C]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
            <p className="text-sm text-[#1E1E1E]/70">
              Found <span className="font-semibold text-[#0F4C5C]">{total}</span> {total === 1 ? 'plan' : 'plans'} 
              {params.q && <span> matching <span className="font-medium">“{params.q}”</span></span>}
            </p>
          </div>
        </div>
      )}

      {/* Search & Filters - Improved sticky behavior */}
      <section className="sticky top-0 z-30 bg-[#FAF9F6]/98 backdrop-blur-md shadow-sm border-b border-[#1E1E1E]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="py-4">
            <Suspense fallback={<SearchSkeleton />}>
              <ProductSearch />
            </Suspense>
          </div>
        </div>
        <FilterBar />
        
        {/* Quick filter indicators - show active filters as pills */}
        {hasFilters && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-3">
            <div className="flex flex-wrap gap-2">
              {params.category && params.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#F28C00]/10 text-[#F28C00] rounded-full">
                  Category: {params.category}
                </span>
              )}
              {params.bedrooms && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#0F4C5C]/10 text-[#0F4C5C] rounded-full">
                  {params.bedrooms} {params.bedrooms === '1' ? 'Bedroom' : 'Bedrooms'}
                </span>
              )}
              {params.floors && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#0F4C5C]/10 text-[#0F4C5C] rounded-full">
                  {params.floors} {params.floors === '1' ? 'Floor' : 'Floors'}
                </span>
              )}
              {params.price && params.price !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#0F4C5C]/10 text-[#0F4C5C] rounded-full">
                  Price: {typeof params.price === 'string' 
                    ? params.price.replace('-', ' - ').replace('+', '+ ')
                    : Array.isArray(params.price) 
                      ? params.price.join(', ')
                      : params.price}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Product Grid with improved loading and empty state */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {products.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid 
                  products={products} 
                  total={total}
                  limit={limit}
                  offset={offset}
                />
              </Suspense>
              
              {/* Load More indicator - if you implement pagination */}
              {total > limit && (
                <div className="mt-12 text-center">
                  <button className="px-8 py-3 bg-white border-2 border-[#0F4C5C] text-[#0F4C5C] font-semibold rounded-xl hover:bg-[#0F4C5C] hover:text-white transition-all duration-300 transform hover:scale-105">
                    Load More Plans
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="bg-gradient-to-r from-[#0F4C5C] to-[#1F4E79] text-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Design?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Our team of architects can create bespoke plans tailored to your specific needs and site conditions.
          </p>
          <button className="px-8 py-3 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Request a Consultation
          </button>
        </div>
      </section>
    </main>
  )
}

// Loading skeletons
function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="group">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#1E1E1E]/10 animate-pulse">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="h-12 w-full max-w-md bg-[#1E1E1E]/10 rounded-xl animate-pulse" />
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-16 md:py-24">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0F4C5C]/10 rounded-full mb-6">
        <svg className="w-10 h-10 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21l-7-5-7 5V5a2 0 0 1 2-2h10a2 0 0 1 2 2v16z" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
        {hasFilters ? 'No plans match your criteria' : 'No plans available'}
      </h3>
      <p className="text-[#1E1E1E]/60 max-w-md mx-auto mb-8">
        {hasFilters 
          ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
          : 'Check back soon for new architectural plans.'}
      </p>
      {hasFilters && (
        <button 
          onClick={() => window.location.href = '/products'}
          className="px-6 py-2.5 bg-[#F28C00] text-white rounded-lg hover:bg-[#F28C00]/90 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}