// src/components/blog/GuestBlogBanner.tsx
import Link from 'next/link'

export function GuestBlogBanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
      <div className="bg-gradient-to-r from-[#0f2a44] to-[#1a3a5c] rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e66b00]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e66b00]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-[#e66b00] text-white text-xs font-semibold rounded-full mb-4">
              Guest Contributors Welcome
            </span>
            <h3 className="font-display font-bold text-2xl lg:text-3xl mb-3">
              Have Expertise to Share?
            </h3>
            <p className="text-white/70 leading-relaxed">
              We feature industry professionals, architects, and construction experts. Submit your article and reach thousands of engaged readers in the Kenyan property market.
            </p>
          </div>
          
          <Link
            href="/blog/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#e66b00] text-white font-semibold rounded-xl hover:bg-[#ff7f00] transition-all shadow-lg shadow-[#e66b00]/30 whitespace-nowrap"
          >
            Submit Your Article
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}