// src/components/consultation/ConsultationFAQ.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What happens during the free consultation?',
    answer: 'During the 30-minute session, we discuss your project vision, requirements, budget, and timeline. Our expert will provide initial advice, answer your questions, and outline the next steps. It\'s a no-obligation conversation to see how we can help.',
  },
  {
    question: 'Do I need to prepare anything before the consultation?',
    answer: 'It\'s helpful to have: your property details (size, location), any ideas or inspiration images, your budget range, and desired timeline. Don\'t worry if you\'re unsure - we\'ll guide you through everything.',
  },
  {
    question: 'What types of projects do you handle?',
    answer: 'We handle residential homes, commercial buildings, mixed-use developments, renovations, interior design, and landscape architecture. Our team has expertise across all project scales and types.',
  },
  {
    question: 'Can I get a cost estimate during the consultation?',
    answer: 'Yes! We provide preliminary cost estimates based on your requirements. A detailed quote will be provided after the consultation once we understand your complete project scope.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We primarily serve Nairobi and surrounding areas, but we handle projects across Kenya. Our team can travel for site visits and provide virtual consultations for remote projects.',
  },
  {
    question: 'Is the consultation really free with no obligation?',
    answer: 'Absolutely! The initial consultation is completely free with no pressure to commit. It\'s an opportunity for you to get expert advice and see if we\'re the right fit for your project.',
  },
  {
    question: 'How soon can I get a consultation?',
    answer: 'We typically schedule consultations within 2-3 business days. Urgent requests can be accommodated - just mention your timeline in the form and we\'ll do our best to fit you in.',
  },
  {
    question: 'What if I need to reschedule?',
    answer: 'No problem! Just contact us at least 24 hours in advance and we\'ll find a new time that works for you.',
  },
];

export function ConsultationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-[#eaf3fb] to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#475569]">
            Everything you need to know about our consultation service
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#0f2a44] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-orange-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-[#475569] leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}