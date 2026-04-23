// ============================================================
// FINAL CTA COMPONENT
// Simple closeout section
// ============================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Mail } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                       text-[#0f2a44] mb-6 leading-tight">
            Start with a Ready Plan or{' '}
            <span className="text-[#e66b00]">Build Something Unique</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Browse our collection of build-ready designs or reach out for a 
            custom solution tailored to your specific needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 
                       px-8 py-4 bg-[#0f2a44] hover:bg-[#1f4e79] 
                       text-white font-semibold rounded-lg 
                       transition-all duration-300
                       hover:shadow-lg hover:shadow-blue-900/25
                       transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 
                       px-8 py-4 border-2 border-gray-200 
                       hover:border-[#0f2a44] text-[#0f2a44] 
                       font-semibold rounded-lg 
                       transition-all duration-300
                       hover:bg-gray-50"
            >
              <Mail className="w-5 h-5" />
              Contact Tefetro
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



//✅ FILE 11: src/components/portfolio/FinalCTA.tsx
//🎯 Features: Clean closeout, dual CTAs, minimal design