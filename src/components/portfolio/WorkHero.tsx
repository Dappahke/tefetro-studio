'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioProject } from '@/types/portfolio';
import BlueprintGrid from './BlueprintGrid';

interface WorkHeroProps {
  featuredProjects: PortfolioProject[];
}

export default function WorkHero({ featuredProjects }: WorkHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (featuredProjects.length <= 1) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProjects.length]);

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
  }, [featuredProjects.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  }, [featuredProjects.length]);

  const currentProject = featuredProjects[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="relative min-h-[90vh] bg-[#0f2a44] overflow-hidden">
      {/* Blueprint Grid Background */}
      <BlueprintGrid opacity={0.05} />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[60vh]">
          
          {/* LEFT SIDE - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white"
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-[#e66b00]" />
              <span className="text-sm font-medium tracking-widest uppercase text-[#4f86c6]">
                Portfolio
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Our{' '}
              <span className="text-[#ff7f00]">Work</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-xl"
            >
              Explore our architectural concepts, build-ready plans, and design 
              solutions crafted for modern living, investment, and functional 
              construction.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="#portfolio-grid"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 
                         bg-[#e66b00] hover:bg-[#ff7f00] text-white font-semibold 
                         rounded-lg transition-all duration-300 
                         hover:shadow-lg hover:shadow-orange-500/25
                         transform hover:-translate-y-0.5"
              >
                Browse House Plans
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 
                         border-2 border-white/20 hover:border-white/40 
                         text-white font-semibold rounded-lg 
                         transition-all duration-300
                         hover:bg-white/5"
              >
                Request Custom Design
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-8"
            >
              <div>
                <div className="text-3xl font-bold text-[#ff7f00]">30+</div>
                <div className="text-sm text-gray-400 mt-1">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#ff7f00]">6</div>
                <div className="text-sm text-gray-400 mt-1">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#ff7f00]">100%</div>
                <div className="text-sm text-gray-400 mt-1">Build-Ready</div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Auto-Rotating Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden 
                          bg-[#1f4e79]/20 border border-white/10 
                          shadow-2xl shadow-black/50">
              
              {/* Image Container */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentProject?.image || '/images/placeholder.jpg'}
                    alt={currentProject?.title || 'Featured project'}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t 
                                from-[#0f2a44]/90 via-transparent to-transparent" />
                  
                  {/* Project Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-[#e66b00] text-white text-xs 
                                     font-semibold rounded-full uppercase tracking-wider">
                        {currentProject?.status}
                      </span>
                      {currentProject?.plot_fit && (
                        <span className="px-3 py-1 bg-white/10 text-white text-xs 
                                       font-medium rounded-full backdrop-blur-sm">
                          {currentProject.plot_fit}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {currentProject?.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {currentProject?.short_description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 
                         w-10 h-10 rounded-full bg-black/30 backdrop-blur-md 
                         border border-white/10 flex items-center justify-center
                         text-white hover:bg-black/50 transition-all duration-300
                         hover:scale-110"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 
                         w-10 h-10 rounded-full bg-black/30 backdrop-blur-md 
                         border border-white/10 flex items-center justify-center
                         text-white hover:bg-black/50 transition-all duration-300
                         hover:scale-110"
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {featuredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? 'w-8 bg-[#e66b00]'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Technical Corner Accents */}
            <div className="absolute -top-2 -left-2 w-16 h-16 border-l-2 border-t-2 
                          border-[#4f86c6]/30 rounded-tl-lg" />
            <div className="absolute -bottom-2 -right-2 w-16 h-16 border-r-2 border-b-2 
                          border-[#4f86c6]/30 rounded-br-lg" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 
                    bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}