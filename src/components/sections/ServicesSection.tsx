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
    description: "Accurate cost breakdowns to control your budget and eliminate surprises.",
  },
  {
    icon: Palette,
    title: "Interior Design",
    description: "Functional, modern interiors tailored to your lifestyle and space.",
  },
  {
    icon: TreePine,
    title: "Landscape Design",
    description: "Outdoor environments designed to elevate your property value.",
  },
  {
    icon: Users,
    title: "Site Supervision",
    description: "Professional oversight ensuring quality, timelines, and compliance.",
  },
  {
    icon: Hammer,
    title: "Turnkey Construction",
    description: "End-to-end building solutions — from foundation to final finish.",
  },
  {
    icon: Camera,
    title: "3D Visualization",
    description: "See your home before construction with realistic previews.",
  },
];

export default function ServicesSection() {
  return (
    <section className="section bg-canvas-subtle">
      <div className="section-inner">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-deep mb-4">
            From Design to Construction — We Handle Everything
          </h2>
          <p className="text-neutral-600">
            Whether you’re starting with a plan or already have drawings, 
            Tefetro Studio supports you at every stage — from budgeting and design 
            to full construction and delivery.
          </p>
        </div>

        {/* TRUST STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass p-4 text-center rounded-lg">
            <p className="text-lg font-semibold text-deep">100+</p>
            <p className="text-xs text-neutral-500">Projects Supported</p>
          </div>
          <div className="glass p-4 text-center rounded-lg">
            <p className="text-lg font-semibold text-deep">End-to-End</p>
            <p className="text-xs text-neutral-500">Project Delivery</p>
          </div>
          <div className="glass p-4 text-center rounded-lg">
            <p className="text-lg font-semibold text-deep">Cost Control</p>
            <p className="text-xs text-neutral-500">BOQs & Planning</p>
          </div>
          <div className="glass p-4 text-center rounded-lg">
            <p className="text-lg font-semibold text-deep">Kenya Focused</p>
            <p className="text-xs text-neutral-500">Local Expertise</p>
          </div>
        </div>

        {/* SERVICES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="glass rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                {/* ICON */}
                <div className="w-12 h-12 rounded-lg bg-deep/5 flex items-center justify-center mb-4 group-hover:bg-deep transition">
                  <Icon
                    size={24}
                    className="text-deep group-hover:text-white transition"
                  />
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-deep mb-2">
                  {service.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* VALUE PROPOSITION BLOCK */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">

          <div>
            <h3 className="text-2xl font-semibold text-deep mb-4">
              Already Have Drawings? We Can Still Help You Build
            </h3>
            <p className="text-neutral-600 mb-4">
              Even if you didn’t buy your plans from us, Tefetro Studio can step in 
              to guide, supervise, or fully execute your construction project.
            </p>
            <p className="text-neutral-600">
              Our systems ensure quality control, cost efficiency, and smooth execution 
              from start to finish.
            </p>
          </div>

          <div className="glass rounded-xl p-6">
            <h4 className="font-semibold text-deep mb-3">
              What You Get:
            </h4>

            <ul className="space-y-2 text-sm text-neutral-600">
              <li>✔ Professional project guidance</li>
              <li>✔ Transparent cost management</li>
              <li>✔ Reliable construction execution</li>
              <li>✔ Reduced risk and delays</li>
            </ul>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link href="/contact" className="btn-primary gap-2">
            Start Your Project
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}