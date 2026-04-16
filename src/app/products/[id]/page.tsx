import { Suspense } from 'react'
import { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { fetchProductById } from '@/lib/dal'
import { PriceDisplay } from '@/components/products/PriceDisplay'
import { PriceDisplaySkeleton } from '@/components/products/PriceDisplaySkeleton'
import { ProductSpecs } from '@/components/products/ProductSpecs'
import { ProductPurchaseSection } from '@/components/products/ProductPurchaseSection'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { cn } from '@/lib/utils'

// Tefetra brand colors
const BRAND_COLORS = {
  orange: '#F28C00',
  teal: '#0F4C5C',
  dark: '#1E1E1E',
  cream: '#FAF9F6',
  deepBlue: '#1F4E79',
  sage: '#6faa99'
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// FIXED: Separate viewport export for themeColor [^166^] [^4^]
export async function generateViewport(
  { params }: ProductPageProps
): Promise<Viewport> {
  return {
    themeColor: BRAND_COLORS.teal
  }
}

// FIXED: generateMetadata without themeColor [^4^]
export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { id } = await params
  const product = await fetchProductById(id)

  if (!product) {
    return {
      title: 'Product Not Found | Tefetro Studios',
      robots: { index: false }
    }
  }

  const title = `${product.title} | Tefetro Studios`
  const description = product.description || 
    `Professional ${product.category || 'architectural'} plan with ${product.bedrooms || ''} bedrooms, ${product.bathrooms || ''} bathrooms. ` +
    `Instant download, licensed for construction in East Africa.`

  const productUrl = `https://tefetra.studio/products/${product.id}`
  const imageUrl = product.elevation_images?.[0] 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings${product.elevation_images[0].startsWith('/') ? '' : '/'}${product.elevation_images[0]}`
    : '/og-image.jpg'

  // Generate product code for SKU
  const productCode = `TSB${product.category?.substring(0, 1).toUpperCase() || 'X'}${product.id.slice(-4)}`

  return {
    title,
    description,
    keywords: [
      product.title,
      `${product.category} plan`,
      'architectural drawing',
      'house plan Kenya',
      'building plan East Africa',
      `${product.bedrooms} bedroom plan`,
      'construction drawing',
      'instant download',
      'Tefetro Studios'
    ],

    // FIXED: Use 'website' type instead of 'product' [^39^] [^171^]
    openGraph: {
      title: product.title,
      description,
      url: productUrl,
      siteName: 'Tefetro Studios',
      locale: 'en_US',
      type: 'website',  // FIXED: 'product' is not valid
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.title} - Architectural Plan`
        }
      ]
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [imageUrl]
    },

    // Canonical URL
    alternates: {
      canonical: productUrl
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large'
      }
    },

    // FIXED: Pinterest Rich Pins use 'other' metadata for product tags [^49^] [^179^]
    other: {
      'pinterest-rich-pin': 'true',
      // Product-specific OG tags for Pinterest [^49^]
      'og:price:amount': product.price?.toString() || '0',
      'og:price:currency': 'KES',
      'og:availability': 'instock',
      'og:brand': 'Tefetro Studios',
      'product:condition': 'new',
      'product:retailer_item_id': productCode
    }
  }
}

// Generate Schema.org Product structured data [^58^] [^64^]
function generateProductSchema(product: any) {
  const productCode = `TSB${product.category?.substring(0, 1).toUpperCase() || 'X'}${product.id.slice(-4)}`
  const imageUrls = product.elevation_images?.map((img: string) => 
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings${img.startsWith('/') ? '' : '/'}${img}`
  ) || []

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `Professional ${product.category} architectural plan`,
    image: imageUrls,
    sku: productCode,
    brand: {
      '@type': 'Brand',
      name: 'Tefetro Studios'
    },
    offers: {
      '@type': 'Offer',
      url: `https://tefetra.studio/products/${product.id}`,
      priceCurrency: 'KES',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Tefetro Studios'
      }
    },
    // Additional properties for architectural plans
    additionalProperty: [
      ...(product.bedrooms ? [{
        '@type': 'PropertyValue',
        name: 'Bedrooms',
        value: product.bedrooms
      }] : []),
      ...(product.bathrooms ? [{
        '@type': 'PropertyValue',
        name: 'Bathrooms',
        value: product.bathrooms
      }] : []),
      ...(product.plinth_area ? [{
        '@type': 'PropertyValue',
        name: 'Plinth Area',
        value: `${product.plinth_area} sq m`,
        unitCode: 'MTK'
      }] : [])
    ]
  }
}

// Breadcrumb structured data
function generateBreadcrumbSchema(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tefetra.studio'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Plans',
        item: 'https://tefetra.studio/products'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://tefetra.studio/products/${product.id}`
      }
    ]
  }
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
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductSchema(product))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema(product))
          }}
        />

        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-mist/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb 
              items={[
                { label: 'Plans', href: '/products' },
                { label: product.title, href: '#' }
              ]}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <ProductImageGallery 
              images={product.elevation_images}
              title={product.title}
              category={product.category}
            />

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <code className={cn(
                    "px-3 py-1.5 font-mono text-sm rounded-lg",
                    "bg-deepBlue/10 text-deepBlue border border-deepBlue/20"
                  )}>
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
                  <span className={cn(
                    "text-sm px-3 py-1 rounded-full",
                    "bg-sage/10 text-sage font-medium"
                  )}>
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
                  <div className="w-10 h-10 bg-deepBlue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-deepBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-xs text-neutral-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-deepBlue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-deepBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <p className="text-xs text-neutral-600">Instant Download</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-deepBlue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-deepBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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