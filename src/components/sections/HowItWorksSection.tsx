// src/components/sections/HowItWorksSection.tsx

import { Search, Palette, HardHat } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Select a Plan",
    description:
      "Choose from our ready-made architectural designs tailored for modern living and efficient construction.",
    icon: Search,
  },
  {
    number: "02",
    title: "Customize & Prepare",
    description:
      "Refine layouts, add BOQs, interiors, and technical details to match your exact requirements.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Build with Confidence",
    description:
      "Execute your project with structured oversight, clear milestones, and full visibility throughout.",
    icon: HardHat,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section">
      <div className="section-inner">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deep mb-4">
            A Clear, Structured Process
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            From selecting a plan to completing construction — every step is
            defined, transparent, and easy to follow.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">

                <div className="glass rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1">

                  {/* Step number */}
                  <div className="text-6xl font-bold text-neutral-200 absolute top-4 right-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-deep/5 flex items-center justify-center mb-6">
                    <Icon size={28} className="text-deep" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-deep mb-3">
                    {step.title}
                  </h3>

                  <p className="text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-neutral-200" />
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}