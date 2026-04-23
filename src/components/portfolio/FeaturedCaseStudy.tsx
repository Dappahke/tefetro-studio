// ============================================================
// FEATURED CASE STUDY COMPONENT
// Horizontal highlight section with large image and details
// ============================================================

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PortfolioProject } from '@/types/portfolio';

interface FeaturedCaseStudyProps {
  project: PortfolioProject;
}

export default function FeaturedCaseStudy({ project }: FeaturedCaseStudyProps) {
  const {
    title,
    image,
    description,
    size,
    plot_fit,
    bedrooms,
    bathrooms,
    product_slug,
    investor_friendly,
    ready_to_build,
    location_context,
  } = project;

  const detailLink = product_slug 
    ? `/products/${product_slug}` 
    : `/portfolio/${project.slug}`;

  const highlights = [
    'Optimized for natural lighting',
    'Cost-efficient construction',
    'Family-friendly layout',
    plot_fit ? `Fits ${plot_fit} plots` : null,
  ].filter(Boolean);

  return (
    <section className="py-20 lg:py-32 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* LEFT - Large Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden 
                          shadow-2xl shadow-[#0f2a44]/10">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Overlay Badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-[#e66b00] text-white 
                               font-semibold text-sm rounded-lg shadow-lg">
                  Featured Case Study
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full 
                          rounded-2xl border-2 border-[#1f4e79]/20" />
            <div className="absolute -z-20 -bottom-12 -right-12 w-full h-full 
                          rounded-2xl border-2 border-[#4f86c6]/10" />
          </div>

          {/* RIGHT - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              {/* Label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#e66b00]" />
                <span className="text-sm font-medium text-[#1f4e79] uppercase tracking-wider">
                  Case Study
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                           text-[#0f2a44] mb-6 leading-tight">
                Designed for Function.
                <br />
                <span className="text-[#e66b00]">Built for Value.</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {description || 'This residential concept was optimized for a standard plot, balancing cost efficiency, natural lighting, and family comfort.'}
              </p>

              {/* Highlights */}
              <div className="space-y-3 mb-8">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#4f86c6] flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </motion.div>
                ))}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-xl 
                            border border-gray-100">
                {size && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0f2a44]">{size}</div>
                    <div className="text-xs text-gray-500 mt-1">Build Area</div>
                  </div>
                )}
                {bedrooms !== undefined && bedrooms > 0 && (
                  <div className="text-center border-x border-gray-100">
                    <div className="text-2xl font-bold text-[#0f2a44]">{bedrooms}</div>
                    <div className="text-xs text-gray-500 mt-1">Bedrooms</div>
                  </div>
                )}
                {bathrooms !== undefined && bathrooms > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0f2a44]">{bathrooms}</div>
                    <div className="text-xs text-gray-500 mt-1">Bathrooms</div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                href={detailLink}
                className="inline-flex items-center gap-2 px-8 py-4 
                         bg-[#0f2a44] hover:bg-[#1f4e79] text-white 
                         font-semibold rounded-lg transition-all duration-300
                         hover:shadow-lg hover:shadow-blue-900/25
                         transform hover:-translate-y-0.5"
              >
                Explore Similar Designs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



//✅ FILE 8: src/components/portfolio/FeaturedCaseStudy.tsx
//🎯 Features: Large image, checkmark highlights, specs grid, layered decorations
//🎨 Animations: Fade-up on scroll, staggered checklist items