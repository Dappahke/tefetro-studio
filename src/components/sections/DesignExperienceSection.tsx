// src/components/sections/DesignExperienceSection.tsx

import Link from "next/link";

export default function DesignExperienceSection() {
  return (
    <div className="section bg-white">
      <div className="section-inner grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: VISUAL EXPERIENCE */}
        <div className="relative">

          {/* Main visual */}
          <div className="glass rounded-2xl aspect-video flex items-center justify-center">
            <span className="text-stone-400">3D Render / Project Visual</span>
          </div>

          {/* Floating card 1 */}
          <div className="absolute -bottom-6 -left-6 glass rounded-xl p-4 shadow-lg hidden md:block">
            <p className="text-sm font-medium text-deep">
              Modern Kenyan Designs
            </p>
          </div>

          {/* Floating card 2 */}
          <div className="absolute -top-6 -right-6 glass rounded-xl p-4 shadow-lg hidden md:block">
            <p className="text-sm font-medium text-deep">
              Build-Ready Drawings
            </p>
          </div>

        </div>

        {/* RIGHT: CONTENT */}
        <div>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Experience <span className="text-gradient">Better Design</span> Before You Build
          </h2>

          <p className="mt-4 text-lg text-stone-600">
            At Tefetro Studio, we go beyond selling drawings. We create 
            functional, affordable, and build-ready designs tailored for Kenyan plots and lifestyles.
          </p>

          <p className="mt-4 text-stone-600">
            Whether you’re buying a ready-made plan or starting from scratch, 
            our process ensures clarity, efficiency, and confidence at every stage.
          </p>

          {/* KEY FEATURES */}
          <div className="mt-6 space-y-3">

            <div className="flex items-start gap-3">
              <span className="text-tefetra">✔</span>
              <p className="text-sm text-stone-700">
                Optimized for local construction standards
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-tefetra">✔</span>
              <p className="text-sm text-stone-700">
                Designed for affordability without compromising quality
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-tefetra">✔</span>
              <p className="text-sm text-stone-700">
                Upgradeable with BOQs, interiors, and full construction
              </p>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-4">
            <Link href="/products" className="btn-primary">
              Explore Plans
            </Link>

            <Link href="/contact" className="btn-secondary">
              Start Your Project
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}