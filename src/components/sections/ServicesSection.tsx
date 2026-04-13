// src/components/sections/ServicesSection.tsx
"use client";

import { HardHat, MapPin, ClipboardCheck, FileCheck, Ruler, Calendar, ArrowRight } from "lucide-react";

const services = [
  {
    icon: HardHat,
    title: "Construction Supervision",
    description: "Expert oversight ensuring quality and adherence to approved plans"
  },
  {
    icon: MapPin,
    title: "Site Consultancy",
    description: "Pre-construction site analysis and feasibility assessments"
  },
  {
    icon: ClipboardCheck,
    title: "Approval Processing",
    description: "Navigate county approvals and regulatory requirements seamlessly"
  },
  {
    icon: FileCheck,
    title: "EIA Reports",
    description: "Environmental Impact Assessment reports for compliance"
  },
  {
    icon: Ruler,
    title: "Structural Drawings",
    description: "Engineering plans for foundations, beams, and structural elements"
  },
  {
    icon: Calendar,
    title: "Project Management",
    description: "End-to-end coordination from groundbreaking to handover"
  }
];

export default function ServicesSection() {
  return (
    <section 
      className="py-20 sm:py-28 bg-[#0f2a44] relative overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Header */}
          <div className="lg:sticky lg:top-28">
            <p className="text-[#ff7f00] font-semibold text-sm tracking-wider uppercase mb-3">
              Premium Services
            </p>
            <h2 
              id="services-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Need Full Project Support?
            </h2>
            <p className="text-[#a0c4e8] text-lg mb-8 leading-relaxed">
              These services are provided through direct consultation with our team of licensed architects and engineers.
            </p>

            <a 
              href="/consultation"
              className="group inline-flex items-center gap-3 bg-[#ff7f00] hover:bg-[#e66b00] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0f2a44]"
              aria-label="Book a free consultation with our experts"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <span>Book Free Consultation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>

            <p className="mt-4 text-sm text-[#6b8cae]">
              Response within 24 hours
            </p>
          </div>

          {/* Right: Services Grid */}
          <div 
            className="grid sm:grid-cols-2 gap-4"
            role="list"
            aria-label="Available services"
          >
            {services.map((service, index) => (
              <article 
                key={index}
                className="group p-6 bg-[#1f4e79]/30 rounded-xl border border-[#1f4e79]/50 hover:bg-[#1f4e79]/50 hover:border-[#4f86c6]/50 transition-all duration-300"
                role="listitem"
                itemScope
                itemType="https://schema.org/Service"
              >
                <meta itemProp="provider" content="Tefetro Limited" />
                <div 
                  className="w-10 h-10 bg-[#1f4e79] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#ff7f00] transition-colors duration-300"
                  aria-hidden="true"
                >
                  <service.icon className="w-5 h-5 text-white" />
                </div>
                <h3 
                  className="text-white font-semibold mb-2"
                  itemProp="name"
                >
                  {service.title}
                </h3>
                <p 
                  className="text-sm text-[#8fb8d9] leading-relaxed"
                  itemProp="description"
                >
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}