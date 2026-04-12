// src/components/layout/Footer.tsx
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Bungalow Plans", href: "/products?type=bungalow" },
    { name: "Maisonette Plans", href: "/products?type=maisonette" },
    { name: "Development Plans", href: "/products?type=development" },
    { name: "BOQ Services", href: "/services/boq" },
    { name: "Interior Design", href: "/services/interior" },
    { name: "Construction", href: "/services/construction" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "FAQs", href: "/faqs" },
    { name: "How to Buy", href: "/how-to-buy" },
    { name: "File Formats", href: "/file-formats" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/tefetrostudios" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/tefetro-studios" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/tefetrostudios" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#1E1E1E] text-white">
      {/* Main Footer */}
      <div className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F28C00] to-[#0F4C5C] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white tracking-tight leading-none">
                    Tefetro
                  </span>
                  <span className="text-xs text-[#F28C00] tracking-wider uppercase font-medium">
                    Studios
                  </span>
                </div>
              </Link>
              
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Africa's leading PropTech platform for architectural drawings, 
                construction services, and building solutions. Building dreams, 
                one plan at a time.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="mailto:hello@tefetro.studio" 
                  className="flex items-center gap-3 text-gray-400 hover:text-[#F28C00] transition-colors group"
                >
                  <Mail size={18} className="text-[#0F4C5C] group-hover:text-[#F28C00] transition-colors" />
                  <span>hello@tefetro.studio</span>
                </a>
                <a 
                  href="tel:+254700000000" 
                  className="flex items-center gap-3 text-gray-400 hover:text-[#F28C00] transition-colors group"
                >
                  <Phone size={18} className="text-[#0F4C5C] group-hover:text-[#F28C00] transition-colors" />
                  <span>+254 700 000 000</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={18} className="text-[#0F4C5C]" />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 text-gray-400 hover:bg-[#F28C00] hover:text-white transition-all duration-300"
                      aria-label={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                Services
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-[#F28C00] transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-[#F28C00] transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-[#F28C00] transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section py-6">
          <div className="section-inner flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Tefetro Studios. A{" "}
              <span className="text-[#F28C00] font-medium">Tefetro Limited</span> Company. 
              All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-[#F28C00] transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-[#F28C00] transition-colors">
                Privacy
              </Link>
              <Link href="/sitemap" className="hover:text-[#F28C00] transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}