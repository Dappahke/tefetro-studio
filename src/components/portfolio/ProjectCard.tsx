// ============================================================
// PROJECT CARD COMPONENT
// Premium card with hover effects, image zoom, and CTAs
// Links to product detail page when product_slug exists
// ============================================================

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ShoppingCart, 
  MessageCircle,
  Bed,
  Bath,
  Maximize,
  MapPin
} from 'lucide-react';
import { PortfolioProject, STATUS_LABELS } from '@/types/portfolio';

interface ProjectCardProps {
  project: PortfolioProject;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const {
    title,
    slug,
    image,
    category,
    status,
    size,
    plot_fit,
    bedrooms,
    bathrooms,
    location_context,
    investor_friendly,
    ready_to_build,
    is_for_sale,
    product_slug,
    short_description,
  } = project;

  // Determine the primary link
  const detailLink = product_slug 
    ? `/products/${product_slug}` 
    : `/portfolio/${slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative bg-white rounded-xl overflow-hidden 
                shadow-sm hover:shadow-xl transition-shadow duration-500
                border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={detailLink}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </Link>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm 
                         text-[#0f2a44] text-xs font-semibold 
                         rounded-lg shadow-sm uppercase tracking-wider">
            {STATUS_LABELS[status] || status}
          </span>
        </div>

        {/* Investor Badge */}
        {investor_friendly && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1.5 bg-[#e66b00] text-white 
                           text-xs font-semibold rounded-lg shadow-sm">
              Investor Friendly
            </span>
          </div>
        )}

        {/* Hover Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t 
                      from-[#0f2a44]/90 via-[#0f2a44]/20 to-transparent
                      opacity-0 group-hover:opacity-100 
                      transition-opacity duration-500
                      flex flex-col justify-end p-6">

          <div className="flex gap-3 transform translate-y-4 
                        group-hover:translate-y-0 transition-transform duration-500">
            <Link
              href={detailLink}
              className="flex-1 flex items-center justify-center gap-2 
                       bg-white text-[#0f2a44] px-4 py-3 rounded-lg
                       font-semibold text-sm hover:bg-[#eaf3fb] 
                       transition-colors duration-300"
            >
              View Details
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {is_for_sale && product_slug ? (
              <Link
                href={`/products/${product_slug}`}
                className="flex items-center justify-center gap-2 
                         bg-[#e66b00] text-white px-4 py-3 rounded-lg
                         font-semibold text-sm hover:bg-[#ff7f00]
                         transition-colors duration-300"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Plan
              </Link>
            ) : (
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 
                         bg-[#1f4e79] text-white px-4 py-3 rounded-lg
                         font-semibold text-sm hover:bg-[#0f2a44]
                         transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                Get Similar
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <Link href={detailLink}>
          <h3 className="text-lg font-bold text-[#222222] mb-2 
                       group-hover:text-[#1f4e79] transition-colors duration-300
                       line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Short Description */}
        {short_description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {short_description}
          </p>
        )}

        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {size && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Maximize className="w-4 h-4 text-[#4f86c6]" />
              <span>{size}</span>
            </div>
          )}

          {plot_fit && plot_fit !== 'N/A' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-[#4f86c6]" />
              <span>{plot_fit}</span>
            </div>
          )}

          {bedrooms !== undefined && bedrooms > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bed className="w-4 h-4 text-[#4f86c6]" />
              <span>{bedrooms} Bed</span>
            </div>
          )}

          {bathrooms !== undefined && bathrooms > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bath className="w-4 h-4 text-[#4f86c6]" />
              <span>{bathrooms} Bath</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {ready_to_build && (
            <span className="px-2.5 py-1 bg-green-50 text-green-700 
                           text-xs font-medium rounded-md">
              Ready to Build
            </span>
          )}

          {location_context && (
            <span className="px-2.5 py-1 bg-blue-50 text-[#1f4e79] 
                           text-xs font-medium rounded-md">
              {location_context}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 
                    bg-gradient-to-r from-[#0f2a44] via-[#1f4e79] to-[#4f86c6]
                    transform scale-x-0 group-hover:scale-x-100 
                    transition-transform duration-500 origin-left" />
    </motion.article>
  );
}
