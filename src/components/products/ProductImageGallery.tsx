// src/components/products/ProductImageGallery.tsx

'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  ImageIcon,
} from 'lucide-react'

const SITE_URL = 'https://tefetro.studio'

interface ProductImageGalleryProps {
  images?: string[] | null
  title: string
  category: string | null
  productCode?: string
}

function getImageUrl(path?: string): string {
  if (!path) return `${SITE_URL}/og-image.png`
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${clean}`
}

export function ProductImageGallery({
  images,
  title,
  category,
  productCode,
}: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  /* Build Image List */
  const validImages = useMemo(() => {
    return (
      images?.filter(
        (img, index) =>
          img && !errors[index]
      ) || []
    )
  }, [images, errors])

  const total = validImages.length
  const current = validImages[selected]
  const multiple = total > 1

  /* Controls */
  function next() {
    setSelected((prev) => (prev === total - 1 ? 0 : prev + 1))
  }

  function prev() {
    setSelected((prev) => (prev === 0 ? total - 1 : prev - 1))
  }

  function closeLightbox() {
    setLightbox(false)
  }

  /* Keyboard Support */
  useEffect(() => {
    if (!lightbox) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }

    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, total])

  /* Pinterest Share URL */
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    `${SITE_URL}/products/${title.toLowerCase().replace(/\s+/g, '-')}`
  )}&media=${encodeURIComponent(getImageUrl(current))}&description=${encodeURIComponent(title)}`

  /* Empty State */
  if (!current) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="aspect-[4/3] rounded-lg bg-neutral-50 flex flex-col items-center justify-center text-neutral-400">
          <ImageIcon className="w-14 h-14 mb-4" />
          <p className="font-medium">No preview available</p>
          <p className="text-sm mt-1">Render images will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image Card */}
        <div className="relative w-full aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden group">
          <Image
            src={getImageUrl(current)}
            alt={`${title} - View ${selected + 1}`}
            fill
            className={cn(
              'object-contain transition-transform duration-500',
              zoomed && 'scale-[1.02]'
            )}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
          />

          {/* Watermark / Product Code */}
          {productCode && (
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg">
              <span className="text-white/80 text-xs font-mono font-bold">
                {productCode}
              </span>
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-xs font-semibold text-neutral-800 shadow-sm">
              {category}
            </span>
          )}

          {/* Pinterest Save Button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={pinterestUrl}
              data-pin-do="buttonPin"
              data-pin-config="above"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
              Save
            </a>
          </div>

          {/* Expand Button (Desktop Lightbox) */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute bottom-4 left-4 h-10 w-10 rounded-lg bg-white/90 backdrop-blur-md shadow flex items-center justify-center hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Expand image"
          >
            <Expand className="w-4 h-4 text-neutral-700" />
          </button>

          {/* Navigation Arrows */}
          {multiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-lg bg-white/90 shadow backdrop-blur-md flex items-center justify-center hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-800" />
              </button>

              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-lg bg-white/90 shadow backdrop-blur-md flex items-center justify-center hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-neutral-800" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {multiple && (
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
              {selected + 1} / {total}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {multiple && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {validImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelected(index)}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200',
                  selected === index
                    ? 'border-blueprint-500 ring-2 ring-blueprint-500/20'
                    : 'border-transparent hover:border-blueprint-300'
                )}
                aria-label={`View image ${index + 1} of ${total}`}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Premium Lightbox Modal */}
      {lightbox && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-[130] h-11 w-11 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous Button */}
          {multiple && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-5 top-1/2 -translate-y-1/2 z-[120] h-12 w-12 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {multiple && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-[120] h-12 w-12 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-6xl aspect-[16/10]"
          >
            <Image
              src={getImageUrl(current)}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Lightbox Footer */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white/60 text-sm">
              {title} {multiple && `• ${selected + 1} of ${total}`}
            </p>
          </div>
        </div>
      )}
    </>
  )
}