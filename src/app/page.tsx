// src/app/page.tsx

import {
  HeroSection,
  FeaturedPlansSection,
  HowItWorksSection,
  ServicesSection,
  TestimonialsSection,
  FinalCTASection,
  DesignExperienceSection,
  TransparencySection,
} from "@/components/sections";

import TrustBar from "@/components/sections/TrustBar";

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">

        {/* HERO */}
      <section className="bg-canvas">
        <HeroSection />
      </section>

      {/* TRUST */}
      <section className="bg-deep text-white border-y border-neutral-200">
        <TrustBar />
      </section>

      {/* FEATURED PLANS (MONEY SECTION) */}
      <section className="bg-canvas-subtle">
        <FeaturedPlansSection />
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-canvas">
        <HowItWorksSection />
      </section>

      {/* DESIGN EXPERIENCE (BRAND DIFFERENTIATOR) */}
      <section className="bg-white">
        <DesignExperienceSection />
      </section>

      {/* SERVICES (HIGH-TICKET CONVERSION) */}
      <section className="bg-canvas-subtle">
        <ServicesSection />
      </section>

      {/* TRANSPARENCY */}
      <section className="bg-canvas-subtle">
        <TransparencySection />
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