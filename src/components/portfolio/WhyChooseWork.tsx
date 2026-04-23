// ============================================================
// WHY OUR WORK STANDS OUT COMPONENT
// 4 icon cards with hover effects
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  LayoutGrid, 
  Wallet, 
  Globe 
} from 'lucide-react';

const features = [
  {
    icon: FileCheck,
    title: 'Build-Ready Plans',
    description: 'Every design is developed with construction feasibility in mind. No theoretical concepts—only practical, executable plans.',
    color: 'bg-blue-50 text-[#1f4e79]',
    borderColor: 'border-blue-100',
  },
  {
    icon: LayoutGrid,
    title: 'Modern Functional Layouts',
    description: 'Optimized flow between spaces with natural lighting, ventilation, and contemporary living standards built into every design.',
    color: 'bg-orange-50 text-[#e66b00]',
    borderColor: 'border-orange-100',
  },
  {
    icon: Wallet,
    title: 'Budget-Conscious Thinking',
    description: 'Designs that respect your budget without compromising quality. Smart material choices and efficient construction methods.',
    color: 'bg-green-50 text-green-700',
    borderColor: 'border-green-100',
  },
  {
    icon: Globe,
    title: 'Tailored for Kenyan & African Markets',
    description: 'Local building codes, climate considerations, and cultural preferences integrated into every architectural decision.',
    color: 'bg-purple-50 text-purple-700',
    borderColor: 'border-purple-100',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function WhyChooseWork() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#e66b00]" />
            <span className="text-sm font-medium text-[#1f4e79] uppercase tracking-wider">
              Why Choose Us
            </span>
            <div className="h-px w-12 bg-[#e66b00]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                       text-[#0f2a44] mb-4">
            Why Our Work Stands Out
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional architectural solutions that combine technical excellence 
            with practical market understanding.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group relative p-8 rounded-2xl border ${feature.borderColor}
                          bg-white hover:shadow-xl hover:shadow-gray-200/50
                          transition-shadow duration-500`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${feature.color} 
                              flex items-center justify-center mb-6
                              group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#0f2a44] mb-3 
                             group-hover:text-[#1f4e79] transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 
                              bg-gradient-to-r from-[#0f2a44] to-[#4f86c6]
                              transform scale-x-0 group-hover:scale-x-100 
                              transition-transform duration-500 origin-left 
                              rounded-b-2xl" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}



//✅ FILE 9: src/components/portfolio/WhyChooseWork.tsx
//🎯 Features: 4 icon cards, staggered animations, hover lift effect
//🎨 Colors: Blue, Orange, Green, Purple themed cards