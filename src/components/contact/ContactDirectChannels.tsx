// src/components/contact/ContactDirectChannels.tsx
'use client'

import { motion } from 'framer-motion'

const channels = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email Us',
    value: 'hello@tefetro.studio',
    href: 'mailto:hello@tefetro.studio',
    description: 'For general inquiries',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Call Us',
    value: '+254 791 939 235',
    href: 'tel:+254791939235',
    description: 'Mon-Fri, 8am-6pm EAT',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Visit Us',
    value: 'Nairobi, Kenya',
    href: '#map',
    description: 'By appointment only',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: 'WhatsApp',
    value: 'Chat on WhatsApp',
    href: 'https://wa.me/254791939235',
    description: 'Quick responses',
  },
]

export function ContactDirectChannels() {
  return (
    <section className="py-16 bg-[#eaf3fb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((channel, index) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-6 border border-[#0f2a44]/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#0f2a44] rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-[#e66b00] transition-colors">
                {channel.icon}
              </div>
              <p className="text-xs text-[#475569] uppercase tracking-wider mb-1">{channel.label}</p>
              <p className="font-semibold text-[#0f2a44] group-hover:text-[#e66b00] transition-colors">{channel.value}</p>
              <p className="text-sm text-[#475569] mt-1">{channel.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}