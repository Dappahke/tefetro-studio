// src/components/consultation/ConsultationTeam.tsx
'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin } from 'lucide-react';

const team = [
  {
    name: 'Noel Syambi',
    role: 'Lead Architect',
    title: 'Co-founder & Principal Architect',
    experience: '15+ years experience',
    specialties: ['Residential Design', 'Commercial Architecture', 'Sustainable Design'],
    email: 'noel@tefetrostudios.com',
    phone: '+254 791 939 235',
    image: '/team/noel.jpg',
  },
  {
    name: 'Nicholas Wafula',
    role: 'Construction Lead',
    title: 'Co-founder & Project Manager',
    experience: '12+ years experience',
    specialties: ['Construction Management', 'Structural Engineering', 'Quality Control'],
    email: 'nicholas@tefetrostudios.com',
    phone: '+254 791 939 236',
    image: '/team/nicholas.jpg',
  },
];

export function ConsultationTeam() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#eaf3fb] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
            Meet Your Consultants
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Get expert advice from licensed professionals with decades of combined experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 bg-gradient-to-r from-[#0f2a44] to-[#1a3a5c] flex items-center justify-center">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-white/20">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0f2a44]">{person.name}</h3>
                <p className="text-orange-500 font-semibold text-sm mb-1">{person.role}</p>
                <p className="text-[#475569] text-sm mb-3">{person.title}</p>
                <p className="text-xs text-orange-500 mb-4">{person.experience}</p>
                
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#0f2a44] mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {person.specialties.map(specialty => (
                      <span key={specialty} className="text-xs bg-[#eaf3fb] text-[#0f2a44] px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-2 text-sm text-[#475569] hover:text-orange-500 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {person.email}
                  </a>
                  <a
                    href={`tel:${person.phone}`}
                    className="flex items-center gap-2 text-sm text-[#475569] hover:text-orange-500 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {person.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}