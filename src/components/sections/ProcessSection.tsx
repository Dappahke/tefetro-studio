// src/components/sections/ProcessSection.tsx
import { ArrowRight } from "lucide-react";

const steps = [
  { step: "Sketch", desc: "Concept & Planning" },
  { step: "Model", desc: "3D Visualization" },
  { step: "Build", desc: "Construction" },
];

export default function ProcessSection() {
  return (
    <section className="section relative z-10">
      <div className="section-inner">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-500 mb-4">
            Our Design Approach
          </h2>
          <p className="text-charcoal-400">
            Thoughtful architecture, from first sketch to final build.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {steps.map((item, index) => (
            <ProcessStep 
              key={index} 
              item={item} 
              isLast={index === steps.length - 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ 
  item, 
  isLast 
}: { 
  item: typeof steps[0]; 
  isLast: boolean 
}) {
  return (
    <div className="flex items-center gap-4 md:gap-8">
      <div className="text-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 mx-auto">
          <span className="text-2xl md:text-3xl font-bold text-teal-500">
            {item.step[0]}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-teal-500 mb-1">
          {item.step}
        </h3>
        <p className="text-sm text-charcoal-400">{item.desc}</p>
      </div>
      {!isLast && (
        <ArrowRight size={24} className="text-sage-300 hidden md:block" />
      )}
    </div>
  );
}