// src/app/contact/page.tsx
import type { Metadata } from 'next';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactPathSelector } from '@/components/contact/ContactPathSelector';
import { ContactFormSection } from '@/components/contact/ContactFormSection';
import { ContactDirectChannels } from '@/components/contact/ContactDirectChannels';
import { ContactFAQ } from '@/components/contact/ContactFAQ';
import { ContactMap } from '@/components/contact/ContactMap';
import { ContactTeam } from '@/components/contact/ContactTeam';

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: 'Contact Tefetro Studios | Kenya\'s Premier Architectural Design Experts',
  description: 'Get in touch with Tefetro Studios for custom house plans, construction services, and architectural consultations. Our team responds within 2 hours. Free initial consultation available.',
  keywords: 'contact Tefetro Studios, architectural services Kenya, house plans Nairobi, construction consultation, building design Kenya, custom home plans, Tefetro contact',
  authors: [{ name: 'Tefetro Studios' }],
  openGraph: {
    title: 'Contact Tefetro Studios | Let\'s Build Something Extraordinary',
    description: 'Whether you need custom house plans, construction services, or have a question — we\'re here to help. Response within 2 hours.',
    type: 'website',
    url: 'https://tefetro.studio/contact',
    siteName: 'Tefetro Studios',
    locale: 'en_KE',
    images: [
      {
        url: '/contact-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tefetro Studios Contact Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Tefetro Studios | Architectural Experts',
    description: 'Get expert architectural consultation for your dream project. Response within 2 hours.',
    images: ['/contact-twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://tefetro.studio/contact',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console code
  },
};

// JSON-LD Schema for better search visibility
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tefetro Studios',
  url: 'https://tefetro.studio',
  logo: 'https://tefetro.studio/tefetro-logo.png',
  email: 'hello@tefetro.studio',
  telephone: '+254791939235',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+254791939235',
      contactType: 'customer service',
      availableLanguage: ['English', 'Swahili'],
      contactOption: 'TollFree',
      areaServed: 'KE',
    },
    {
      '@type': 'ContactPoint',
      email: 'hello@tefetro.studio',
      contactType: 'sales',
      availableLanguage: ['English'],
    },
  ],
  sameAs: [
    'https://www.facebook.com/tefetrostudios',
    'https://www.instagram.com/tefetrostudios',
    'https://www.linkedin.com/company/tefetrostudios',
    'https://twitter.com/tefetrostudios',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Tefetro Studios',
  description: 'Contact page for architectural and construction services',
  url: 'https://tefetro.studio/contact',
  mainEntity: organizationSchema,
};

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <main className="min-h-screen bg-white overflow-hidden">
        {/* Skip to content link for accessibility */}
        <a
          href="#contact-form"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#e66b00] text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to contact form
        </a>

        <ContactHero />
        <ContactPathSelector />
        <ContactFormSection />
        <ContactDirectChannels />
        <ContactFAQ />
        <ContactMap />
        <ContactTeam />

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/254791939235"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
          aria-label="Chat on WhatsApp"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with us
          </span>
        </a>
      </main>
    </>
  );
}