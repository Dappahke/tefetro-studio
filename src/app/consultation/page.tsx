// src/app/consultation/page.tsx
import type { Metadata } from 'next';
import {
  ConsultationHero,
  ConsultationBenefits,
  ConsultationProcess,
  ConsultationForm,
  ConsultationTeam,
  ConsultationTestimonials,
  ConsultationFAQ,
  ConsultationCTA,
} from '@/components/consultation';

export const metadata: Metadata = {
  title: 'Free Consultation | Tefetro Studios - Expert Architectural Advice',
  description: 'Book a free 30-minute consultation with our expert architects and engineers. Get professional advice, cost estimates, and timeline planning for your dream project.',
  keywords: 'free consultation, architectural consultation, building design Kenya, construction advice, Tefetro Studios, house plans consultation',
  openGraph: {
    title: 'Free Consultation | Tefetro Studios',
    description: 'Get expert architectural advice for your dream project. Free 30-minute session.',
    type: 'website',
    url: 'https://tefetro.studio/consultation',
    images: [{ url: '/consultation-og.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://tefetro.studio/consultation',
  },
};

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-white">
      <ConsultationHero />
      <ConsultationBenefits />
      <ConsultationProcess />
      <ConsultationForm />
      <ConsultationTeam />
      <ConsultationTestimonials />
      <ConsultationFAQ />
      <ConsultationCTA />
    </main>
  );
}