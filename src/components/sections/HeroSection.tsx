// src/components/sections/HeroSection.tsx
"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section 
      className="relative min-h-screen bg-gradient-to-br from-[#eaf3fb] via-[#f5f9fc] to-[#e6f0f8] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Blueprint Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(#0f2a44 1px, transparent 1px),
              linear-gradient(90deg, #0f2a44 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <header className="space-y-4">
              <p className="text-[#e66b00] font-semibold text-sm tracking-wider uppercase">
                Kenya&apos;s Trusted PropTech Platform
              </p>
              <h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#222] leading-[1.1] tracking-tight"
              >
                Buy Ready-Made
                <span className="block text-[#1f4e79]">House Plans.</span>
                <span className="block">Build with Confidence.</span>
              </h1>
            </header>

            <p className="text-lg sm:text-xl text-[#444] leading-relaxed max-w-xl">
              Get complete architectural drawings instantly, with optional cost estimates, 
              interior design, and landscaping.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/plans"
                className="group inline-flex items-center justify-center gap-2 bg-[#e66b00] hover:bg-[#ff7f00] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Browse our collection of house plans"
              >
                Browse House Plans
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>

              <a 
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f8f9fa] text-[#222] font-semibold px-8 py-4 rounded-lg border border-[#e0e0e0] transition-all duration-300 hover:border-[#1f4e79] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1f4e79] focus:ring-offset-2"
                aria-label="Contact our architectural experts"
              >
                <MessageCircle className="w-5 h-5 text-[#1f4e79]" aria-hidden="true" />
                Talk to an Expert
              </a>
            </div>

            {/* Trust Indicators */}
            <ul className="flex flex-wrap items-center gap-6 pt-4 text-sm text-[#666]" aria-label="Key benefits">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
                <span>Instant Download</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
                <span>Licensed Architects</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
                <span>NCA Compliant</span>
              </li>
            </ul>
          </div>

          {/* Right: Architectural Render */}
          <figure className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#0f2a44]/10">
              <Image
                src="/images/hero-render.png"
                alt="Modern contemporary Kenyan home architectural visualization with clean lines and tropical landscaping"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Blueprint Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a44]/20 via-transparent to-transparent" aria-hidden="true" />
            </div>

            {/* Floating Stats Card */}
            <figcaption className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-[#eaf3fb]">
              <p className="text-3xl sm:text-4xl font-bold text-[#1f4e79]">50+</p>
              <p className="text-sm text-[#666]">Ready-Made Plans</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}