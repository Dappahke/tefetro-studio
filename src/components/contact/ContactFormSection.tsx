// src/components/contact/ContactFormSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const inquiryTypes = [
  { value: '', label: 'What brings you here?' },
  { value: 'custom-plan', label: 'I need a custom house plan' },
  { value: 'ready-plan', label: 'I want to buy a ready-made plan' },
  { value: 'construction', label: 'Construction / Turnkey project' },
  { value: 'supervision', label: 'Site supervision only' },
  { value: 'consultation', label: 'Free consultation' },
  { value: 'partnership', label: 'Partnership / Collaboration' },
  { value: 'other', label: 'Something else' },
];

const budgetRanges = [
  { value: '', label: 'Estimated budget range' },
  { value: 'under-1m', label: 'Under KES 1 Million' },
  { value: '1m-5m', label: 'KES 1M - 5M' },
  { value: '5m-15m', label: 'KES 5M - 15M' },
  { value: '15m-50m', label: 'KES 15M - 50M' },
  { value: '50m-plus', label: 'KES 50M+' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    budget: '',
    location: '',
    message: '',
  });

  // Listen for path selection from ContactPathSelector
  useEffect(() => {
    const handlePathSelect = (e: CustomEvent) => {
      setSelectedPath(e.detail.path);
      // Map path to inquiry type
      const pathToInquiry: Record<string, string> = {
        plans: 'custom-plan',
        construction: 'construction',
        consultation: 'consultation',
        partnership: 'partnership',
      };
      if (pathToInquiry[e.detail.path]) {
        setFormData(prev => ({ ...prev, inquiryType: pathToInquiry[e.detail.path] }));
      }
    };

    window.addEventListener('pathSelect', handlePathSelect as EventListener);
    return () => window.removeEventListener('pathSelect', handlePathSelect as EventListener);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        budget: '',
        location: '',
        message: '',
      });
      
      // Track conversion (optional - for analytics)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'YOUR_CONVERSION_ID',
        });
      }
    } catch (err) {
      setError('Failed to send message. Please try again or contact us directly.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto" id="contact-form">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-8 bg-gradient-to-br from-[#0f2a44] to-[#1a3a5c] rounded-3xl text-white"
        >
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#e66b00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-bold text-3xl mb-4">Message Received! 🎉</h2>
          <p className="text-white/70 text-lg max-w-md mx-auto mb-8">
            Thanks for reaching out, {formData.name.split(' ')[0]}. Our team will review your inquiry and get back to you within 2 hours.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/50">
            <span>Reference: TEF-{Date.now().toString(36).toUpperCase()}</span>
          </div>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-8 text-white/60 hover:text-white text-sm underline"
          >
            Send another message
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" id="contact-form">
      <div className="text-center mb-12">
        <h2 className="font-bold text-4xl text-[#0f2a44] mb-4">Start Your Project</h2>
        <p className="text-[#475569] text-lg">Fill out the form below and we&apos;ll get back to you promptly</p>
        {selectedPath && (
          <div className="mt-4 inline-flex items-center gap-2 bg-[#eaf3fb] px-4 py-2 rounded-full text-sm">
            <span className="text-[#e66b00]">✓</span>
            <span>We noticed you&apos;re interested in {selectedPath}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[#0f172a]">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all"
              placeholder="John Kamau"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#0f172a]">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-[#0f172a]">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all"
              placeholder="+254 712 345 678"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-[#0f172a]">
              Project Location
            </label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all"
              placeholder="Nairobi, Kenya"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="inquiryType" className="text-sm font-medium text-[#0f172a]">
              Inquiry Type *
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              required
              value={formData.inquiryType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all appearance-none cursor-pointer"
            >
              {inquiryTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium text-[#0f172a]">
              Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all appearance-none cursor-pointer"
            >
              {budgetRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-[#0f172a]">
            Tell us about your project *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#eaf3fb] border border-[#0f2a44]/10 rounded-xl focus:outline-none focus:border-[#e66b00] focus:ring-2 focus:ring-[#e66b00]/20 transition-all resize-none"
            placeholder="Describe your vision, timeline, and any specific requirements..."
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            id="privacy"
            className="mt-1 w-5 h-5 text-[#e66b00] rounded border-[#0f2a44]/20 focus:ring-[#e66b00] focus:ring-2"
          />
          <label htmlFor="privacy" className="text-sm text-[#475569]">
            I agree to Tefetro Studios processing my personal data for the purpose of responding to my inquiry.
            <a href="/privacy" className="text-[#e66b00] hover:underline ml-1">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-[#0f2a44] to-[#1a3a5c] text-white font-bold text-lg rounded-xl hover:from-[#e66b00] hover:to-[#ff7f00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>

        <p className="text-center text-xs text-[#475569]">
          We respect your privacy. Your information is secure and will never be shared.
        </p>
      </form>
    </section>
  );
}