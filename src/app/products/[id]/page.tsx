import { Suspense } from 'react'
import { fetchProductById } from '@/lib/dal'
import { PriceDisplay } from '@/components/products/PriceDisplay'
import { PriceDisplaySkeleton } from '@/components/products/PriceDisplaySkeleton'
import { ProductSpecs } from '@/components/products/ProductSpecs'
import { ProductPurchaseSection } from '@/components/products/ProductPurchaseSection'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  
  try {
    const product = await fetchProductById(id)
    
    if (!product) {
      notFound()
    }

    // Generate product code
    const productCode = `TSB${product.category?.substring(0, 1).toUpperCase() || 'X'}${product.id.slice(-4)}`

    return (
      <main className="min-h-screen bg-canvas">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-mist/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/products" className="hover:text-deep-700 transition-colors">
                Plans
              </Link>
              <span>/</span>
              <span className="text-deep-700 font-medium">{product.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden shadow-soft">
                {product.file_path ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${product.file_path}`}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Category Badge */}
                {product.category && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-deep/90 text-canvas text-sm font-medium rounded-lg backdrop-blur-sm">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <button 
                    key={i} 
                    className={`aspect-square bg-neutral-100 rounded-xl overflow-hidden border-2 ${i === 1 ? 'border-tefetra' : 'border-transparent hover:border-mist'} transition-colors`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <code className="px-3 py-1.5 bg-sage/10 text-sage font-mono text-sm rounded-lg">
                    {productCode}
                  </code>
                  <span className="text-sm text-neutral-500">
                    Licensed for construction
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-deep-700 mb-3">
                  {product.title}
                </h1>
                
                <p className="text-neutral-600 text-lg leading-relaxed">
                  {product.description || 'Professional architectural drawing with complete specifications for immediate construction.'}
                </p>
              </div>

              {/* Price with Global Currency */}
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-neutral-500 font-medium">Base Price</span>
                  <span className="text-sm text-sage bg-sage/10 px-3 py-1 rounded-full">
                    Instant Download
                  </span>
                </div>
                
                <Suspense fallback={<PriceDisplaySkeleton size="lg" />}>
                  <PriceDisplay amountKES={product.price} size="lg" showOriginal={true} />
                </Suspense>

                <p className="text-sm text-neutral-500 mt-3">
                  Price includes VAT. Currency auto-detected based on your location.
                </p>
              </div>

              {/* Specifications */}
              <ProductSpecs 
                bedrooms={product.bedrooms}
                bathrooms={product.bathrooms}
                floors={product.floors}
                plinthArea={product.plinth_area}
                length={product.length}
                width={product.width}
              />

              {/* Purchase Section - Client Component with State */}
              <ProductPurchaseSection 
                productId={product.id}
                price={product.price}
                drawingAddons={product.addons?.filter((a: any) => a.type === 'drawing') || []}
                serviceAddons={product.addons?.filter((a: any) => a.type === 'service') || []}
              />

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-mist/30">
                <div className="text-center">
                  <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-xs text-neutral-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <p className="text-xs text-neutral-600">Instant Download</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-neutral-600">Code Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}