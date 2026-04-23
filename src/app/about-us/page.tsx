import AboutHero from '@/components/about/AboutHero'
import WhoWeAre from '@/components/about/WhoWeAre'
import WhyTefetro from '@/components/about/WhyTefetro'
import ServicesSnapshot from '@/components/about/ServicesSnapshot'
import VisionSection from '@/components/about/VisionSection'
import ValuesSection from '@/components/about/ValuesSection'
import AboutCTA from '@/components/about/AboutCTA'

export const metadata = {
  title: 'About Us | Tefetro Limited',
  description:
    'Learn about Tefetro Limited — modern architecture, house plans, consultancy, and build-ready solutions.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <WhoWeAre />
      <WhyTefetro />
      <ServicesSnapshot />
      <VisionSection />
      <ValuesSection />
      <AboutCTA />
    </main>
  )
}