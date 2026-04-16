'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProductImageGalleryProps {
  images?: string[] | null
  title: string
  category: string | null
}

export function ProductImageGallery({ images, title, category }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  // Filter out invalid images
  const validImages = images?.filter(img => img && !imageError[images.indexOf(img)]) || []

  // Get full URLs
  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings${cleanPath}`
  }

  const selectedImage = validImages[selectedIndex]
  const hasMultipleImages = validImages.length > 1

  return (
    <div className="space-y-4">
      {/* Main Image - With Zoom on Hover */}
      <div 
        className={cn(
          'relative aspect-[4/3] bg-canvas rounded-2xl overflow-hidden',
          'border border-mist/30 shadow-soft',
          'group cursor-zoom-in'
        )}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {selectedImage ? (
          <Image
            src={getImageUrl(selectedImage)}
            alt={`${title} - View ${selectedIndex + 1}`}
            fill
            priority
            className={cn(
              'object-cover transition-transform duration-500 ease-out',
              isZoomed && 'scale-110'
            )}
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={() => setImageError(prev => ({ ...prev, [selectedIndex]: true }))}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm">No preview available</span>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <span className={cn(
            'absolute top-4 left-4',
            'px-3 py-1.5',
            'bg-deep/90 text-canvas',
            'text-sm font-semibold',
            'rounded-lg backdrop-blur-sm'
          )}>
            {category}
          </span>
        )}

        {/* Zoom Hint */}
        <div className={cn(
          'absolute bottom-4 right-4',
          'px-3 py-1.5',
          'bg-white/90 text-deep-700',
          'text-xs font-medium',
          'rounded-lg backdrop-blur-sm',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          'pointer-events-none'
        )}>
          Hover to zoom
        </div>
      </div>

      {/* Thumbnail Strip */}
      {hasMultipleImages && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden',
                'border-2 transition-all duration-200',
                selectedIndex === index
                  ? 'border-tefetra ring-2 ring-tefetra/20'
                  : 'border-mist/50 hover:border-sage'
              )}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selectedIndex === index}
            >
              <Image
                src={getImageUrl(image)}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => setImageError(prev => ({ ...prev, [index]: true }))}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="text-center text-sm text-neutral-500">
          {selectedIndex + 1} / {validImages.length}
        </div>
      )}
    </div>
  )
}