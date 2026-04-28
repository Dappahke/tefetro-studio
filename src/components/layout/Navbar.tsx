// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { AuthChangeEvent, Session, User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { name: "Plans", href: "/products" },
  { name: "Our Work", href: "/our-work" },
  { name: "About Us", href: "/about-us" },
  { name: "Journal", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

interface Profile {
  role: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setUserRole((profile as Profile)?.role || "client");
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setUser(session.user);
          supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }: { data: Profile | null }) => {
              setUserRole(profile?.role || "client");
            });
        } else {
          setUser(null);
          setUserRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isHome = pathname === "/";

  const getUserHref = () => {
    if (!user) return "/login";
    if (userRole === "admin") return "/admin";
    return "/dashboard";
  };

  const getUserLabel = () => {
    if (!user) return "Sign In";
    if (userRole === "admin") return "Admin";
    return "Dashboard";
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-blueprint-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blueprint-400"
      >
        Skip to main content
      </a>

      {/* ─── Desktop Navigation ─── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none"
        role="banner"
      >
        <nav
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 pointer-events-auto",
            "bg-white/80 backdrop-blur-md",
            "border shadow-lg",
            scrolled 
              ? "border-white/40 shadow-blueprint-900/20 bg-white/90" 
              : "border-white/50 shadow-blueprint-900/10 bg-white/75"
          )}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-1 mr-2 border-r border-blueprint-200/50 transition-opacity hover:opacity-80"
            aria-label="Tefetro Studios - Home"
          >
            <div className="relative w-9 h-9">
              <Image
                src="/images/tefetro-logo.png"
                alt="Tefetro Studios"
                fill
                sizes="(max-width: 768px) 120px, 160px"
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-blueprint-800 font-bold text-sm leading-none tracking-tight">Tefetro</span>
              <span className="text-accent-600 text-[10px] tracking-wider uppercase font-semibold">Studios</span>
            </div>
          </Link>

          {/* Nav Links */}
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  active
                    ? "bg-blueprint-600 text-white shadow-md"
                    : "text-blueprint-700 hover:text-blueprint-900 hover:bg-blueprint-50"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-6 bg-blueprint-200/50 mx-1" />

          {/* User Button */}
          <Link
            href={getUserHref()}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
              pathname === getUserHref()
                ? "bg-blueprint-600 text-white shadow-md"
                : "text-blueprint-700 hover:text-blueprint-900 hover:bg-blueprint-50"
            )}
            aria-label={getUserLabel()}
            title={getUserLabel()}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-500 to-deep-600 flex items-center justify-center shadow-sm">
              <UserIcon size={14} className="text-white" strokeWidth={2} />
            </div>
            {!loading && user && (
              <span className="max-w-[100px] truncate text-blueprint-800">
                {user.user_metadata?.name || user.email?.split("@")[0] || "Account"}
              </span>
            )}
            {!loading && !user && (
              <span className="hidden lg:inline">Sign In</span>
            )}
          </Link>
        </nav>
      </motion.header>

      {/* ─── Mobile Navigation ─── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex md:hidden justify-center px-4 pointer-events-none"
        role="banner"
      >
        <nav
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 pointer-events-auto",
            "bg-white/85 backdrop-blur-md border border-white/50 shadow-lg shadow-blueprint-900/10"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1 transition-opacity hover:opacity-80"
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

          {/* Active Page Indicator */}
          <div className="px-2 py-2">
            <span className="text-sm font-medium text-blueprint-700">
              {isHome ? "Home" : navItems.find(item => isActive(item.href))?.name || "Menu"}
            </span>
          </div>

          {/* User Button */}
          <Link
            href={getUserHref()}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              pathname === getUserHref()
                ? "bg-blueprint-600 text-white"
                : "text-blueprint-700 hover:bg-blueprint-50"
            )}
            aria-label={getUserLabel()}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-500 to-deep-600 flex items-center justify-center">
              <UserIcon size={12} className="text-white" strokeWidth={2} />
            </div>
          </Link>

          {/* Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              mobileMenuOpen
                ? "bg-blueprint-600 text-white"
                : "text-blueprint-700 hover:bg-blueprint-50"
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full mt-3 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-blueprint-200/30 shadow-xl p-2 pointer-events-auto"
            >
              <Link
                href={getUserHref()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1",
                  pathname === getUserHref()
                    ? "bg-blueprint-600 text-white"
                    : "text-blueprint-700 hover:bg-blueprint-50"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-deep-600 flex items-center justify-center shrink-0">
                  <UserIcon size={14} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span>{getUserLabel()}</span>
                  {user && (
                    <span className="text-xs text-blueprint-500 truncate max-w-[200px]">
                      {user.email}
                    </span>
                  )}
                </div>
              </Link>

              <div className="h-px bg-blueprint-200/50 my-2" />

              <Link
                href="/"
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isHome
                    ? "bg-blueprint-600 text-white"
                    : "text-blueprint-700 hover:bg-blueprint-50"
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
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-blueprint-600 text-white"
                        : "text-blueprint-700 hover:bg-blueprint-50"
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
    </>
  );
}