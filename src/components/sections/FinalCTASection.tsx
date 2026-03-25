// src/components/sections/FinalCTASection.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="section relative z-10">
      <div className="section-inner">

        <div className="glass rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto">

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Build With Clarity?
          </h2>

          {/* Subtext */}
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Choose a ready-made plan or start a custom project with a structured,
            transparent process from day one.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="btn-primary text-lg px-8 py-4 gap-2"
            >
              Browse Plans
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/contact"
              className="btn-ghost text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
            >
              Start a Project
            </Link>
          </div>

          {/* Micro trust */}
          <p className="mt-8 text-sm text-white/60">
            No hidden costs • Structured delivery • Professional support
          </p>

        </div>

      </div>
    </section>
  );
}