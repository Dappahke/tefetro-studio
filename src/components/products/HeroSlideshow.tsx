'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Zap, 
  ChevronRight, 
  Building2, 
  Download,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react'

interface HeroSlideshowProps {
  images: string[]
}

export function HeroSlideshow({ images }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-advance slideshow every 6 seconds (slower for better UX)
  useEffect(() => {
    if (images.length <= 1 || isHovering) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [images.length, isHovering])

  // Preload next image for smoother transitions
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIndex + 1) % images.length
      const img = new window.Image()
      img.src = images[nextIndex]
    }
  }, [currentIndex, images])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const scrollToProducts = useCallback(() => {
    const element = document.getElementById('products-grid')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      // Track analytics event
      console.log('CTA clicked: Browse Plans')
    }
  }, [])

  // Fallback if no images provided
  const displayImages = images.length > 0 ? images : ['/images/hero-fallback.jpg']

  // Stats for social proof
  const stats = [
    { value: '500+', label: 'Plans Available', icon: Building2 },
    { value: '2,000+', label: 'Happy Clients', icon: Star },
    { value: '24hr', label: 'Instant Delivery', icon: Clock },
    { value: 'KES 15B+', label: 'Projects Built', icon: TrendingUp }
  ]

  return (
    <section 
      className="relative h-[85vh] min-h-[600px] max-h-[900px] w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Images with Enhanced Ken Burns Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0"
        >
          <Image
            src={displayImages[currentIndex]}
            alt={`Architectural design ${currentIndex + 1}`}
            fill
            priority={currentIndex === 0}
            className="object-cover"
            sizes="100vw"
            onLoadingComplete={() => setIsLoading(false)}
          />
          {/* Enhanced Ken Burns zoom animation */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute inset-0"
          />
        </motion.div>
      </AnimatePresence>

      {/* Loading Skeleton */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#1E1E1E] to-[#0F4C5C] z-20 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#F28C00]/30 border-t-[#F28C00] rounded-full animate-spin" />
              <p className="text-[#FAF9F6] text-sm">Loading designs...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/95 via-[#1E1E1E]/60 to-[#1E1E1E]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E1E]/50 via-transparent to-transparent" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-repeat" style={{backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FAF9F6" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`}} />

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-center">
        <div className="max-w-5xl">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F28C00]/20 backdrop-blur-md rounded-full border border-[#F28C00]/30 mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Building2 className="w-4 h-4 text-[#F28C00] animate-pulse" />
            <span className="text-sm font-medium text-[#FAF9F6] tracking-wide">
              Kenya&apos;s #1 Digital Plan Marketplace
            </span>
          </motion.div>

          {/* Main Headline with Typing Animation Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#FAF9F6] leading-[1.1] mb-6">
              Build Your Dream
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F28C00] to-[#F28C00]/70 mt-2">
                Today, Not Tomorrow
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-[#FAF9F6]/90 max-w-2xl leading-relaxed mb-8 backdrop-blur-sm"
          >
            Professional architectural plans ready for immediate download. 
            Licensed for construction across Kenya and East Africa. 
            <span className="block text-[#F28C00] font-semibold mt-2">
              Skip the wait—start building now.
            </span>
          </motion.p>

          {/* CTA Buttons with Enhanced Effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <motion.button
              onClick={scrollToProducts}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F28C00] to-[#F28C00]/90 text-[#1E1E1E] font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#F28C00]/30 transition-all duration-300"
            >
              <span>Browse Plans</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              onClick={scrollToProducts}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FAF9F6]/10 backdrop-blur-md text-[#FAF9F6] font-semibold rounded-xl border border-[#FAF9F6]/30 hover:bg-[#FAF9F6]/20 hover:border-[#FAF9F6]/50 transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              <span>Instant Download</span>
            </motion.button>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-[#FAF9F6]/10 backdrop-blur-md rounded-xl p-3 border border-[#FAF9F6]/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4 text-[#F28C00]" />
                  <span className="text-xl font-bold text-[#FAF9F6]">{stat.value}</span>
                </div>
                <p className="text-xs text-[#FAF9F6]/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-wrap items-center gap-6 text-[#FAF9F6]/80"
          >
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 bg-[#6faa99]/20 rounded-lg group-hover:bg-[#6faa99]/30 transition-colors">
                <Shield className="w-4 h-4 text-[#6faa99]" />
              </div>
              <span className="text-sm font-medium">Code Compliant</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 bg-[#6faa99]/20 rounded-lg group-hover:bg-[#6faa99]/30 transition-colors">
                <Lock className="w-4 h-4 text-[#6faa99]" />
              </div>
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 bg-[#6faa99]/20 rounded-lg group-hover:bg-[#6faa99]/30 transition-colors">
                <Zap className="w-4 h-4 text-[#6faa99]" />
              </div>
              <span className="text-sm font-medium">Instant Delivery</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-[#FAF9F6]/10 backdrop-blur-md rounded-full border border-[#FAF9F6]/20 hover:bg-[#FAF9F6]/20 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#FAF9F6] group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-[#FAF9F6]/10 backdrop-blur-md rounded-full border border-[#FAF9F6]/20 hover:bg-[#FAF9F6]/20 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 text-[#FAF9F6] group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Slide Indicators with Progress Bar */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <div className="flex gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`group relative h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-12 bg-[#F28C00]' 
                    : 'w-2 bg-[#FAF9F6]/40 hover:bg-[#FAF9F6]/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-[#F28C00] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#FAF9F6]/50 font-mono">
            {currentIndex + 1} / {displayImages.length}
          </span>
        </div>
      )}

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 right-8 z-20 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-[#FAF9F6]/40 hover:text-[#FAF9F6]/60 transition-colors cursor-pointer"
          onClick={scrollToProducts}
        >
          <span className="text-xs font-medium tracking-wider uppercase">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#FAF9F6]/60 to-transparent" />
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRightIcon className="w-4 h-4 rotate-90" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10" />
    </section>
  )
}