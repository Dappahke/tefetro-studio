// src/components/blog/NewsletterCTA.tsx
'use client'

import { useState } from 'react'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Integrate with your newsletter API (ConvertKit, Mailchimp, etc.)
    setStatus('success')
    setEmail('')
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
      <div className="bg-gradient-to-r from-[#0f2a44] to-[#1a3a5c] rounded-3xl p-8 lg:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e66b00]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e66b00]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h3 className="font-display font-bold text-3xl lg:text-4xl mb-4">
            Stay Ahead of the Curve
          </h3>
          <p className="text-white/70 mb-8 leading-relaxed">
            Join 2,000+ architects, developers, and homeowners receiving weekly insights on Kenyan construction trends, design innovations, and investment opportunities.
          </p>
          
          {status === 'success' ? (
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <p className="text-lg font-medium">Welcome aboard! Check your inbox for confirmation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#e66b00] transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#e66b00] text-white font-semibold rounded-xl hover:bg-[#ff7f00] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          
          <p className="mt-4 text-xs text-white/40">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}