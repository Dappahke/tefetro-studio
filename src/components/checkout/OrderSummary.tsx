import { Suspense } from 'react'
import { PriceDisplay } from '../products/PriceDisplay'
import { PriceDisplaySkeleton } from '../products/PriceDisplaySkeleton'
import { PriceDisplayCompact } from '../products/PriceDisplayCompact'

interface Addon {
  id: string
  name: string
  description: string | null
  price: number
  type: 'drawing' | 'service'
}

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  category: string | null
  file_path: string | null
  elevation_images?: string[] | null
}

interface OrderSummaryProps {
  product: Product
  selectedAddons: Addon[]
  basePrice: number
  addonsTotal: number
  total: number
}

export function OrderSummary({
  product,
  selectedAddons,
  basePrice,
  addonsTotal,
  total
}: OrderSummaryProps) {
  const productCode = `TSB${product.category?.substring(0, 1).toUpperCase() || 'X'}${product.id.slice(-4)}`
  const productImage = product.elevation_images?.[0] || product.file_path
  const imageUrl = productImage 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${productImage}`
    : null

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10 space-y-6 sticky top-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F4C5C] mb-1">Order Summary</h2>
        <p className="text-sm text-[#1E1E1E]/60">Review your purchase details</p>
      </div>

      {/* Product Card */}
      <div className="flex gap-4 pb-4 border-b border-[#0F4C5C]/10">
        <div className="w-20 h-20 bg-[#FAF9F6] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#0F4C5C]/5">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <svg className="w-8 h-8 text-[#1E1E1E]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-xs font-mono text-[#1F4E79] bg-[#1F4E79]/10 px-1.5 py-0.5 rounded">
              {productCode}
            </code>
            <span className="text-xs text-[#1E1E1E]/50 capitalize">{product.category}</span>
          </div>
          <h3 className="font-semibold text-[#0F4C5C] line-clamp-2">{product.title}</h3>
          <p className="text-sm text-[#1E1E1E]/50 line-clamp-1 mt-0.5">
            {product.description || 'Architectural drawing with specifications'}
          </p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#1E1E1E]/70">Base Plan</span>
          <Suspense fallback={<PriceDisplaySkeleton size="sm" />}>
            <PriceDisplayCompact amountKES={basePrice} className="text-[#0F4C5C] font-medium" />
          </Suspense>
        </div>

        {selectedAddons.length > 0 && (
          <div className="space-y-2">
            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex items-start justify-between group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1E1E1E]/70 truncate">{addon.name}</p>
                  <span className={`
                    text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1
                    ${addon.type === 'service' 
                      ? 'bg-[#6faa99]/10 text-[#6faa99]' 
                      : 'bg-[#0F4C5C]/10 text-[#0F4C5C]'
                    }
                  `}>
                    {addon.type === 'service' ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Service
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Drawing
                      </>
                    )}
                  </span>
                </div>
                <PriceDisplayCompact 
                  amountKES={addon.price} 
                  className="text-sm text-[#1E1E1E]/70" 
                />
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#0F4C5C]/10">
              <span className="text-sm text-[#1E1E1E]/70">Addons Subtotal</span>
              <PriceDisplayCompact 
                amountKES={addonsTotal} 
                className="text-[#0F4C5C] font-medium" 
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-2 border-t border-dashed border-[#0F4C5C]/10">
          <span className="text-sm text-[#6faa99] flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Promo Code
          </span>
          <button 
            className="text-xs text-[#F28C00] font-medium hover:underline disabled:opacity-50"
            disabled
            title="Promo codes coming soon"
          >
            Add code
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t-2 border-[#0F4C5C]/20">
          <div>
            <span className="text-lg font-bold text-[#0F4C5C]">Total</span>
            <p className="text-xs text-[#1E1E1E]/50">Including all taxes</p>
          </div>
          <Suspense fallback={<PriceDisplaySkeleton size="lg" />}>
            <PriceDisplay 
              amountKES={total} 
              size="lg" 
              showOriginal={false}
              className="text-[#F28C00]"
            />
          </Suspense>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-[#FAF9F6] rounded-xl p-4 space-y-3 border border-[#0F4C5C]/5">
        <h4 className="font-medium text-[#0F4C5C] text-sm">What's included:</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-[#1E1E1E]/70">
            <svg className="w-4 h-4 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Instant PDF download
          </li>
          <li className="flex items-center gap-2 text-sm text-[#1E1E1E]/70">
            <svg className="w-4 h-4 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            24-hour access link
          </li>
          <li className="flex items-center gap-2 text-sm text-[#1E1E1E]/70">
            <svg className="w-4 h-4 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Construction license included
          </li>
          {selectedAddons.some(a => a.type === 'service') && (
            <li className="flex items-center gap-2 text-sm text-[#6faa99] font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional service request (project-based)
            </li>
          )}
        </ul>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-[#1E1E1E]/50">
          Need help?{' '}
          <a 
            href="mailto:support@tefetra.studio" 
            className="text-[#0F4C5C] hover:underline font-medium"
          >
            Contact support
          </a>
        </p>
      </div>

      <div className="bg-[#6faa99]/5 rounded-lg p-3 text-center border border-[#6faa99]/10">
        <p className="text-xs text-[#6faa99] font-medium flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          30-Day Money Back Guarantee
        </p>
      </div>
    </div>
  )
}