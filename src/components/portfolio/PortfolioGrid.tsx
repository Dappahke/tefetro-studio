// ============================================================
// PORTFOLIO GRID COMPONENT
// Responsive masonry/grid with filtering
// ============================================================

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioProject, PortfolioCategory } from '@/types/portfolio';
import ProjectCard from './ProjectCard';
import WorkFilters from './WorkFilters';

interface PortfolioGridProps {
  projects: PortfolioProject[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | 'all'>('all');

  // Calculate category counts
  const counts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach(project => {
      counts[project.category] = (counts[project.category] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter(project => project.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section id="portfolio-grid" className="bg-white">
      {/* Sticky Filters */}
      <WorkFilters 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        counts={counts}
      />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}



//✅ FILE 12: src/components/portfolio/PortfolioGrid.tsx
//🎯 Features: Sticky filters, animated grid transitions, empty state
//🎨 Layout: 1 col mobile, 2 col tablet, 3 col desktop