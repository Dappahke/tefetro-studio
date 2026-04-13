// src/components/sections/FinalCTA.tsx
"use client";

import { ArrowRight, MessageCircle } from "lucide-react";

export default function FinalCTA() {
  return (
    <section 
      className="py-20 sm:py-28 bg-[#0f2a44] relative overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1f4e79]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e66b00]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          id="final-cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          Start Your Project Today
        </h2>
        <p className="text-lg text-[#a0c4e8] mb-10 max-w-2xl mx-auto">
          Join hundreds of Kenyan homeowners who have turned their vision into reality with Tefetro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/plans"
            className="group inline-flex items-center justify-center gap-2 bg-[#e66b00] hover:bg-[#ff7f00] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0f2a44]"
            aria-label="Browse our house plans collection"
          >
            Browse House Plans
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>

          <a 
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-lg border border-white/30 hover:border-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0f2a44]"
            aria-label="Contact our team of experts"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            Talk to an Expert
          </a>
        </div>

        {/* Trust Text */}
        <p className="mt-8 text-sm text-[#6b8cae]">
          Licensed by the Board of Registration of Architects and Quantity Surveyors
        </p>
      </div>
    </section>
  );
}