// src/components/consultation/ConsultationForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const projectTypes = [
  { value: 'residential', label: 'Residential House' },
  { value: 'commercial', label: 'Commercial Building' },
  { value: 'mixed-use', label: 'Mixed-Use Development' },
  { value: 'renovation', label: 'Renovation/Remodel' },
  { value: 'interior', label: 'Interior Design' },
  { value: 'landscape', label: 'Landscape Design' },
];

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

export function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    location: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <section id="consultation-form" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-8 bg-gradient-to-br from-[#0f2a44] to-[#1a3a5c] rounded-3xl text-white"
          >
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Consultation Booked! 🎉</h2>
            <p className="text-white/80 text-lg max-w-md mx-auto mb-6">
              Thank you, {formData.name.split(' ')[0]}! We've received your request and will confirm your slot within 2 hours.
            </p>
            <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm mb-2">📅 Preferred Date: <strong>{formData.preferredDate || 'To be confirmed'}</strong></p>
              <p className="text-sm">⏰ Preferred Time: <strong>{formData.preferredTime || 'To be confirmed'}</strong></p>
            </div>
            <p className="text-white/60 text-sm">
              Reference: TEF-CONSULT-{Date.now().toString(36).toUpperCase()}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="consultation-form" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
            Book Your Free Consultation
          </h2>
          <p className="text-lg text-[#475569]">
            Fill out the form below and we'll get back to you within 2 hours
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                <User className="w-4 h-4 text-orange-500" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="John Kamau"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                <Mail className="w-4 h-4 text-orange-500" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                <Phone className="w-4 h-4 text-orange-500" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="+254 712 345 678"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                <MapPin className="w-4 h-4 text-orange-500" />
                Project Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Nairobi, Kenya"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                Project Type *
              </label>
              <select
                name="projectType"
                required
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">Select project type</option>
                {projectTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                <Calendar className="w-4 h-4 text-orange-500" />
                Preferred Date
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
              <Clock className="w-4 h-4 text-orange-500" />
              Preferred Time
            </label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">Select preferred time slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
              <MessageCircle className="w-4 h-4 text-orange-500" />
              Project Details *
            </label>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="Describe your vision, budget range, timeline, and any specific requirements..."
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              required
              id="consent"
              className="mt-1 w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
            />
            <label htmlFor="consent" className="text-sm text-[#475569]">
              I agree to the processing of my personal data for consultation purposes.
              <a href="/privacy" className="text-orange-500 hover:underline ml-1">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Booking...
              </>
            ) : (
              'Book Free Consultation'
            )}
          </button>

          <p className="text-center text-xs text-[#475569]">
            By booking, you agree to our consultation terms. We respect your privacy and will never share your information.
          </p>
        </form>
      </div>
    </section>
  );
}