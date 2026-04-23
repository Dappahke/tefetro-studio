import { Suspense } from 'react'
import { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { fetchProductBySlug } from '@/lib/dal'

import { PriceDisplay } from '@/components/products/PriceDisplay'
import { PriceDisplaySkeleton } from '@/components/products/PriceDisplaySkeleton'
import { ProductSpecs } from '@/components/products/ProductSpecs'
import { ProductPurchaseSection } from '@/components/products/ProductPurchaseSection'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import ReviewCard from '@/components/products/ReviewCard'
import SocialShare from '@/components/products/SocialShare'

const SITE_URL = 'https://tefetro.studio'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

interface Product {
  id: string
  slug: string
  title: string
  description?: string
  category?: string
  bedrooms?: number
  bathrooms?: number
  floors?: number
  plinth_area?: number
  length?: number
  width?: number
  price: number
  elevation_images?: string[]
  addons?: Array<{
    type: 'drawing' | 'service'
    [key: string]: any
  }>
}

function getImageUrl(path?: string) {
  if (!path) return `${SITE_URL}/og-image.png`
  if (path.startsWith('http')) return path
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${clean}`
}

function buildDescription(product: Product) {
  return (
    product.description ||
    `Professional ${product.category || 'architectural'} house plan with premium layouts and ready construction drawings.`
  )
}

export async function generateViewport(): Promise<Viewport> {
  return { themeColor: '#0F4C5C' }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await fetchProductBySlug(slug)
    return {
      title: `${product.title} | Tefetro Studios`,
      description: buildDescription(product),
      openGraph: { images: [getImageUrl(product.elevation_images?.[0])] },
    }
  } catch {
    return { title: 'Product Not Found' }
  }
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="text-sm text-neutral-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blueprint-900">{value}</p>
    </div>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product: Product = await fetchProductBySlug(slug).catch(() => notFound())
  if (!product) notFound()

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-neutral-100">
              <ProductImageGallery
                images={product.elevation_images}
                title={product.title}
                category={product.category ?? null}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: '🏆', label: 'Premium Design' },
                { icon: '📄', label: 'Ready Files' },
                { icon: '⚡', label: 'Fast Delivery' },
                { icon: '✏️', label: 'Editable' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white border border-neutral-200 p-4 text-center text-sm shadow-sm hover:shadow-md hover:border-blueprint-200 transition-all duration-300 group cursor-default"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="font-medium text-neutral-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-blueprint-600">
                {product.category || 'Architectural Plan'}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                {product.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                {buildDescription(product)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* TECHNICAL */}
          <div className="rounded-3xl bg-white border border-neutral-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blueprint-100 flex items-center justify-center">
                <span className="text-xl">📐</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Technical Specifications</h2>
            </div>
            <ProductSpecs
              bedrooms={product.bedrooms}
              bathrooms={product.bathrooms}
              floors={product.floors}
              plinthArea={product.plinth_area}
              length={product.length}
              width={product.width}
            />
          </div>

          {/* FILES */}
          <div className="rounded-3xl bg-white border border-neutral-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blueprint-100 flex items-center justify-center">
                <span className="text-xl">📁</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Included Files & Drawings</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-neutral-700">
              {[
                'Foundation Plan',
                'Floor Plan',
                'Roof Plan',
                'Elevations',
                'Sections',
                'Door Schedule',
                'Window Schedule',
                'Floor Finishes',
                'Furniture Layout',
                '3D Views',
                'Electrical Layout',
                'Plumbing Layout',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 hover:bg-blueprint-50 transition-colors duration-200 group"
                >
                  <span className="font-bold text-green-600 text-lg group-hover:scale-110 transition-transform">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-neutral-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-6">
              <SocialShare slug={slug} title={product.title} />
            </div>
          </div>
        </div>

        {/* FULL WIDTH PURCHASE SECTION */}
        <div className="mt-10">
          <div className="rounded-3xl bg-gradient-to-r from-blueprint-900 to-blueprint-800 p-8 shadow-xl">
            <ProductPurchaseSection
              productId={product.id}
              price={product.price}
              drawingAddons={product.addons?.filter((a) => a.type === 'drawing') || []}
              serviceAddons={product.addons?.filter((a) => a.type === 'service') || []}
            />
          </div>
        </div>

        {/* REVIEWS */}
        <div className="rounded-3xl bg-white border border-neutral-200 p-8 lg:p-12 shadow-lg">
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Customer Reviews</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200">
              <span className="text-yellow-500 text-xl">★★★★★</span>
              <span className="font-semibold text-neutral-700">4.9</span>
              <span className="text-sm text-neutral-500">(127 reviews)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <ReviewCard
              name="Ekong Richard"
              text="Excellent service and immediate delivery. Very efficient and money well spent."
              rating={5}
            />
            <ReviewCard
              name="Henry Wanjala"
              text="Professional work and smooth purchase process. Plans as detailed as promised."
              rating={5}
            />
            <ReviewCard
              name="Lutinala Nalomba"
              text="Responsive team and quality drawings. The website is user friendly and easy to navigate."
              rating={5}
            />
          </div>
        </div>
      </section>
    </main>
  )
}