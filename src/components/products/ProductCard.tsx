'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PriceDisplayCompact } from './PriceDisplayCompact'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  category: string | null
  file_path: string | null
  bedrooms?: number
  bathrooms?: number
  floors?: number
  plinth_area?: number
  length?: number
  width?: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  // Generate product ID (TSB = Tefetro Studio Building, category code, number)
  const productCode = `TSB${product.category?.substring(0, 1).toUpperCase() || 'X'}${product.id.slice(-4)}`

  const specs = [
    { icon: '🛏️', value: product.bedrooms || '-', label: 'Beds' },
    { icon: '🚿', value: product.bathrooms || '-', label: 'Baths' },
    { icon: '🏢', value: product.floors || '1', label: 'Floors' },
    { icon: '📐', value: product.plinth_area ? `${product.plinth_area}m²` : '-', label: 'Plinth' },
  ]

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/checkout?productId=${product.id}`)
  }

  return (
    <Link 
      href={`/products/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {product.file_path ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${product.file_path}`}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-deep/80 text-canvas text-xs font-medium rounded-md backdrop-blur-sm">
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Description */}
        <div>
          <h3 className="font-semibold text-deep-700 line-clamp-1 group-hover:text-tefetra transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
            {product.description || 'Professional architectural drawing with complete specifications'}
          </p>
        </div>

        {/* Product Code & Price */}
        <div className="flex items-center justify-between">
          <code className="text-xs font-mono text-sage bg-sage/10 px-2 py-1 rounded">
            {productCode}
          </code>
          <PriceDisplayCompact amountKES={product.price} className="text-lg" />
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-4 gap-2 py-2 border-t border-mist/50">
          {specs.map((spec) => (
            <div key={spec.label} className="text-center">
              <div className="text-lg leading-none">{spec.icon}</div>
              <div className="text-xs font-semibold text-deep-700 mt-1">{spec.value}</div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-wide">{spec.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button 
            className="flex-1 btn-ghost text-sm py-2"
            onClick={(e) => e.preventDefault()}
          >
            View Details
          </button>
          <button 
            onClick={handleQuickBuy}
            className="flex-1 btn-primary text-sm py-2"
          >
            Quick Buy
          </button>
        </div>
      </div>
    </Link>
  )
}