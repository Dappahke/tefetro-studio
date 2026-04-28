// src/components/consultation/ConsultationCTA.tsx
'use client';

import { Calendar, Phone, Mail } from 'lucide-react';

export function ConsultationCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Book your free consultation today and take the first step toward your dream project
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="#consultation-form"
            className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 group"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Free Consultation</span>
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-white/20"
          >
            <Mail className="w-5 h-5" />
            <span>Contact Sales</span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 text-white/80 text-sm">
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+254 791 939 235</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            <span>consult@tefetrostudios.com</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>📅 Mon-Fri, 8am-6pm EAT</span>
          </div>
        </div>
      </div>
    </section>
  );
}