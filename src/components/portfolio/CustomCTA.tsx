// ============================================================
// CUSTOM DESIGN CTA COMPONENT
// Deep blueprint background with dual CTAs
// ============================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Calculator, ArrowRight } from 'lucide-react';
import BlueprintGrid from './BlueprintGrid';

export default function CustomCTA() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0f2a44] overflow-hidden">
      {/* Blueprint Grid Background */}
      <BlueprintGrid opacity={0.04} />

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full 
                    bg-[#1f4e79]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full 
                    bg-[#e66b00]/5 blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-[#1f4e79]/30 
                     border border-[#4f86c6]/20 flex items-center justify-center"
          >
            <MessageSquare className="w-10 h-10 text-[#4f86c6]" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 
                       leading-tight">
            Need Something Designed Specifically for{' '}
            <span className="text-[#ff7f00]">Your Land or Vision?</span>
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 
                      max-w-2xl mx-auto">
            Our team offers custom architectural planning, approvals guidance, 
            and technical consultancy tailored to your unique requirements.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 
                       px-8 py-4 bg-[#e66b00] hover:bg-[#ff7f00] 
                       text-white font-semibold rounded-lg 
                       transition-all duration-300
                       hover:shadow-lg hover:shadow-orange-500/25
                       transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Talk to an Expert
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 
                       px-8 py-4 border-2 border-[#4f86c6]/30 
                       hover:border-[#4f86c6]/60 text-white 
                       font-semibold rounded-lg 
                       transition-all duration-300
                       hover:bg-[#1f4e79]/30"
            >
              <Calculator className="w-5 h-5" />
              Get Quote
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 pt-8 border-t border-white/10 
                     flex flex-wrap justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm">Free Initial Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm">Nairobi County Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm">2-Week Turnaround</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



//✅ FILE 10: src/components/portfolio/CustomCTA.tsx
//🎯 Features: Deep blueprint bg, dual CTAs, trust indicators, decorative blur circles