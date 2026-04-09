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
  elevation_images?: string[] | null
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
  const [imageError, setImageError] = useState(false)

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

  // Get image URL - use elevation_images first (they're PNGs), fallback to file_path (PDF)
  const getImageUrl = () => {
    // If we have elevation images, use the first one
    if (product.elevation_images && product.elevation_images.length > 0) {
      const firstElevation = product.elevation_images[0]
      // Check if it's already a full URL
      if (firstElevation.startsWith('http')) return firstElevation
      // Otherwise construct URL
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${firstElevation}`
    }
    
    // Fallback to file_path (might be PDF, will error and show placeholder)
    if (product.file_path) {
      if (product.file_path.startsWith('http')) return product.file_path
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${product.file_path}`
    }
    
    return null
  }

  const imageUrl = getImageUrl()

  return (
    <Link 
      href={`/products/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs text-neutral-400">No preview available</span>
          </div>
        )}
        
        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-deep/80 text-canvas text-xs font-medium rounded-md backdrop-blur-sm">
            {product.category}
          </span>
        )}

        {/* PDF Badge - if file_path exists */}
        {product.file_path && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-red-500/80 text-white text-xs font-medium rounded-md backdrop-blur-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            PDF
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