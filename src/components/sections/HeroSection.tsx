// components/sections/HeroSection.tsx

import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="section">
      <div className="section-inner grid md:grid-cols-2 gap-10 items-center">

        {/* TEXT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Affordable <span className="text-gradient">House Plans in Kenya</span> + Design & Build
          </h1>

          <p className="mt-4 text-lg text-stone-600">
            Browse ready-made architectural drawings or let Tefetro design and build your home from start to finish.
          </p>

          <div className="mt-6 flex gap-4">
            <Link href="/products" className="btn-primary">
              Browse Plans
            </Link>
            <Link href="/contact" className="btn-ghost">
              Start Project
            </Link>
          </div>
        </div>

        {/* VISUAL */}
        <div className="glass rounded-2xl aspect-video flex items-center justify-center">
          <span className="text-stone-400">Hero Render</span>
        </div>

      </div>
    </div>
  );
}