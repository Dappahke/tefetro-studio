// src/app/contact/page.tsx
import { Metadata } from 'next'
import { ContactHero } from '@/components/contact/ContactHero'
import { ContactPathSelector } from '@/components/contact/ContactPathSelector'
import { ContactFormSection } from '@/components/contact/ContactFormSection'
import { ContactDirectChannels } from '@/components/contact/ContactDirectChannels'
import { ContactFAQ } from '@/components/contact/ContactFAQ'
import { ContactMap } from '@/components/contact/ContactMap'
import { ContactTeam } from '@/components/contact/ContactTeam'

export const metadata: Metadata = {
  title: 'Contact Tefetro Studios | Let\'s Build Something Extraordinary',
  description: 'Get in touch with Kenya\'s premier digital architecture platform. Whether you need custom house plans, construction services, or have a question — we\'re here to help.',
  openGraph: {
    title: 'Contact Tefetro Studios',
    description: 'Let\'s discuss your next architectural project.',
    type: 'website',
    url: 'https://tefetro.studio/contact',
  },
  alternates: { canonical: 'https://tefetro.studio/contact' },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <ContactHero />
      <ContactPathSelector />
      <ContactFormSection />
      <ContactDirectChannels />
      <ContactFAQ />
      <ContactMap />
      <ContactTeam />
    </main>
  )
}