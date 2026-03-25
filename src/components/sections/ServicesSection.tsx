// src/components/sections/ServicesSection.tsx

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Palette,
  TreePine,
  Users,
  Hammer,
  Camera,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "BOQ Preparation",
    description: "Accurate cost breakdowns for controlled budgeting and planning.",
  },
  {
    icon: Palette,
    title: "Interior Design",
    description: "Complete interior systems, materials, and finishes tailored to your space.",
  },
  {
    icon: TreePine,
    title: "Landscape Design",
    description: "Outdoor environments designed to complement your architecture.",
  },
  {
    icon: Users,
    title: "Site Supervision",
    description: "Professional oversight to ensure quality and adherence to design.",
  },
  {
    icon: Hammer,
    title: "Turnkey Construction",
    description: "End-to-end project execution — from ground-breaking to completion.",
  },
  {
    icon: Camera,
    title: "3D Visualization",
    description: "Photorealistic previews and walkthroughs before construction begins.",
  },
];

export default function ServicesSection() {
  return (
    <section className="section">
      <div className="section-inner">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deep mb-4">
            Beyond Plans — Full Project Support
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            We don’t just design. We structure, guide, and execute your entire
            project lifecycle with precision.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="glass rounded-xl p-6 transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1 group cursor-pointer"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-deep/5 flex items-center justify-center mb-4 group-hover:bg-deep group-hover:text-white transition-colors">
                  <Icon
                    size={24}
                    className="text-deep group-hover:text-white"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-deep mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary gap-2">
            Explore All Services
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}