// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Grid3X3,
  FolderKanban,
  User,
  Menu,
  X,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Plans", href: "/products", icon: Grid3X3 },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Account", href: "/login", icon: User },
];

const menuNavItems = [
  { name: "Home", href: "/" },
  { name: "Browse Plans", href: "/products" },
  { name: "Our Projects", href: "/projects" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "FAQs", href: "/faqs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.4;

      setIsVisible(scrollY > heroThreshold);
      setScrolled(scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Logo Bar - Appears on scroll */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: scrolled ? 0 : -100,
          opacity: scrolled ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="mx-4 mt-4">
          <div className="glass rounded-2xl px-6 py-3 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#F28C00] to-[#0F4C5C] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E1E1E] tracking-tight leading-none">
                    Tefetro
                  </span>
                  <span className="text-[10px] text-[#6B7280] tracking-wider uppercase">
                    Studios
                  </span>
                </div>
              </Link>

              {/* Quick CTA */}
              <Link
                href="/products"
                className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#F28C00] transition-colors"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline">Browse Plans</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 🔥 SIGNATURE: Bottom Floating Pill Navbar */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="glass rounded-full px-2 py-2 shadow-glass-lg flex items-center gap-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center px-5 py-2.5 rounded-full transition-all duration-300 group",
                  active
                    ? "bg-[#F28C00] text-white shadow-lg"
                    : "text-[#6B7280] hover:text-[#F28C00] hover:bg-[#F28C00]/10"
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 2}
                  className={cn(
                    "transition-transform duration-300",
                    active ? "scale-110" : "group-hover:scale-110"
                  )}
                />
                <span className="text-[10px] font-semibold mt-0.5">
                  {item.name}
                </span>

                {/* Active indicator dot */}
                {active && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-8 bg-[#E5E7EB] mx-1" />

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center px-5 py-2.5 rounded-full text-[#6B7280] hover:text-[#F28C00] hover:bg-[#F28C00]/10 transition-all duration-300 group"
          >
            <Menu size={20} />
            <span className="text-[10px] font-semibold mt-0.5">Menu</span>
          </button>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-[#0F4C5C]/95 backdrop-blur-xl"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-[70] bg-[#FAF9F6] flex flex-col"
            >
              <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F28C00] to-[#0F4C5C] rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <span className="text-xl font-bold text-[#1E1E1E]">
                      Tefetro
                    </span>
                  </Link>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-3 rounded-full text-[#6B7280] hover:bg-[#F28C00]/10 hover:text-[#F28C00] transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-8 px-6">
                  <ul className="space-y-2">
                    {menuNavItems.map((item, index) => {
                      const active = isActive(item.href);

                      return (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between py-4 px-5 text-lg font-semibold rounded-xl transition-all",
                              active
                                ? "bg-[#F28C00] text-white shadow-lg"
                                : "text-[#1E1E1E] hover:bg-[#F28C00]/10 hover:text-[#F28C00]"
                            )}
                          >
                            {item.name}
                            <ChevronRight
                              size={20}
                              className={cn(
                                "transition-transform",
                                active ? "rotate-90" : ""
                              )}
                            />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-[#E5E7EB] space-y-6 bg-white/50">
                  <div className="flex gap-6 text-sm text-[#6B7280]">
                    <Link href="/terms" className="hover:text-[#F28C00]">
                      Terms
                    </Link>
                    <Link href="/privacy" className="hover:text-[#F28C00]">
                      Privacy
                    </Link>
                    <Link href="/sitemap" className="hover:text-[#F28C00]">
                      Sitemap
                    </Link>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      className="btn-ghost flex-1 justify-center py-3"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/login?signup=true"
                      className="btn-primary flex-1 py-3"
                    >
                      Get Started
                    </Link>
                  </div>

                  <p className="text-xs text-center text-[#6B7280]">
                    © {new Date().getFullYear()} Tefetro Studios. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}