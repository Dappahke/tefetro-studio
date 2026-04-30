"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Palette ───────────────────────────────────────────────────────────────
// Deep Teal:  #0A3A47  |  Teal:    #0F4C5C  |  Light Teal: #5F9EA0
// Dark Olive: #3D4F1F  |  Olive:   #556B2F  |  Light Olive: #8FBC8F
// Cream:      #FAF9F6  |  Ink:     #0D1B1E  |  Muted:       #94a3a8
// ───────────────────────────────────────────────────────────────────────────

// Animated counter hook
function useCounter(end: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

const MARQUEE_ITEMS = [
  "NCA Compliant Drawings",
  "Instant Download",
  "Licensed Architects",
  "50+ Ready Plans",
  "Nairobi to Mombasa",
  "Structural + Architectural",
  "BOQ Included",
  "3D Renders Available",
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [countersOn, setCountersOn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const plans = useCounter(50, 1600, countersOn);
  const clients = useCounter(1200, 2000, countersOn);
  const counties = useCounter(47, 1400, countersOn);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setCountersOn(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "#0D1B1E" }}
      aria-labelledby="hero-heading"
    >
      {/* ── Blueprint grid overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(95,158,160,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(95,158,160,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Teal glow — top left ──────────────────────────────────────── */}
      <div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(15,76,92,0.55) 0%, transparent 65%)",
          filter: "blur(80px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* ── Olive glow — bottom right ─────────────────────────────────── */}
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(85,107,47,0.35) 0%, transparent 65%)",
          filter: "blur(80px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.4s ease 0.3s",
        }}
      />

      {/* ════════════════════════════════════════════════════════════════
          MAIN GRID — Left (Text) | Right (Visual)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 lg:pt-36 pb-0">
        <div className="grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[55%_45%] gap-0 lg:gap-12 items-center min-h-[calc(100vh-7rem)]">

          {/* ──────────────────────────────────────────────────────────
              LEFT — Command Panel
          ────────────────────────────────────────────────────────── */}
          <div
            className="flex flex-col justify-center pb-16 lg:pb-24"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2.5 mb-8 self-start"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
              }}
            >
              <span
                className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase px-4 py-2 rounded-full border"
                style={{
                  color: "#8FBC8F",
                  borderColor: "rgba(143,188,143,0.25)",
                  background: "rgba(85,107,47,0.12)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#8FBC8F", boxShadow: "0 0 6px #8FBC8F" }}
                />
                Kenya&apos;s Trusted PropTech Platform
              </span>
            </div>

            {/* Headline */}
            <header className="mb-8">
              <h1
                id="hero-heading"
                className="font-bold leading-[1.04] tracking-tight"
                style={{
                  fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
                  color: "#F5F7F2",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s",
                }}
              >
                Stop Waiting Months
                <br />
                <span style={{ color: "#5F9EA0" }}>for House Plans.</span>
                <br />
                <span
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1.5px #8FBC8F",
                  }}
                >
                  Build This Week.
                </span>
              </h1>
            </header>

            {/* Sub-headline */}
            <p
              className="mb-10 leading-relaxed max-w-[520px]"
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                color: "#94a3a8",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
              }}
            >
              Download complete architectural drawings instantly —
              <span style={{ color: "#5F9EA0", fontWeight: 600 }}> NCA-compliant </span>
              plans ready for Kenyan plots, from{" "}
              <span style={{ color: "#8FBC8F", fontWeight: 600 }}>KES 8,000</span>.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s",
              }}
            >
              <Link
                href="/plans"
                className="group relative inline-flex items-center justify-center gap-3 font-bold overflow-hidden"
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #0F4C5C 0%, #0A3A47 100%)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em",
                  boxShadow: "0 0 0 1px rgba(95,158,160,0.3), 0 8px 32px rgba(15,76,92,0.4)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(95,158,160,0.5), 0 16px 48px rgba(15,76,92,0.5)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(95,158,160,0.3), 0 8px 32px rgba(15,76,92,0.4)";
                }}
                aria-label="Browse house plans"
              >
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "200% 0",
                    transition: "background-position 0.6s ease",
                  }}
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLElement).style.backgroundPosition = "-200% 0")
                  }
                />
                Browse House Plans
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 font-semibold"
                style={{
                  padding: "1rem 1.75rem",
                  borderRadius: "12px",
                  color: "#94a3a8",
                  border: "1px solid rgba(148,163,168,0.18)",
                  background: "rgba(255,255,255,0.03)",
                  fontSize: "0.95rem",
                  backdropFilter: "blur(8px)",
                  transition: "color 0.2s, border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#F5F7F2";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(95,158,160,0.4)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(15,76,92,0.15)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "#94a3a8";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,168,0.18)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
                aria-label="Talk to an architect"
              >
                <MessageCircle className="w-4 h-4" style={{ color: "#5F9EA0" }} aria-hidden="true" />
                Talk to an Architect
              </Link>
            </div>

            {/* ── Stats Row ─────────────────────────────────────────── */}
            <div
              className="flex flex-wrap items-center gap-8"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.6s ease 0.6s",
              }}
            >
              {[
                { value: plans, suffix: "+", label: "Ready Plans" },
                { value: clients, suffix: "+", label: "Clients Served" },
                { value: counties, suffix: "", label: "Counties Covered" },
              ].map(({ value, suffix, label }) => (
                <div key={label} className="flex flex-col">
                  <span
                    className="font-bold tabular-nums"
                    style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#F5F7F2", lineHeight: 1 }}
                  >
                    {value}
                    {suffix}
                  </span>
                  <span className="text-xs font-medium mt-1" style={{ color: "#5F9EA0", letterSpacing: "0.08em" }}>
                    {label}
                  </span>
                </div>
              ))}

              {/* Divider */}
              <div
                className="hidden sm:block self-stretch w-px"
                style={{ background: "rgba(148,163,168,0.12)" }}
              />

              {/* Trust Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Shield, text: "NCA Compliant" },
                  { icon: Award, text: "Licensed" },
                  { icon: Clock, text: "Instant DL" },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      color: "#8FBC8F",
                      background: "rgba(85,107,47,0.15)",
                      border: "1px solid rgba(143,188,143,0.18)",
                    }}
                  >
                    <Icon className="w-3 h-3" aria-hidden="true" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              RIGHT — Visual Panel
          ────────────────────────────────────────────────────────── */}
          <div
            className="relative hidden lg:flex items-center justify-center pb-16 lg:pb-24"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s",
            }}
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-4 rounded-[2rem] pointer-events-none"
              aria-hidden="true"
              style={{
                background: "radial-gradient(ellipse at 30% 40%, rgba(15,76,92,0.4) 0%, rgba(85,107,47,0.2) 50%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* Main image card */}
            <div
              className="relative w-full"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "4/3",
                boxShadow: "0 0 0 1px rgba(95,158,160,0.15), 0 24px 80px rgba(0,0,0,0.5)",
              }}
            >
              <Image
                src="/images/hero-render.png"
                alt="Modern Kenyan architectural home render with tropical landscaping"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

              {/* Dark vignette overlay */}
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background: "linear-gradient(to top, rgba(10,58,71,0.7) 0%, transparent 50%)",
                }}
              />

              {/* Blueprint corner accents */}
              {[
                "top-4 right-4 border-t border-r",
                "bottom-4 left-4 border-b border-l",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-8 h-8 ${cls}`}
                  aria-hidden="true"
                  style={{ borderColor: "rgba(95,158,160,0.5)", borderRadius: "0" }}
                />
              ))}

              {/* Bottom label inside image */}
              <div
                className="absolute bottom-5 left-5 right-5 flex items-end justify-between"
                aria-hidden="true"
              >
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#8FBC8F" }}>
                    Featured Design
                  </p>
                  <p className="text-base font-bold" style={{ color: "#F5F7F2" }}>
                    Simple Modern 2-Bedroom Bungalow · Bungalows
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "#556B2F", color: "#F5F7F2" }}
                >
                  KES 14,000
                </span>
              </div>
            </div>

            {/* ── Floating card — top left ──────────────────────────── */}
            <div
              className="absolute -top-4 -left-6 flex flex-col gap-1"
              style={{
                background: "rgba(13,27,30,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(95,158,160,0.2)",
                borderRadius: "14px",
                padding: "14px 18px",
                minWidth: "140px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) rotate(-1deg)" : "translateY(16px)",
                transition: "opacity 0.7s ease 0.9s, transform 0.7s ease 0.9s",
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-3.5 h-3.5" style={{ color: "#8FBC8F" }} />
                <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "#5F9EA0" }}>
                  Just Downloaded
                </span>
              </div>
              <p className="text-sm font-bold" style={{ color: "#F5F7F2" }}>4-Bedroom Maisonette</p>
              <p className="text-[11px]" style={{ color: "#94a3a8" }}>Kiambu · 2 min ago</p>
            </div>

            {/* ── Floating card — bottom right ─────────────────────── */}
            <div
              className="absolute -bottom-6 -right-4"
              style={{
                background: "rgba(13,27,30,0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(143,188,143,0.2)",
                borderRadius: "14px",
                padding: "16px 20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) rotate(0.8deg)" : "translateY(16px)",
                transition: "opacity 0.7s ease 1.1s, transform 0.7s ease 1.1s",
              }}
            >
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "#8FBC8F" }}>
                Plans Available
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tabular-nums" style={{ color: "#F5F7F2", lineHeight: 1 }}>
                  {plans}+
                </span>
                <span className="text-xs" style={{ color: "#5F9EA0" }}>NCA Approved</span>
              </div>
              {/* Mini avatar stack */}
              <div className="flex -space-x-2 mt-3">
                {[
                  { bg: "linear-gradient(135deg, #0F4C5C, #5F9EA0)", label: "A" },
                  { bg: "linear-gradient(135deg, #556B2F, #8FBC8F)", label: "B" },
                  { bg: "linear-gradient(135deg, #3D4F1F, #556B2F)", label: "C" },
                  { bg: "linear-gradient(135deg, #0A3A47, #0F4C5C)", label: "D" },
                ].map(({ bg, label }) => (
                  <div
                    key={label}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: bg, borderColor: "#0D1B1E" }}
                    aria-hidden="true"
                  >
                    {label}
                  </div>
                ))}
                <div
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "#0F4C5C", borderColor: "#0D1B1E", color: "#8FBC8F" }}
                  aria-hidden="true"
                >
                  1k+
                </div>
              </div>
            </div>

            {/* ── NEW badge ─────────────────────────────────────────── */}
            <div
              className="absolute top-1/2 -right-5 -translate-y-1/2"
              style={{
                background: "linear-gradient(135deg, #556B2F, #3D4F1F)",
                color: "#F5F7F2",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                padding: "8px 14px",
                borderRadius: "20px",
                writingMode: "vertical-rl",
                boxShadow: "0 4px 20px rgba(85,107,47,0.4)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.6s ease 1.3s",
              }}
            >
              NEW ARRIVALS
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MARQUEE TRUST BAR
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 mt-0"
        style={{
          borderTop: "1px solid rgba(95,158,160,0.12)",
          borderBottom: "1px solid rgba(95,158,160,0.12)",
          background: "rgba(15,76,92,0.08)",
          overflow: "hidden",
          padding: "14px 0",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.8s",
        }}
      >
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0D1B1E, transparent)" }}
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0D1B1E, transparent)" }}
          aria-hidden="true"
        />

        <div
          className="flex gap-0"
          style={{ animation: "marquee 28s linear infinite", width: "max-content" }}
          aria-label="Platform features"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-8 text-sm font-semibold whitespace-nowrap"
              style={{ color: "#94a3a8" }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "#556B2F" }}
                aria-hidden="true"
              />
              {item}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes marquee { 0%, 100% { transform: translateX(0); } }
          }
        `}</style>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE STATS (visible only on small screens)
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="lg:hidden relative z-10 grid grid-cols-3 gap-0 px-5 py-8"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.7s",
        }}
      >
        {[
          { value: plans, suffix: "+", label: "Ready Plans" },
          { value: clients, suffix: "+", label: "Clients Served" },
          { value: counties, suffix: "", label: "Counties" },
        ].map(({ value, suffix, label }, i) => (
          <div
            key={label}
            className="flex flex-col items-center text-center py-4"
            style={{
              borderRight: i < 2 ? "1px solid rgba(95,158,160,0.12)" : "none",
            }}
          >
            <span
              className="font-bold tabular-nums"
              style={{ fontSize: "1.8rem", color: "#F5F7F2", lineHeight: 1 }}
            >
              {value}{suffix}
            </span>
            <span className="text-[11px] font-medium mt-1" style={{ color: "#5F9EA0" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}