// src/components/sections/HeroSection.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "500+", label: "Plans Sold" },
  { value: "50+", label: "Projects Built" },
  { value: "100%", label: "Transparency" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-architecture.jpg"
          alt="Modern architectural design"
          fill
          priority
          className="object-cover opacity-20"
        />
      </div>

      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-canvas/90 z-0" />

      {/* Content */}
      <div className="relative z-10 section w-full">
        <div className="section-inner text-center max-w-4xl mx-auto">

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deep/5 text-deep text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-tefetra animate-pulse" />
            Serving Kenya & East Africa
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-deep tracking-tight mb-6">
            Design. Plan. Build —{" "}
            <span className="text-gradient">Without the Guesswork.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Buy ready-made architectural plans or work with us from concept 
            to construction — with clear pricing, structured delivery, 
            and full visibility at every stage.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="btn-primary w-full sm:w-auto text-lg px-8 py-4 gap-2"
            >
              Browse Plans
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/contact?project=true"
              className="btn-secondary w-full sm:w-auto text-lg px-8 py-4"
            >
              Start a Project
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-neutral-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-deep">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-deep/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-deep/40 animate-pulse" />
        </div>
      </div>

    </section>
  );
}