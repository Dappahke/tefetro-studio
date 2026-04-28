// src/components/consultation/ConsultationTestimonials.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mwangi',
    project: 'Residential Villa, Karen',
    text: 'The consultation was incredibly helpful. Noel walked us through every detail and helped us understand the costs and timeline. We ended up building our dream home with Tefetro!',
    rating: 5,
    image: '/testimonials/sarah.jpg',
  },
  {
    name: 'James Omondi',
    project: 'Commercial Building, Westlands',
    text: 'Excellent consultation! Nicholas provided valuable insights on construction methodology and cost-saving measures. Their expertise is unmatched.',
    rating: 5,
    image: '/testimonials/james.jpg',
  },
  {
    name: 'Dr. Grace Muthoni',
    project: 'Medical Centre, Kiambu',
    text: 'Professional, knowledgeable, and genuinely caring. The consultation gave us confidence to proceed with our project. Highly recommended!',
    rating: 5,
    image: '/testimonials/grace.jpg',
  },
  {
    name: 'Peter Njoroge',
    project: 'Mixed-Use Development, Ruaka',
    text: 'Best decision we made was booking a consultation. They helped us avoid costly mistakes and optimized our design for better ROI.',
    rating: 5,
    image: '/testimonials/peter.jpg',
  },
];

export function ConsultationTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Join hundreds of satisfied homeowners and developers who trusted our expertise
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#eaf3fb] to-white rounded-2xl p-8 md:p-12 shadow-xl"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-[#0f2a44] leading-relaxed mb-6">
                "{testimonials[currentIndex].text}"
              </p>
              <div>
                <p className="font-bold text-[#0f2a44]">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-[#475569]">{testimonials[currentIndex].project}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-orange-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}