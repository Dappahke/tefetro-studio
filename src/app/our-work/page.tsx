// ============================================================
// OUR WORK PAGE - Main Entry Point
// Next.js 15 Async Server Component with SEO
// ============================================================

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllProjects, getFeaturedProjects } from '@/lib/supabase/portfolio-service';
import WorkHero from '@/components/portfolio/WorkHero';
import PortfolioGrid from '@/components/portfolio/PortfolioGrid';
import FeaturedCaseStudy from '@/components/portfolio/FeaturedCaseStudy';
import WhyChooseWork from '@/components/portfolio/WhyChooseWork';
import CustomCTA from '@/components/portfolio/CustomCTA';
import FinalCTA from '@/components/portfolio/FinalCTA';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Our Work | Tefetro Limited',
  description: 'Explore Tefetro\'s architectural drawings, house plans, rental unit concepts, interior layouts, and design solutions. Professional Kenyan architecture studio.',
  keywords: [
    'Kenyan architecture',
    'house plans Kenya',
    'building plans Nairobi',
    'architectural designs',
    'residential plans',
    'rental units Kenya',
    'interior design Kenya',
    'landscaping Kenya',
    '50x100 house plans',
    '40x80 house plans'
  ],
  openGraph: {
    title: 'Our Work | Tefetro Studio',
    description: 'Explore Tefetro\'s architectural drawings, house plans, rental unit concepts, interior layouts, and design solutions.',
    type: 'website',
    locale: 'en_KE',
    images: [
      {
        url: '/images/og-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Tefetro Studios Portfolio - Architectural Designs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Work | Tefetro Limited',
    description: 'Explore Tefetro\'s architectural drawings and design solutions.',
  },
  alternates: {
    canonical: 'https://tefetro.studio/our-work',
  },
};

// Loading fallback for hero
function HeroSkeleton() {
  return (
    <div className="min-h-[90vh] bg-[#0f2a44] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-16 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/10 rounded" />
            <div className="h-4 w-5/6 bg-white/10 rounded" />
            <div className="flex gap-4">
              <div className="h-12 w-40 bg-white/10 rounded-lg" />
              <div className="h-12 w-40 bg-white/10 rounded-lg" />
            </div>
          </div>
          <div className="aspect-[4/3] bg-white/10 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// Loading fallback for grid
function GridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-12 w-full bg-gray-100 rounded-lg mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// Main Page Component - Async Server Component
export default async function OurWorkPage() {
  // Fetch data in parallel
  const [allProjects, featuredProjects] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(6),
  ]);

  // Get first featured project for case study (or first project as fallback)
  const caseStudyProject = featuredProjects[0] || allProjects[0];

  return (
    <main className="min-h-screen">
      {/* Hero Section with Auto-Rotating Carousel */}
      <Suspense fallback={<HeroSkeleton />}>
        <WorkHero featuredProjects={featuredProjects} />
      </Suspense>

      {/* Portfolio Grid with Filters */}
      <Suspense fallback={<GridSkeleton />}>
        <PortfolioGrid projects={allProjects} />
      </Suspense>

      {/* Featured Case Study Strip */}
      {caseStudyProject && (
        <FeaturedCaseStudy project={caseStudyProject} />
      )}

      {/* Why Our Work Stands Out */}
      <WhyChooseWork />

      {/* Custom Design CTA */}
      <CustomCTA />

      {/* Final CTA */}
      <FinalCTA />
    </main>
  );
}



//✅ FILE 13: src/app/our-work/page.tsx
//🎯 Features: Async server component, parallel data fetching, SEO metadata
//🎨 Suspense boundaries with skeleton loaders for streaming
//📱 Responsive: Full mobile-to-desktop layout