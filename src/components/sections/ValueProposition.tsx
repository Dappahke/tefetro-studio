// src/components/sections/ValueProposition.tsx
"use client";

import { Zap, Eye, Puzzle, Award } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Instant Access",
    description: "Download complete architectural drawings immediately after purchase"
  },
  {
    icon: Eye,
    title: "Clear Cost Visibility",
    description: "Know exactly what you're paying for with transparent pricing"
  },
  {
    icon: Puzzle,
    title: "Modular System",
    description: "Pay only for what you need — from basic plans to full project support"
  },
  {
    icon: Award,
    title: "Professional Access",
    description: "Licensed architects and engineers when you need expert guidance"
  }
];

export default function ValueProposition() {
  return (
    <section 
      className="py-20 sm:py-28 bg-[#eaf3fb]"
      aria-labelledby="value-proposition-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <p className="text-[#e66b00] font-semibold text-sm tracking-wider uppercase mb-3">
            Our Promise
          </p>
          <h2 
            id="value-proposition-heading"
            className="text-3xl sm:text-4xl font-bold text-[#222]"
          >
            Why Tefetro
          </h2>
        </header>

        <div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Key benefits"
        >
          {values.map((value, index) => (
            <article 
              key={index}
              className="flex flex-col items-center text-center p-6"
              role="listitem"
            >
              <div 
                className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4"
                aria-hidden="true"
              >
                <value.icon className="w-7 h-7 text-[#1f4e79]" />
              </div>
              <h3 className="text-lg font-bold text-[#222] mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}