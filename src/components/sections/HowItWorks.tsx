// src/components/sections/HowItWorks.tsx
"use client";

import { Search, Plus, Users } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Choose a Design",
    description: "Browse our collection and purchase ready-made plans that match your vision and budget."
  },
  {
    icon: Plus,
    number: "02",
    title: "Add What You Need",
    description: "Enhance your plan with BOQ cost estimates, interior design, or landscaping packages."
  },
  {
    icon: Users,
    number: "03",
    title: "Get Expert Help",
    description: "Connect with our team for approvals, site supervision, and construction support."
  }
];

export default function HowItWorks() {
  return (
    <section 
      className="py-20 sm:py-28 bg-[#eaf3fb]"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <p className="text-[#e66b00] font-semibold text-sm tracking-wider uppercase mb-3">
            Simple Process
          </p>
          <h2 
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl font-bold text-[#222]"
          >
            How It Works
          </h2>
        </header>

        <div 
          className="grid md:grid-cols-3 gap-8"
          role="list"
          aria-label="Process steps"
        >
          {steps.map((step, index) => (
            <article 
              key={index}
              className="group relative bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[#0f2a44]/5 hover:-translate-y-1"
              role="listitem"
            >
              {/* Number Badge */}
              <div className="absolute top-6 right-6 text-5xl font-bold text-[#eaf3fb] group-hover:text-[#d4e6f5] transition-colors">
                {step.number}
              </div>

              {/* Icon */}
              <div 
                className="relative z-10 w-14 h-14 bg-[#eaf3fb] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1f4e79] transition-colors duration-300"
                aria-hidden="true"
              >
                <step.icon className="w-7 h-7 text-[#1f4e79] group-hover:text-white transition-colors" />
              </div>

              {/* Content */}
              <h3 className="relative z-10 text-xl font-bold text-[#222] mb-3">
                {step.title}
              </h3>
              <p className="relative z-10 text-[#666] leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}