// src/components/contact/ContactTeam.tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const team = [
  {
    name: 'Noel Syambi',
    role: 'Co-founder & Lead Architect',
    image: '/team/noel.jpg', // Replace with actual path or use placeholder
    email: 'noel@tefetro.studio',
  },
  {
    name: 'Nicholas Wafula',
    role: 'Co-founder & Construction Lead',
    image: '/team/nicholas.jpg',
    email: 'nicholas@tefetro.studio',
  },
]

export function ContactTeam() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-bold text-3xl text-[#0f2a44] mb-4">Meet Your Contacts</h2>
        <p className="text-[#475569]">Real people, real expertise, ready to help</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {team.map((person, index) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-2xl p-6 border border-[#0f2a44]/5 shadow-lg hover:shadow-xl transition-all text-center group"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#0f2a44] to-[#1a3a5c] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:from-[#e66b00] group-hover:to-[#ff7f00] transition-all">
              {person.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="font-bold text-lg text-[#0f2a44]">{person.name}</h3>
            <p className="text-[#e66b00] text-sm font-medium mb-2">{person.role}</p>
            <a
              href={`mailto:${person.email}`}
              className="text-sm text-[#475569] hover:text-[#e66b00] transition-colors"
            >
              {person.email}
            </a>
          </motion.div>
        ))}
      </div>

      {/* Social proof */}
      <div className="mt-16 text-center">
        <p className="text-[#475569] text-sm mb-4">Trusted by homeowners, developers, and architects across Kenya</p>
        <div className="flex items-center justify-center gap-8 opacity-40">
          {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map((city) => (
            <span key={city} className="text-[#0f2a44] font-semibold text-sm">{city}</span>
          ))}
        </div>
      </div>
    </section>
  )
}