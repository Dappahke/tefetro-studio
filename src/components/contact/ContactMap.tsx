// src/components/contact/ContactMap.tsx
'use client'

import { useEffect, useRef } from 'react'

export function ContactMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Google Maps or use a static map image
    // For now, using a styled placeholder that looks premium
  }, [])

  return (
    <section id="map" className="relative h-[400px] bg-[#0f2a44] overflow-hidden">
      {/* Abstract map representation */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Location pin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-[#e66b00] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="w-4 h-4 bg-[#e66b00]/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Tefetro Studios HQ</h3>
          <p className="text-white/60">Nairobi, Kenya</p>
          <p className="text-white/40 text-sm mt-1">By appointment only</p>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#e66b00]/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#e66b00]/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#e66b00]/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#e66b00]/30" />
    </section>
  )
}