// src/components/consultation/ConsultationBenefits.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileCheck, Shield, TrendingUp, Target } from 'lucide-react';

const benefits = [
  {
    icon: CheckCircle,
    title: 'No Obligation',
    description: 'Free consultation with no pressure to commit. Get expert advice risk-free.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Clock,
    title: '30-Minute Session',
    description: 'Focused, efficient discussion covering your project requirements and questions.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileCheck,
    title: 'Cost Estimation',
    description: 'Get preliminary budget estimates and understand cost breakdowns.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Expert Advice',
    description: 'Licensed architects and engineers with 10+ years of experience.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: TrendingUp,
    title: 'Value Engineering',
    description: 'Learn how to maximize value while staying within your budget.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Target,
    title: 'Clear Roadmap',
    description: 'Leave with a clear understanding of next steps and timelines.',
    color: 'from-indigo-500 to-purple-500',
  },
];

export function ConsultationBenefits() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
            What You'll Get
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            A comprehensive consultation designed to give you clarity and confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2a44] mb-2">{benefit.title}</h3>
              <p className="text-[#475569] leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}