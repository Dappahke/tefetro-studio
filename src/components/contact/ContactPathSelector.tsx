// src/components/contact/ContactPathSelector.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const paths = [
  {
    id: 'plans',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'House Plans',
    description: 'Browse or request custom architectural drawings',
    color: 'from-[#0f2a44] to-[#1a3a5c]',
  },
  {
    id: 'construction',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Construction',
    description: 'Full turnkey or supervision services',
    color: 'from-[#e66b00] to-[#ff7f00]',
  },
  {
    id: 'consultation',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Free Consultation',
    description: 'Talk to an architect about your project',
    color: 'from-[#0f2a44] to-[#1a3a5c]',
  },
  {
    id: 'partnership',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Partnership',
    description: 'Collaborate with us as a contractor or supplier',
    color: 'from-[#e66b00] to-[#ff7f00]',
  },
]

export function ContactPathSelector() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-16 relative z-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paths.map((path, index) => (
          <motion.button
            key={path.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => setSelectedPath(path.id)}
            className={`group relative p-6 rounded-2xl text-left transition-all duration-300 ${
              selectedPath === path.id
                ? 'bg-gradient-to-br ' + path.color + ' text-white shadow-xl scale-105'
                : 'bg-white text-[#0f2a44] shadow-lg hover:shadow-xl hover:-translate-y-1 border border-[#0f2a44]/5'
            }`}
          >
            <div className={`mb-4 ${selectedPath === path.id ? 'text-white' : 'text-[#e66b00]'}`}>
              {path.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{path.title}</h3>
            <p className={`text-sm ${selectedPath === path.id ? 'text-white/80' : 'text-[#475569]'}`}>
              {path.description}
            </p>
            
            <div className={`mt-4 flex items-center gap-2 text-sm font-medium ${
              selectedPath === path.id ? 'text-white' : 'text-[#e66b00]'
            }`}>
              <span>Get Started</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 p-6 bg-[#eaf3fb] rounded-2xl border border-[#0f2a44]/5"
          >
            <p className="text-[#475569] text-center">
              Great choice! We&apos;ve pre-selected the best options for you in the form below. 
              <button 
                onClick={() => setSelectedPath(null)}
                className="ml-2 text-[#e66b00] font-medium hover:underline"
              >
                Clear selection
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}