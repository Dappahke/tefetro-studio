// src/components/layout/Footer.tsx
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";

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
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/tefetrastudios" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/tefetra-studios" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/tefetrastudios" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-cream-100 border-t border-cream-200">
      {/* Main Footer */}
      <div className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold text-teal-500">
                  Tefetra<span className="text-sage-400">Studios</span>
                </span>
              </Link>
              
              <p className="text-charcoal-400 leading-relaxed max-w-sm">
                Africa's leading PropTech platform for architectural drawings, 
                construction services, and building solutions. Building dreams, 
                one plan at a time.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="mailto:hello@tefetra.studio" 
                  className="flex items-center gap-3 text-charcoal-500 hover:text-teal-500 transition-colors"
                >
                  <Mail size={18} className="text-sage-400" />
                  <span>hello@tefetra.studio</span>
                </a>
                <a 
                  href="tel:+254700000000" 
                  className="flex items-center gap-3 text-charcoal-500 hover:text-teal-500 transition-colors"
                >
                  <Phone size={18} className="text-sage-400" />
                  <span>+254 700 000 000</span>
                </a>
                <div className="flex items-center gap-3 text-charcoal-400">
                  <MapPin size={18} className="text-sage-400" />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-4 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-cream-200 text-charcoal-400 hover:bg-teal-500 hover:text-cream-50 transition-all duration-300"
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
              <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-4">
                Services
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-charcoal-400 hover:text-teal-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-charcoal-400 hover:text-teal-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-charcoal-400 hover:text-teal-500 transition-colors"
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

      {/* Bottom Bar */}
      <div className="border-t border-cream-200">
        <div className="section py-6">
          <div className="section-inner flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-charcoal-400 text-center md:text-left">
              © {new Date().getFullYear()} Tefetra Studios. A{" "}
              <span className="text-teal-500 font-medium">Tefetra Limited</span> Company. 
              All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-charcoal-400">
              <Link href="/terms" className="hover:text-teal-500 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-teal-500 transition-colors">
                Privacy
              </Link>
              <Link href="/sitemap" className="hover:text-teal-500 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}