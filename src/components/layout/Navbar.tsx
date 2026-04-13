// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Navigation items - text only, no Home (logo goes to home)
const navItems = [
  { name: "Plans", href: "/products" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isHome = pathname === "/";

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#F28C00] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Desktop/Tablet: Floating Pill Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center px-4"
        role="banner"
      >
        <nav 
          className={cn(
            "flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300",
            "bg-[#FAF9F6]/90 backdrop-blur-md border border-[#E5E7EB]/50",
            "shadow-lg shadow-[#0F4C5C]/5",
            scrolled && "shadow-xl shadow-[#0F4C5C]/10"
          )}
          aria-label="Main navigation"
        >
          {/* Logo - inside the pill, goes to home */}
          <Link 
            href="/" 
            className="flex items-center gap-2 px-3 py-1 mr-2 border-r border-[#E5E7EB]"
            aria-label="Tefetro Studios - Home"
          >
            <div className="relative w-8 h-8">
              <Image
                src="/images/tefetro-logo.png"
                alt="Tefetro"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Nav Links - Text only, no Home button */}
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                  active
                    ? "bg-[#F28C00] text-white shadow-md"
                    : "text-[#1E1E1E] hover:text-[#F28C00] hover:bg-[#F28C00]/10"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </motion.header>

      {/* Mobile: Compact Pill with Menu Button */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex md:hidden justify-center px-4"
        role="banner"
      >
        <nav 
          className={cn(
            "flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300",
            "bg-[#FAF9F6]/90 backdrop-blur-md border border-[#E5E7EB]/50",
            "shadow-lg shadow-[#0F4C5C]/5"
          )}
        >
          {/* Logo - goes to home */}
          <Link 
            href="/" 
            className="flex items-center gap-2 px-2 py-1"
            aria-label="Tefetro Studios - Home"
          >
            <div className="relative w-8 h-8">
              <Image
                src="/images/tefetro-logo.png"
                alt="Tefetro"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Active Page Indicator (shows current page name, or "Home" if on home) */}
          <div className="px-2 py-2">
            <span className="text-sm font-medium text-[#F28C00]">
              {isHome ? "Home" : navItems.find(item => isActive(item.href))?.name || "Menu"}
            </span>
          </div>

          {/* Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              mobileMenuOpen 
                ? "bg-[#F28C00] text-white" 
                : "text-[#1E1E1E] hover:bg-[#F28C00]/10"
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-4 right-4 bg-[#FAF9F6]/95 backdrop-blur-md rounded-2xl border border-[#E5E7EB]/50 shadow-xl p-2"
            >
              {/* Home link in mobile menu (since logo is the primary home button) */}
              <Link
                href="/"
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  isHome
                    ? "bg-[#F28C00] text-white"
                    : "text-[#1E1E1E] hover:bg-[#F28C00]/10 hover:text-[#F28C00]"
                )}
                aria-current={isHome ? "page" : undefined}
              >
                Home
              </Link>

              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                      active
                        ? "bg-[#F28C00] text-white"
                        : "text-[#1E1E1E] hover:bg-[#F28C00]/10 hover:text-[#F28C00]"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-28" aria-hidden="true" />
    </>
  );
}