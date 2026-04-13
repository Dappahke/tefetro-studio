// app/page.tsx
import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturedPlans from "@/components/sections/FeaturedPlans";
import ServicesSection from "@/components/sections/ServicesSection";
import TargetUsers from "@/components/sections/TargetUsers";
import ValueProposition from "@/components/sections/ValueProposition";
import FinalCTA from "@/components/sections/FinalCTA";

// JSON-LD Structured Data for SEO - Updated for tefetro.studio
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://tefetro.studio/#organization",
      name: "Tefetro Limited",
      url: "https://tefetro.studio",
      logo: {
        "@type": "ImageObject",
        url: "https://tefetro.studio/logo.png",
      },
      description: "Kenya's leading PropTech platform for architectural plans and construction services.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "KE",
        addressRegion: "Nairobi",
      },
      sameAs: [
        "https://facebook.com/tefetro",
        "https://instagram.com/tefetro",
        "https://linkedin.com/company/tefetro",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://tefetro.studio/#website",
      url: "https://tefetro.studio",
      name: "Tefetro",
      publisher: {
        "@id": "https://tefetro.studio/#organization",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://tefetro.studio/#webpage",
      url: "https://tefetro.studio",
      name: "Buy Ready-Made House Plans in Kenya | Tefetro",
      isPartOf: {
        "@id": "https://tefetro.studio/#website",
      },
      about: {
        "@id": "https://tefetro.studio/#organization",
      },
      description: "Purchase complete architectural drawings instantly. Get BOQ cost estimates, interior design, and landscaping. Licensed Kenyan architects.",
    },
    {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Architectural Drawings",
          description: "Complete blueprints ready for construction",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "BOQ & Cost Estimates",
          description: "Detailed Bill of Quantities",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Interior Design",
          description: "Space planning and 3D visualizations",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Landscaping Design",
          description: "Garden layouts and outdoor spaces",
        },
      ],
    },
    {
      "@type": "Service",
      serviceType: "Architectural Design",
      provider: {
        "@id": "https://tefetro.studio/#organization",
      },
      areaServed: {
        "@type": "Country",
        name: "Kenya",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "House Plans",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Architectural Drawings",
              description: "Complete construction blueprints",
            },
            price: "8500",
            priceCurrency: "KES",
            availability: "https://schema.org/InStock",
          },
        ],
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-[#FAF9F6]">
        <HeroSection />
        <HowItWorks />
        <FeaturedPlans />
        <ServicesSection />
        <TargetUsers />
        <ValueProposition />
        <FinalCTA />
      </main>
    </>
  );
}