// src/components/blog/BlogHero.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function BlogHero() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2a44]/5 text-[#0f2a44] rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-[#e66b00] rounded-full animate-pulse"></span>
          Architectural Intelligence
        </div>
        
        <h1 className="font-bold text-5xl lg:text-7xl text-[#0f172a] leading-[1.1] mb-6 tracking-tight">
          Building Knowledge,<br />
          <span className="text-[#e66b00]">One Article</span> at a Time
        </h1>
        
        <p className="text-lg lg:text-xl text-[#475569] max-w-2xl leading-relaxed mb-10">
          Expert insights on architectural design, construction best practices, and property investment strategies tailored for the Kenyan market and beyond.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles, guides, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-2xl text-sm focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all text-[#0f172a] placeholder:text-[#475569]/50"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-[#0f2a44] text-white rounded-2xl text-sm font-medium hover:bg-[#e66b00] transition-colors flex items-center justify-center gap-2"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  )
}