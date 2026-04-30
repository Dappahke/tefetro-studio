// src/components/TefetroWidget.tsx
'use client'

import React, { useState } from 'react'
import { MessageCircle, X, ArrowUpRight } from 'lucide-react'

export default function TefetroWidget() {
  const [open, setOpen] = useState(false)

  const items = [
    {
      title: 'House Design',
      subtitle: 'Get architectural plans',
      msg: 'Hi Tefetro Studio, I need house design services.',
    },
    {
      title: 'Construction Quote',
      subtitle: 'Estimate your build cost',
      msg: 'Hi Tefetro Studio, I need a construction quote.',
    },
    {
      title: 'Branding / Website',
      subtitle: 'Digital presence & identity',
      msg: 'Hi Tefetro Studio, I need branding or website services.',
    },
    {
      title: 'Talk to Expert',
      subtitle: 'Speak with an architect',
      msg: 'Hi Tefetro Studio, I want to speak with an expert.',
    },
  ]

  const go = (msg: string) => {
    window.open(
      `https://wa.me/254711706059?text=${encodeURIComponent(msg)}`,
      '_blank'
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* === AURA GLOW BEHIND BUBBLE === */}
      <div 
        className="absolute -inset-4 rounded-full opacity-40 blur-2xl transition-opacity duration-500"
        style={{ 
          background: "radial-gradient(circle, #F28C00 0%, #0F4C5C 50%, transparent 70%)",
          opacity: open ? 0.6 : 0.3
        }}
        aria-hidden="true"
      />

      {/* Chat Panel */}
      {open && (
        <div className="relative w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl p-5 shadow-2xl shadow-[#1E1E1E]/10 mb-4 overflow-hidden">
          
          {/* Subtle aura inside panel */}
          <div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #F28C00 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div 
            className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-15 blur-2xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #0F4C5C 0%, transparent 70%)" }}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="relative mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar with glow */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F28C00] to-[#0F4C5C] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  TS
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1E1E]">
                  Tefetro Assistant
                </h3>
                <p className="text-xs text-[#0F4C5C] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Online now
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-[#555] hover:bg-[#FAF9F6] hover:text-[#1E1E1E] transition-all"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Divider with gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#1F4E79]/20 to-transparent mb-4" />

          {/* Options */}
          <div className="relative space-y-2.5">
            {items.map((item, i) => (
              <button
                key={item.title}
                onClick={() => go(item.msg)}
                className="group w-full rounded-xl border border-[#e8e8e8] bg-[#FAF9F6]/80 p-3.5 text-left transition-all duration-300 hover:border-[#1F4E79]/30 hover:bg-white hover:shadow-md hover:shadow-[#1F4E79]/5 hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1E1E] group-hover:text-[#1F4E79] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#777] mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#ccc] group-hover:text-[#F28C00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/254791939235?text=Hi%20Tefetro%20Studio%2C%20I%20need%20help%20with%20your%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-4 block rounded-xl bg-gradient-to-r from-[#1F4E79] to-[#0F4C5C] p-3.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#0F4C5C]/25 hover:-translate-y-0.5 overflow-hidden group"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              Open WhatsApp
            </span>
          </a>

          {/* Footer */}
          <p className="text-center text-[10px] text-[#aaa] mt-3 tracking-wide uppercase">
            Powered by Tefetro Studio
          </p>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl shadow-[#F28C00]/30 transition-all duration-300 hover:scale-110 hover:shadow-[#F28C00]/50 focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:ring-offset-2"
        style={{
          background: "linear-gradient(135deg, #F28C00 0%, #e07d00 50%, #0F4C5C 100%)"
        }}
        aria-label="Open Tefetro Assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#F28C00" }} />
        )}
      </button>
    </div>
  )
}