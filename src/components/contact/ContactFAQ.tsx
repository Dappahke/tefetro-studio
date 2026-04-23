// src/components/contact/ContactFAQ.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'How long does it take to get a custom house plan?',
    answer: 'Typically, our custom architectural drawings take 2-4 weeks depending on complexity. Rush options are available for urgent projects. We provide weekly progress updates throughout the process.',
  },
  {
    question: 'What is included in a ready-made plan purchase?',
    answer: 'Every ready-made plan includes floor plans, elevations, sections, and a basic BOQ. Add-ons like structural drawings, electrical plans, and interior design are available at checkout.',
  },
  {
    question: 'Do you offer construction services outside Nairobi?',
    answer: 'Yes! We work across Kenya including Mombasa, Kisumu, Nakuru, and Eldoret. Our network of certified contractors ensures quality delivery regardless of location.',
  },
  {
    question: 'Can I modify a ready-made plan to suit my needs?',
    answer: 'Absolutely. We offer plan customization services starting at KES 15,000. Minor adjustments (room sizes, window placements) can be done quickly, while major structural changes require a full custom plan.',
  },
  {
    question: 'What is your payment structure for construction projects?',
    answer: 'We typically work with a 30% deposit, 40% at structural completion, and 30% at handover. For larger projects, we can structure milestone-based payments tailored to your cash flow.',
  },
]

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-bold text-3xl text-[#0f2a44] mb-4">Common Questions</h2>
        <p className="text-[#475569]">Quick answers to frequent inquiries</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-[#0f2a44]/5 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-[#eaf3fb]/50 transition-colors"
            >
              <span className="font-semibold text-[#0f2a44] pr-4">{faq.question}</span>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#eaf3fb] flex items-center justify-center text-[#0f2a44] transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-[#475569] leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}