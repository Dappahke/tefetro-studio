// ============================================================
// WORK FILTERS COMPONENT
// Sticky category tabs with smooth transitions
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PortfolioCategory, CATEGORIES } from '@/types/portfolio';

interface WorkFiltersProps {
  activeCategory: PortfolioCategory | 'all';
  onCategoryChange: (category: PortfolioCategory | 'all') => void;
  counts?: Record<string, number>;
}

export default function WorkFilters({ 
  activeCategory, 
  onCategoryChange,
  counts = {}
}: WorkFiltersProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md 
                    border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-4 overflow-x-auto 
                      scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">

          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            const count = counts[category.id] || 0;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full 
                          text-sm font-medium whitespace-nowrap
                          transition-all duration-300 ease-out
                          ${isActive 
                            ? 'text-white shadow-lg shadow-blue-900/20' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-[#0f2a44] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <span className="relative z-10">{category.label}</span>

                {count > 0 && (
                  <span className={`relative z-10 text-xs px-2 py-0.5 rounded-full
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
