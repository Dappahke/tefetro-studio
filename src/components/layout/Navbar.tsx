// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Grid3X3,
  FolderKanban,
  User,
  Menu,
  X,
  ShoppingBag,
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
      {/* Top Logo Bar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <div className="glass mx-4 mt-4 rounded-2xl px-6 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/tefetro-logo.png"
                alt="Tefetro Studios"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-semibold text-deep tracking-tight">
                Tefetro
              </span>
            </Link>

            {/* Quick CTA */}
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-tefetra transition-colors"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Browse Plans</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Floating Navbar */}
      <nav
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out",
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-24 opacity-0 pointer-events-none"
        )}
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
                  "relative flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 group",
                  active
                    ? "bg-tefetra text-white"
                    : "text-neutral-500 hover:text-tefetra hover:bg-tefetra/10"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "transition-transform duration-300",
                    active ? "scale-110" : "group-hover:scale-110"
                  )}
                />

                <span className="text-[10px] font-medium mt-0.5">
                  {item.name}
                </span>

                {active && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-8 bg-neutral-200 mx-1" />

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center px-4 py-2 rounded-full text-neutral-500 hover:text-tefetra hover:bg-tefetra/10 transition-all duration-300 group"
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium mt-0.5">
              Menu
            </span>
          </button>

        </div>
      </nav>

      {/* Full Screen Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transition-all duration-500",
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-deep/95 backdrop-blur-xl transition-opacity duration-500",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute inset-0 bg-canvas transition-transform duration-500",
            isMenuOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="flex flex-col h-full max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/tefetro-logo.png"
                  alt="Tefetro"
                  width={36}
                  height={36}
                />
                <span className="text-xl font-semibold text-deep">
                  Tefetro
                </span>
              </Link>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-3 rounded-full text-neutral-600 hover:bg-neutral-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-8 px-6">
              <ul className="space-y-2">
                {menuNavItems.map((item, index) => {
                  const active = isActive(item.href);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-4 px-4 text-lg font-medium rounded-xl transition-all",
                          active
                            ? "bg-tefetra text-white"
                            : "text-neutral-700 hover:bg-neutral-100 hover:text-tefetra"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200 space-y-6">

              <div className="flex gap-6 text-sm text-neutral-500">
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
              </div>

              <div className="flex gap-3">
                <Link href="/login" className="btn-ghost flex-1 justify-center">
                  Log In
                </Link>
                <Link href="/login?signup=true" className="btn-primary flex-1">
                  Get Started
                </Link>
              </div>

              <p className="text-xs text-center text-neutral-400">
                © {new Date().getFullYear()} Tefetro Studios
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}