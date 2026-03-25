// src/app/page.tsx

import {
  HeroSection,
  FeaturedPlansSection,
  HowItWorksSection,
  ServicesSection,
  TestimonialsSection,
  FinalCTASection,
  DesignExperienceSection,
} from "@/components/sections";

import TrustBar from "@/components/sections/TrustBar";

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">

      {/* HERO */}
      <section className="relative bg-canvas">
        <HeroSection />
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-neutral-200 bg-deep text-white">
        <TrustBar />
      </section>

      {/* FEATURED PLANS */}
      <section className="bg-canvas-subtle">
        <FeaturedPlansSection />
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-canvas">
        <HowItWorksSection />
      </section>

      {/* DESIGN EXPERIENCE (VISUAL DIFFERENTIATOR) */}
      <section className="bg-white">
        <DesignExperienceSection />
      </section>

      {/* SERVICES */}
      <section className="bg-canvas-subtle">
        <ServicesSection />
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-canvas">
        <TestimonialsSection />
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-brand text-white">
        <FinalCTASection />
      </section>

    </main>
  );
}