'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BedIcon, BathIcon, AreaIcon } from '@/components/icons'
import { PriceDisplayCompact } from './PriceDisplayCompact'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  title: string
  price: number
  category: string | null
  elevation_images?: string[] | null
  bedrooms?: number
  bathrooms?: number
  plinth_area?: number
}

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Get the first elevation image
  const imageUrl = product.elevation_images?.[0] 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings${product.elevation_images[0].startsWith('/') ? '' : '/'}${product.elevation_images[0]}`
    : null

  // Format specs for display - only show if they exist
  const specs = [
    { icon: BedIcon, value: product.bedrooms, label: 'bed' },
    { icon: BathIcon, value: product.bathrooms, label: 'bath' },
    { icon: AreaIcon, value: product.plinth_area, label: 'm²', format: (v: number) => `${v}m²` },
  ].filter(spec => spec.value !== null && spec.value !== undefined)

  return (
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group block bg-white rounded-2xl overflow-hidden',
        'border border-mist/30',
        'transition-all duration-300 ease-out',
        'hover:shadow-lg hover:shadow-deep/5 hover:-translate-y-1',
        'focus:outline-none focus:ring-2 focus:ring-tefetra focus:ring-offset-2'
      )}
    >
      {/* Image Container - Fixed aspect ratio prevents layout shift */}
      <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            priority={priority}
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered && 'scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas text-neutral-400">
            <svg 
              className="w-12 h-12 mb-2 opacity-50" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
            <span className="text-sm">No preview</span>
          </div>
        )}

        {/* Category Badge - Only show if exists */}
        {product.category && (
          <span className={cn(
            'absolute top-3 left-3',
            'px-3 py-1.5',
            'bg-deep/90 text-canvas',
            'text-xs font-semibold',
            'rounded-lg backdrop-blur-sm',
            'transform transition-transform duration-300',
            isHovered && 'translate-y-0.5'
          )}>
            {product.category}
          </span>
        )}

        {/* Hover Overlay with CTA hint */}
        <div className={cn(
          'absolute inset-0 bg-deep/60',
          'flex items-center justify-center',
          'opacity-0 transition-opacity duration-300',
          'group-hover:opacity-100'
        )}>
          <span className={cn(
            'px-6 py-3',
            'bg-white text-deep font-semibold',
            'rounded-xl',
            'transform translate-y-2 transition-transform duration-300',
            'group-hover:translate-y-0'
          )}>
            View Details
          </span>
        </div>
      </div>

      {/* Content - Clean and minimal */}
      <div className="p-5">
        {/* Title */}
        <h3 className={cn(
          'font-bold text-deep-700 text-lg',
          'line-clamp-1',
          'group-hover:text-tefetra transition-colors duration-200'
        )}>
          {product.title}
        </h3>

        {/* Price - Clean display without toggle on card */}
        <div className="mt-2">
          <PriceDisplayCompact 
            amountKES={product.price} 
            showToggle={false}
            className="text-xl font-bold text-tefetra"
          />
        </div>

        {/* Specs - Horizontal, minimal */}
        {specs.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-mist/30">
            {specs.map((spec, index) => (
              <div key={spec.label} className="flex items-center gap-1.5 text-neutral-600">
                <spec.icon size={16} />
                <span className="text-sm font-medium">
                  {spec.format ? spec.format(spec.value as number) : spec.value}
                  <span className="text-neutral-400 ml-0.5">{spec.label}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}