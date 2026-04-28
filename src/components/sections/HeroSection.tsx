// src/components/sections/HeroSection.tsx
"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section 
      className="relative min-h-screen overflow-hidden bg-[#FAF9F6]"
      aria-labelledby="hero-heading"
    >
      {/* === AURA BACKGROUND LAYERS === */}
      
      {/* Base subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF9F6] via-[#f0f4f8] to-[#e8f0f5]" />
      
      {/* Ambient Glow Orb - Teal (Top Right) */}
      <div 
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #0F4C5C 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      
      {/* Ambient Glow Orb - Orange (Bottom Left) */}
      <div 
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, #F28C00 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      
      {/* Soft Blue Tint (Center) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[140px]"
        style={{ background: "radial-gradient(circle, #1F4E79 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Blueprint Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.025]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(#1E1E1E 1px, transparent 1px),
              linear-gradient(90deg, #1E1E1E 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }} 
        />
      </div>

      {/* Subtle top light sweep */}
      <div 
        className="absolute top-0 left-0 right-0 h-[500px] opacity-40"
        style={{
          background: "linear-gradient(180deg, rgba(31,78,121,0.08) 0%, transparent 100%)"
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 lg:pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-8 max-w-2xl">
            <header className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F4E79]/5 border border-[#1F4E79]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F28C00] animate-pulse" />
                <p className="text-[#1F4E79] font-semibold text-xs tracking-widest uppercase">
                  Kenya&apos;s Trusted PropTech Platform
                </p>
              </div>
              
              <h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#1E1E1E] leading-[1.1] tracking-tight"
              >
                Buy Ready-Made
                <span className="block text-[#1F4E79] mt-1">House Plans.</span>
                <span className="block mt-1">Build with Confidence.</span>
              </h1>
            </header>

            <p className="text-lg sm:text-xl text-[#444] leading-relaxed max-w-lg">
              Get complete architectural drawings instantly, with optional cost estimates, 
              interior design, and landscaping.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="/plans"
                className="group relative inline-flex items-center justify-center gap-2 bg-[#F28C00] hover:bg-[#e07d00] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#F28C00]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:ring-offset-2 overflow-hidden"
                aria-label="Browse our collection of house plans"
              >
                {/* Button shine effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative">Browse House Plans</span>
                <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>

              <a 
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white text-[#1E1E1E] font-semibold px-8 py-4 rounded-xl border border-[#e8e8e8] transition-all duration-300 hover:border-[#1F4E79]/30 hover:shadow-lg hover:shadow-[#1F4E79]/5 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2"
                aria-label="Contact our architectural experts"
              >
                <MessageCircle className="w-5 h-5 text-[#1F4E79]" aria-hidden="true" />
                Talk to an Expert
              </a>
            </div>

            {/* Trust Indicators */}
            <ul className="flex flex-wrap items-center gap-6 pt-6 text-sm text-[#555]" aria-label="Key benefits">
              {[
                "Instant Download",
                "Licensed Architects", 
                "NCA Compliant"
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0F4C5C]/10">
                    <span className="w-2 h-2 bg-[#0F4C5C] rounded-full" />
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Architectural Render */}
          <figure className="relative lg:pl-4">
            {/* Glow behind image */}
            <div 
              className="absolute inset-0 -m-4 rounded-[2rem] opacity-40 blur-2xl"
              style={{ background: "linear-gradient(135deg, #1F4E79 0%, #0F4C5C 50%, transparent 100%)" }}
              aria-hidden="true"
            />
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#1E1E1E]/10 ring-1 ring-[#1E1E1E]/5">
              <Image
                src="/images/hero-render.png"
                alt="Modern contemporary Kenyan home architectural visualization with clean lines and tropical landscaping"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Blueprint Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/30 via-transparent to-transparent" aria-hidden="true" />
              
              {/* Subtle corner accent */}
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-white/30 rounded-tr-lg" aria-hidden="true" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-white/30 rounded-bl-lg" aria-hidden="true" />
            </div>

            {/* Floating Stats Card - Glassmorphism */}
            <figcaption className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-[#1E1E1E]/5 p-5 sm:p-6 border border-white/50 ring-1 ring-[#1E1E1E]/5">
              <p className="text-3xl sm:text-4xl font-bold text-[#1F4E79]">50+</p>
              <p className="text-sm text-[#555] font-medium mt-0.5">Ready-Made Plans</p>
              <div className="mt-3 flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#1F4E79] border-2 border-white flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">{i}</span>
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full bg-[#F28C00] border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">+</span>
                </div>
              </div>
            </figcaption>
            
            {/* Decorative floating badge */}
            <div className="absolute -top-4 -right-4 bg-[#0F4C5C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-[#0F4C5C]/20 animate-bounce">
              NEW
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}