// src/components/consultation/ConsultationProcess.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageSquare, FileText, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Book Session',
    description: 'Choose a time that works for you. We\'ll confirm within 2 hours.',
    step: '01',
  },
  {
    icon: MessageSquare,
    title: 'Initial Discussion',
    description: 'Share your vision, requirements, and budget during the consultation.',
    step: '02',
  },
  {
    icon: FileText,
    title: 'Receive Proposal',
    description: 'Get a detailed proposal with cost estimates and timeline.',
    step: '03',
  },
  {
    icon: Rocket,
    title: 'Start Project',
    description: 'Begin your journey with our expert team by your side.',
    step: '04',
  },
];

export function ConsultationProcess() {
  return (
    <section id="process" className="py-20 bg-gradient-to-br from-[#eaf3fb] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            From consultation to completion - we make it easy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#0f2a44] to-[#1a3a5c] rounded-2xl flex items-center justify-center relative z-10">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-[#0f2a44]/20 to-transparent -translate-y-1/2" />
                )}
              </div>
              <h3 className="text-xl font-bold text-[#0f2a44] mb-2">{step.title}</h3>
              <p className="text-[#475569]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}