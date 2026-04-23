// src/components/products/HeroSlideshow.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroSlideshowProps {
  images: string[];
}

const INTERVAL = 6000;

export function HeroSlideshow({ images }: HeroSlideshowProps) {
  const slides = useMemo(() => images?.length > 0 ? images : [], [images]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const goTo = useCallback((i: number) => setIndex(i), []);

  const current = slides[index];

  const scrollToProducts = () => {
    document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative isolate w-full h-screen overflow-hidden bg-blueprint-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ─── Background Images: Full bleed, no padding ─── */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={src}
              alt={`Premium architectural design ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              quality={90}
              className={`object-cover w-full h-full transition-transform duration-[10000ms] ease-linear ${
                i === index ? "scale-105" : "scale-100"
              }`}
              style={{ objectPosition: "center center" }}
              onLoad={() => i === 0 && setIsLoaded(true)}
            />
          </div>
        ))}
      </div>

      {/* ─── Overlays ─── */}
      <div className="absolute inset-0 bg-gradient-to-r from-blueprint-900/80 via-blueprint-900/40 to-blueprint-900/20 z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-blueprint-900/70 via-transparent to-blueprint-900/30 z-20" />

      {/* ─── Content: Positioned freely within full screen ─── */}
      <div className="relative z-30 w-full h-full flex items-center px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="max-w-2xl space-y-8">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-white/80">
              Architectural Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Architectural Plans
            <span className="block text-blueprint-200 mt-2">
              Ready to Build
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl text-white/70 max-w-lg leading-relaxed transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Premium floor layouts, elevations, and structural drawings from licensed Kenyan architects. Instant digital delivery.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blueprint-900 font-semibold hover:bg-blueprint-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Browse Plans
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white border border-white/25 font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              Custom Design
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-4 max-w-md pt-4 transition-all duration-700 delay-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Stat value="500+" label="House Plans" />
            <Stat value="24hr" label="Delivery" />
            <Stat value="KES" label="From 15,000" />
          </div>
        </div>
      </div>

      {/* ─── Slide Indicators ─── */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* ─── Scroll Indicator ─── */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        aria-label="Scroll to products"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Explore</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>
  );
}

/* ─── Stat Component ─── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-white/60 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}