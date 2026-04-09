// components/products/ProductImage.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string | null
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
}

export function ProductImage({ src, alt, ...props }: ProductImageProps) {
  const [error, setError] = useState(false)
  
  if (!src || error) {
    return (
      <div className="flex items-center justify-center bg-gray-100 text-gray-400">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    )
  }
  
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  )
}