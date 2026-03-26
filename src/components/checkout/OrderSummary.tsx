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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-deep-700 mb-1">Order Summary</h2>
        <p className="text-sm text-neutral-500">Review your purchase details</p>
      </div>

      {/* Product */}
      <div className="flex gap-4 pb-4 border-b border-mist/30">
        <div className="w-20 h-20 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {product.file_path ? (
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${product.file_path}`}
              alt={product.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <svg className="w-8 h-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-xs font-mono text-sage bg-sage/10 px-1.5 py-0.5 rounded">
              {productCode}
            </code>
            <span className="text-xs text-neutral-500 capitalize">{product.category}</span>
          </div>
          <h3 className="font-semibold text-deep-700 line-clamp-2">{product.title}</h3>
          <p className="text-sm text-neutral-500 line-clamp-1 mt-0.5">
            {product.description || 'Architectural drawing with specifications'}
          </p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Base Price */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Base Plan</span>
          <Suspense fallback={<div className="h-6 w-24 bg-mist/30 rounded animate-pulse" />}>
            <PriceDisplayCompact amountKES={basePrice} className="text-deep-700" />
          </Suspense>
        </div>

        {/* Addons */}
        {selectedAddons.length > 0 && (
          <div className="space-y-2">
            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-600 truncate">{addon.name}</p>
                  <span className={`
                    text-[10px] px-1.5 py-0.5 rounded-full font-medium
                    ${addon.type === 'service' ? 'bg-sage/10 text-sage' : 'bg-deep/10 text-deep-600'}
                  `}>
                    {addon.type === 'service' ? 'Service' : 'Enhancement'}
                  </span>
                </div>
                <PriceDisplayCompact amountKES={addon.price} className="text-sm text-neutral-600" />
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-mist/30">
              <span className="text-sm text-neutral-600">Addons Subtotal</span>
              <PriceDisplayCompact amountKES={addonsTotal} className="text-deep-700 font-medium" />
            </div>
          </div>
        )}

        {/* Discounts / Promo (placeholder) */}
        <div className="flex items-center justify-between py-2 border-t border-dashed border-mist/50">
          <span className="text-sm text-sage flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Promo Code
          </span>
          <button className="text-xs text-tefetra font-medium hover:underline">
            Add code
          </button>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-deep/10">
          <div>
            <span className="text-lg font-bold text-deep-700">Total</span>
            <p className="text-xs text-neutral-500">Including all taxes</p>
          </div>
          <Suspense fallback={<PriceDisplaySkeleton size="lg" />}>
            <PriceDisplay amountKES={total} size="lg" showOriginal={false} />
          </Suspense>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-canvas rounded-xl p-4 space-y-3">
        <h4 className="font-medium text-deep-700 text-sm">What's included:</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-neutral-600">
            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Instant PDF download
          </li>
          <li className="flex items-center gap-2 text-sm text-neutral-600">
            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            24-hour access link
          </li>
          <li className="flex items-center gap-2 text-sm text-neutral-600">
            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Construction license
          </li>
          {selectedAddons.some(a => a.type === 'service') && (
            <li className="flex items-center gap-2 text-sm text-sage">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional service request
            </li>
          )}
        </ul>
      </div>

      {/* Support */}
      <div className="text-center">
        <p className="text-xs text-neutral-500">
          Need help?{' '}
          <a href="mailto:support@tefetra.studio" className="text-deep-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}