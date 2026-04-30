// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail, Phone, MapPin, Instagram, Linkedin, Twitter, ArrowUpRight,
  TrendingUp, Shield, Zap, Clock, Download, CreditCard
} from "lucide-react";

const footerLinks = {
  products: [
    { name: "Bungalow Plans", href: "/products?type=bungalow", price: "KES 10k–45k" },
    { name: "Maisonette Plans", href: "/products?type=maisonette", price: "KES 30k–150k" },
    { name: "Development Plans", href: "/products?type=development", price: "Custom Quote" },
    { name: "Commercial Designs", href: "/products?type=commercial", price: "Inquiry Based" },
  ],
  addons: [
    { name: "Bill of Quantities", href: "/addons/boq" },
    { name: "Interior Design", href: "/addons/interior" },
    { name: "Landscape Drawings", href: "/addons/landscape" },
    { name: "Site Supervision", href: "/services/supervision" },
    { name: "Turnkey Contracting", href: "/services/contracting" },
  ],
  company: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Our Portfolio", href: "/our-work" },
    { name: "About Tefetro", href: "/about-us" },
    { name: "Journal", href: "/blog" },
  ],
  support: [
    { name: "FAQs", href: "/faqs" },
    { name: "File Formats", href: "/file-formats" },
    { name: "Delivery Policy", href: "/delivery" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/tefetrostudios" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/tefetro-studios" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/tefetrostudios" },
];

const trustBadges = [
  { icon: TrendingUp, label: "500+ Plans Sold" },
  { icon: Shield, label: "Secure Payments" },
  { icon: Zap, label: "Instant Delivery" },
  { icon: Clock, label: "24hr Support" },
];

export function Footer() {
  return (
    <footer className="relative bg-blueprint-900 text-white overflow-hidden">
      
      {/* ─── Gradient Shapes Background ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large blurred orb — top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blueprint-600/30 blur-[120px]" />
        
        {/* Medium orb — bottom left */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-deep-600/25 blur-[100px]" />
        
        {/* Accent orb — center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blueprint-500/10 blur-[150px]" />
        
        {/* Small accent dot — top left */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-accent-500/10 blur-[60px]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* ─── Top Gradient Line ─── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blueprint-400/40 to-transparent" />

      {/* ─── Main Footer ─── */}
      <div className="relative z-10">
        
        {/* Trust Bar */}
        <div className="border-b border-white/5">
          <div className="section-inner py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon size={18} className="text-blueprint-300" />
                    </div>
                    <span className="text-sm text-white/70 font-medium">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="section py-16 lg:py-20">
          <div className="section-inner">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Brand Column */}
              <div className="lg:col-span-4 space-y-8">
                <Link href="/" className="inline-flex items-center gap-4 group">
                  <div className="relative w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/tefetro-logo.png"
                      alt="Tefetro Studios"
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white tracking-tight leading-none">
                      Tefetro
                    </span>
                    <span className="text-[10px] tracking-[0.25em] text-accent-400 uppercase font-semibold mt-1">
                      Studios
                    </span>
                  </div>
                </Link>
                
                <p className="text-blueprint-200/60 leading-relaxed text-sm max-w-sm">
                  Africa's leading PropTech platform for architectural drawings, 
                  construction services, and building solutions. From KES 10k plans 
                  to turnkey contracts.
                </p>
                
                {/* Contact */}
                <div className="space-y-3">
                  <a 
                    href="mailto:hello@tefetro.studio" 
                    className="flex items-center gap-3 text-blueprint-200/50 hover:text-white transition-colors group text-sm"
                  >
                    <Mail size={16} className="text-blueprint-400 group-hover:text-accent-400 transition-colors" />
                    <span>hello@tefetro.studio</span>
                  </a>
                  <a 
                    href="tel:+254791939235" 
                    className="flex items-center gap-3 text-blueprint-200/50 hover:text-white transition-colors group text-sm"
                  >
                    <Phone size={16} className="text-blueprint-400 group-hover:text-accent-400 transition-colors" />
                    <span>+254 791 939 235</span>
                  </a>
                  <div className="flex items-start gap-3 text-blueprint-200/50 text-sm">
                    <MapPin size={16} className="text-blueprint-400 mt-0.5" />
                    <span>Nairobi, Kenya</span>
                  </div>
                </div>

                {/* Social */}
                <div className="flex items-center gap-3 pt-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blueprint-300 hover:bg-accent-500/20 hover:text-accent-400 hover:border-accent-500/30 transition-all duration-300"
                        aria-label={social.name}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Products */}
              <div className="lg:col-span-3">
                <h3 className="text-caption uppercase tracking-wider text-blueprint-300 font-semibold mb-6">
                  Architectural Plans
                </h3>
                <ul className="space-y-3">
                  {footerLinks.products.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center justify-between text-blueprint-200/50 hover:text-white transition-all duration-300 text-sm py-2 border-b border-white/5"
                      >
                        <span className="flex flex-col">
                          <span>{link.name}</span>
                          <span className="text-xs text-blueprint-400/50 mt-0.5">{link.price}</span>
                        </span>
                        <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add-ons */}
              <div className="lg:col-span-3">
                <h3 className="text-caption uppercase tracking-wider text-blueprint-300 font-semibold mb-6">
                  Services & Add-ons
                </h3>
                <ul className="space-y-3">
                  {footerLinks.addons.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-blueprint-200/50 hover:text-white transition-colors text-sm py-1 block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Card */}
                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-blueprint-800/50 to-deep-800/50 border border-white/10">
                  <p className="text-xs text-blueprint-300 mb-2">Need something custom?</p>
                  <Link 
                    href="/contact" 
                    className="text-sm font-semibold text-white hover:text-accent-400 transition-colors"
                  >
                    Request a Design →
                  </Link>
                </div>
              </div>

              {/* Company & Support */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h3 className="text-caption uppercase tracking-wider text-blueprint-300 font-semibold mb-6">
                    Platform
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-blueprint-200/50 hover:text-white transition-colors text-sm"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-caption uppercase tracking-wider text-blueprint-300 font-semibold mb-6">
                    Support
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-blueprint-200/50 hover:text-white transition-colors text-sm"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="border-t border-white/5">
          <div className="section-inner py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-caption text-blueprint-200/30 text-center md:text-left">
                © {new Date().getFullYear()} Tefetro Studios. All rights reserved.
              </p>
              
              <div className="flex items-center gap-6 text-caption text-blueprint-200/30">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/delivery" className="hover:text-white transition-colors">Delivery</Link>
              </div>

              <div className="flex items-center gap-4 text-caption text-blueprint-200/30">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={12} /> Cards
                </span>
                <span className="flex items-center gap-1.5">
                  <Download size={12} /> M-Pesa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Gradient Line ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent" />
    </footer>
  );
}