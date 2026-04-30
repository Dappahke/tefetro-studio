"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search, Package, ShieldCheck, Download, HardHat,
  MessageSquare, Lightbulb, PenTool, FileCheck,
  ArrowRight, Check, MapPin, ChevronDown,
} from "lucide-react";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Ink:       #0D1B1E   Dark Teal: #0A3A47   Teal:      #0F4C5C
// Light Teal:#5F9EA0   Olive:     #556B2F   Lt Olive:  #8FBC8F
// Muted:     #94a3a8   White:     #F5F7F2
// ─────────────────────────────────────────────────────────────────────────────

// ─── Scroll-triggered visibility hook ────────────────────────────────────────
function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Main process steps ───────────────────────────────────────────────────────
const MAIN_STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Browse Plans or Request a Custom Design",
    accent: "#5F9EA0",
    accentDim: "rgba(95,158,160,0.15)",
    accentBorder: "rgba(95,158,160,0.2)",
    body: "Start by exploring our collection of ready-made architectural plans designed for different lifestyles, budgets, and land sizes. If you need something unique, submit a custom design request and our team will engage you directly.",
    listTitle: "Available plan types:",
    list: [
      "Bungalows", "Maisonettes", "Modern homes",
      "Apartments", "Rental units",
      "Compact plot solutions", "Premium custom concepts",
    ],
  },
  {
    number: "02",
    icon: Package,
    title: "Choose the Right Package",
    accent: "#8FBC8F",
    accentDim: "rgba(143,188,143,0.12)",
    accentBorder: "rgba(143,188,143,0.2)",
    body: "Each plan includes core information to help you decide confidently. Optional add-ons let you build a complete documentation package suited to your project stage.",
    cols: [
      {
        label: "Every plan includes",
        items: [
          "Number of bedrooms & bathrooms",
          "Floor count & plinth area",
          "Layout suitability guide",
          "Exterior previews",
          "Transparent pricing",
        ],
      },
      {
        label: "Optional add-ons",
        items: [
          "Structural drawings",
          "Electrical & plumbing layouts",
          "Bill of quantities guidance",
          "3D renders",
          "Site adaptation services",
        ],
      },
    ],
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Secure Checkout",
    accent: "#5F9EA0",
    accentDim: "rgba(95,158,160,0.15)",
    accentBorder: "rgba(95,158,160,0.2)",
    body: "Once you choose a plan, proceed through our secure checkout system. We support convenient payment workflows and clear order confirmation so you know exactly what comes next.",
    list: [],
  },
  {
    number: "04",
    icon: Download,
    title: "Receive Your Files",
    accent: "#8FBC8F",
    accentDim: "rgba(143,188,143,0.12)",
    accentBorder: "rgba(143,188,143,0.2)",
    body: "After successful payment and processing, you receive access to your purchased documents. Delivery is digital, fast, and efficient.",
    listTitle: "Files may include:",
    list: [
      "Floor plans & elevations",
      "Sections & roof plans",
      "Printable PDFs",
      "Editable formats (where applicable)",
    ],
  },
  {
    number: "05",
    icon: HardHat,
    title: "Build With Confidence",
    accent: "#5F9EA0",
    accentDim: "rgba(95,158,160,0.15)",
    accentBorder: "rgba(95,158,160,0.2)",
    body: "Use your purchased plans with your contractor, engineer, or approvals team. We also offer modification and adaptation support when your project needs it.",
    listTitle: "We can support:",
    list: [
      "Room adjustments",
      "Plot size adaptation",
      "Facade redesign",
      "Material optimisation",
      "Expansion planning",
    ],
  },
];

// ─── Custom design workflow ───────────────────────────────────────────────────
const CUSTOM_STEPS = [
  {
    icon: MessageSquare,
    label: "Step 1",
    title: "Consultation",
    desc: "Share your plot size, budget, preferred style, room requirements, and any special features with our team.",
  },
  {
    icon: Lightbulb,
    label: "Step 2",
    title: "Concept Development",
    desc: "We prepare early concepts and layout strategy tailored to your brief.",
  },
  {
    icon: PenTool,
    label: "Step 3",
    title: "Design Refinement",
    desc: "We revise and refine based on your feedback until the design feels right.",
  },
  {
    icon: FileCheck,
    label: "Step 4",
    title: "Final Documentation",
    desc: "You receive final, construction-ready plans prepared for the next stage.",
  },
];

// ─── Why choose ──────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  "Modern and practical designs",
  "Affordable digital access",
  "Faster turnaround times",
  "Scalable options for investors",
  "Professional presentation",
  "Kenyan market understanding",
  "Reliable expert support",
  "NCA-compliant drawings",
];

const CITIES = ["Nairobi", "Eldoret", "Kisumu", "Mombasa", "Nakuru", "Thika"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function BlueprintGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage: `
          linear-gradient(rgba(95,158,160,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(95,158,160,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 mb-5"
      style={{
        background: "rgba(85,107,47,0.12)",
        border: "1px solid rgba(143,188,143,0.2)",
        borderRadius: 20,
        padding: "5px 14px",
      }}
    >
      <span
        style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#8FBC8F", boxShadow: "0 0 6px #8FBC8F",
          display: "inline-block", flexShrink: 0,
        }}
        aria-hidden="true"
      />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8FBC8F" }}>
        {children}
      </span>
    </div>
  );
}

function CornerAccents({ color = "rgba(95,158,160,0.25)" }: { color?: string }) {
  const s = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", width: 18, height: 18,
    ...pos,
  });
  return (
    <>
      <div aria-hidden="true" style={{ ...s({ top: 14, right: 14 }), borderTop: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}` }} />
      <div aria-hidden="true" style={{ ...s({ bottom: 14, left: 14 }), borderBottom: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}` }} />
    </>
  );
}

// ─── Main Step Card ───────────────────────────────────────────────────────────
function MainStepCard({ step, index, visible }: { step: typeof MAIN_STEPS[number]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = step.icon;
  const isEven = index % 2 === 1;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 20,
        background: hovered
          ? `linear-gradient(145deg, ${step.accentDim} 0%, rgba(13,27,30,0.95) 100%)`
          : "#0D1B1E",
        border: `1px solid ${hovered ? step.accentBorder : "rgba(95,158,160,0.1)"}`,
        boxShadow: hovered
          ? `0 0 0 1px ${step.accentBorder}, 0 32px 80px rgba(0,0,0,0.5)`
          : "0 4px 24px rgba(0,0,0,0.3)",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: [
          `opacity 0.7s ease ${index * 100 + 150}ms`,
          `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 100 + 150}ms`,
          "box-shadow 0.4s ease",
          "border-color 0.3s ease",
          "background 0.3s ease",
        ].join(", "),
      }}
    >
      <BlueprintGrid />
      <CornerAccents color={hovered ? step.accentBorder : "rgba(95,158,160,0.15)"} />

      {/* Ghost number */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: -20, right: 16,
          fontSize: "8rem", fontWeight: 900, lineHeight: 1,
          color: hovered ? step.accent : "rgba(95,158,160,0.05)",
          transition: "color 0.4s ease",
          userSelect: "none", letterSpacing: "-0.05em",
          pointerEvents: "none",
        }}
      >
        {step.number}
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: hovered ? step.accentDim : "rgba(95,158,160,0.08)",
              border: `1px solid ${hovered ? step.accentBorder : "rgba(95,158,160,0.12)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: hovered ? `0 0 24px ${step.accentDim}` : "none",
              transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
            }}
            aria-hidden="true"
          >
            <Icon style={{ width: 22, height: 22, color: hovered ? step.accent : "#5F9EA0", transition: "color 0.3s" }} />
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: hovered ? step.accent : "rgba(95,158,160,0.45)", marginBottom: 4, transition: "color 0.3s" }}>
              Step {step.number}
            </p>
            <h3 style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", fontWeight: 700, color: "#F5F7F2", lineHeight: 1.25, letterSpacing: "-0.01em", maxWidth: "32ch" }}>
              {step.title}
            </h3>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: hovered ? `linear-gradient(90deg, ${step.accentBorder}, transparent)` : "rgba(95,158,160,0.08)", marginBottom: "1.5rem", transition: "background 0.4s" }} />

        {/* Body */}
        <p style={{ fontSize: "0.9rem", color: "#94a3a8", lineHeight: 1.75, marginBottom: step.list && step.list.length ? "1.25rem" : 0 }}>
          {step.body}
        </p>

        {/* Single list */}
        {"listTitle" in step && step.listTitle && step.list && step.list.length > 0 && !("cols" in step) && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: hovered ? step.accent : "rgba(95,158,160,0.5)", marginBottom: "0.75rem", transition: "color 0.3s" }}>
              {step.listTitle}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 8 }} role="list">
              {step.list.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{ width: 5, height: 5, borderRadius: "50%", background: step.accent, flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <span style={{ fontSize: "0.875rem", color: "#94a3a8" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Two-column lists */}
        {"cols" in step && step.cols && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {step.cols.map((col) => (
              <div key={col.label}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: hovered ? step.accent : "rgba(95,158,160,0.5)", marginBottom: "0.75rem", transition: "color 0.3s" }}>
                  {col.label}
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8 }} role="list">
                  {col.items.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Check style={{ width: 13, height: 13, color: step.accent, marginTop: 3, flexShrink: 0 }} aria-hidden="true" />
                      <span style={{ fontSize: "0.875rem", color: "#94a3a8" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom glow bar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </article>
  );
}

// ─── Custom workflow card ────────────────────────────────────────────────────
function CustomCard({ step, index, visible }: { step: typeof CUSTOM_STEPS[number]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = step.icon;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 16,
        background: hovered ? "rgba(15,76,92,0.18)" : "rgba(13,27,30,0.6)",
        border: `1px solid ${hovered ? "rgba(95,158,160,0.3)" : "rgba(95,158,160,0.1)"}`,
        padding: "1.5rem",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: [
          `opacity 0.65s ease ${index * 100 + 100}ms`,
          `transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 100 + 100}ms`,
          "background 0.3s, border-color 0.3s",
        ].join(", "),
      }}
    >
      {/* Step connector line on right (not on last) */}
      <CornerAccents color={hovered ? "rgba(95,158,160,0.4)" : "rgba(95,158,160,0.15)"} />

      <div
        style={{
          width: 40, height: 40, borderRadius: 10, marginBottom: "1rem",
          background: hovered ? "rgba(95,158,160,0.2)" : "rgba(95,158,160,0.08)",
          border: "1px solid rgba(95,158,160,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.3s",
        }}
        aria-hidden="true"
      >
        <Icon style={{ width: 18, height: 18, color: "#5F9EA0" }} />
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: hovered ? "#5F9EA0" : "rgba(95,158,160,0.4)", marginBottom: 6, transition: "color 0.3s" }}>
        {step.label}
      </p>
      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7F2", marginBottom: "0.5rem" }}>
        {step.title}
      </h4>
      <p style={{ fontSize: "0.85rem", color: "#94a3a8", lineHeight: 1.65 }}>
        {step.desc}
      </p>

      {/* Bottom bar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #5F9EA0, transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  // Section visibility refs
  const heroSection = useVisible(0.1);
  const stepsSection = useVisible(0.05);
  const customSection = useVisible(0.1);
  const whySection = useVisible(0.1);
  const ctaSection = useVisible(0.15);

  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <main style={{ background: "#0A1418", minHeight: "100vh" }}>

      {/* ════════════════════════════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "clamp(6rem, 12vw, 10rem)",
          paddingBottom: "clamp(4rem, 8vw, 7rem)",
          background: "#0D1B1E",
        }}
      >
        <BlueprintGrid />

        {/* Teal glow */}
        <div aria-hidden="true" style={{ position: "absolute", top: -100, left: "20%", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(15,76,92,0.35) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />
        {/* Olive glow */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: 0, right: "10%", width: 500, height: 400, background: "radial-gradient(ellipse, rgba(85,107,47,0.2) 0%, transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />

        <div
          ref={heroSection.ref}
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
          }}
        >
          <div
            style={{
              opacity: heroSection.visible ? 1 : 0,
              transform: heroSection.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.75s ease, transform 0.75s ease",
            }}
          >
            <Eyebrow>How It Works</Eyebrow>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                fontWeight: 800,
                color: "#F5F7F2",
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                maxWidth: "22ch",
                marginBottom: "1.5rem",
              }}
            >
              At Tefetro Studio,
              <br />
              <span style={{ color: "#5F9EA0" }}>We Make Building</span>
              <br />
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px #8FBC8F" }}>Easier.</span>
            </h1>

            <p
              style={{
                maxWidth: 560, color: "#94a3a8",
                fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
                lineHeight: 1.75,
                marginBottom: "2rem",
              }}
            >
              We help you access professionally designed house plans, architectural support, and custom design solutions
              in a clear, modern process — whether you&apos;re building your first home, developing rental units, or planning an investment project.
            </p>

            {/* Quick-jump steps */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {MAIN_STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    document.getElementById(`step-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: "0.8rem", fontWeight: 600,
                    padding: "7px 14px", borderRadius: 20,
                    background: "rgba(15,76,92,0.12)",
                    border: "1px solid rgba(95,158,160,0.18)",
                    color: "#94a3a8",
                    cursor: "pointer",
                    transition: "color 0.2s, border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.color = "#5F9EA0";
                    t.style.borderColor = "rgba(95,158,160,0.4)";
                    t.style.background = "rgba(15,76,92,0.2)";
                  }}
                  onMouseLeave={e => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.color = "#94a3a8";
                    t.style.borderColor = "rgba(95,158,160,0.18)";
                    t.style.background = "rgba(15,76,92,0.12)";
                  }}
                >
                  <span style={{ color: "#5F9EA0", fontWeight: 800, fontSize: "0.7rem" }}>{s.number}</span>
                  {s.title.split(" ").slice(0, 3).join(" ")}…
                  <ChevronDown style={{ width: 12, height: 12 }} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MAIN 5-STEP PROCESS
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          paddingTop: "clamp(4rem,8vw,7rem)",
          paddingBottom: "clamp(4rem,8vw,7rem)",
        }}
        aria-labelledby="process-heading"
      >
        <BlueprintGrid />

        {/* Centre glow */}
        <div aria-hidden="true" style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, background: "radial-gradient(ellipse, rgba(15,76,92,0.12) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div
          ref={stepsSection.ref}
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
          }}
        >
          {/* Section header */}
          <div
            style={{
              marginBottom: "3.5rem",
              opacity: stepsSection.visible ? 1 : 0,
              transform: stepsSection.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
            }}
          >
            <Eyebrow>The Process</Eyebrow>
            <h2
              id="process-heading"
              style={{
                fontSize: "clamp(1.6rem,3.5vw,2.5rem)",
                fontWeight: 800, color: "#F5F7F2",
                letterSpacing: "-0.02em", lineHeight: 1.1,
              }}
            >
              Five Steps from
              <span style={{ color: "#5F9EA0" }}> Plan</span> to
              <span style={{ color: "#8FBC8F" }}> Build.</span>
            </h2>
          </div>

          {/* Timeline layout — alternating on large screens */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.5rem,3vw,2rem)" }}>
            {MAIN_STEPS.map((step, i) => (
              <div key={i} id={`step-${i}`}>
                <MainStepCard step={step} index={i} visible={stepsSection.visible} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CUSTOM DESIGN WORKFLOW
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          paddingTop: "clamp(4rem,8vw,6rem)",
          paddingBottom: "clamp(4rem,8vw,6rem)",
          background: "#0D1B1E",
        }}
        aria-labelledby="custom-heading"
      >
        <BlueprintGrid />

        {/* Olive glow left */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: 500, height: 400, background: "radial-gradient(ellipse, rgba(85,107,47,0.18) 0%, transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />

        <div
          ref={customSection.ref}
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(2rem,4vw,4rem)",
              alignItems: "start",
            }}
          >
            {/* Left — heading */}
            <div
              style={{
                opacity: customSection.visible ? 1 : 0,
                transform: customSection.visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.65s ease, transform 0.65s ease",
              }}
            >
              <Eyebrow>Custom Design</Eyebrow>
              <h2
                id="custom-heading"
                style={{
                  fontSize: "clamp(1.6rem,3.5vw,2.5rem)",
                  fontWeight: 800, color: "#F5F7F2",
                  letterSpacing: "-0.02em", lineHeight: 1.1,
                  marginBottom: "1rem",
                }}
              >
                Need Something
                <br />
                <span style={{ color: "#5F9EA0" }}>Unique?</span>
              </h2>
              <p style={{ color: "#94a3a8", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 360 }}>
                For projects that go beyond our catalogue, our custom design workflow gives you direct access to our architectural team — from first brief to final documentation.
              </p>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: "0.9rem", fontWeight: 700,
                  padding: "0.875rem 1.75rem", borderRadius: 12,
                  background: "linear-gradient(135deg, #0F4C5C 0%, #0A3A47 100%)",
                  color: "#F5F7F2",
                  border: "1px solid rgba(95,158,160,0.3)",
                  boxShadow: "0 0 24px rgba(15,76,92,0.3)",
                  textDecoration: "none",
                  transition: "box-shadow 0.25s ease, transform 0.25s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(15,76,92,0.5)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(15,76,92,0.3)";
                }}
              >
                Start a Custom Project
                <ArrowRight style={{ width: 16, height: 16 }} aria-hidden="true" />
              </Link>
            </div>

            {/* Right — 4 custom steps grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {CUSTOM_STEPS.map((s, i) => (
                <CustomCard key={i} step={s} index={i} visible={customSection.visible} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          WHY TEFETRO STUDIO
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          paddingTop: "clamp(4rem,8vw,6rem)",
          paddingBottom: "clamp(4rem,8vw,6rem)",
        }}
        aria-labelledby="why-heading"
      >
        <BlueprintGrid />

        {/* Teal glow right */}
        <div aria-hidden="true" style={{ position: "absolute", top: "30%", right: 0, width: 500, height: 400, background: "radial-gradient(ellipse, rgba(15,76,92,0.2) 0%, transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />

        <div
          ref={whySection.ref}
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(2rem,5vw,5rem)",
              alignItems: "center",
            }}
          >
            {/* Left */}
            <div
              style={{
                opacity: whySection.visible ? 1 : 0,
                transform: whySection.visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.65s ease, transform 0.65s ease",
              }}
            >
              <Eyebrow>Why Choose Us</Eyebrow>
              <h2
                id="why-heading"
                style={{
                  fontSize: "clamp(1.6rem,3.5vw,2.5rem)",
                  fontWeight: 800, color: "#F5F7F2",
                  letterSpacing: "-0.02em", lineHeight: 1.1,
                  marginBottom: "1rem",
                }}
              >
                Designed for
                <br />
                <span style={{ color: "#5F9EA0" }}>Modern</span>{" "}
                <span style={{ color: "transparent", WebkitTextStroke: "1.5px #8FBC8F" }}>Kenya.</span>
              </h2>
              <p style={{ color: "#94a3a8", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "1.5rem", maxWidth: 380 }}>
                Whether you&apos;re building in Nairobi, Eldoret, Kisumu, Mombasa, or beyond, Tefetro Studio helps transform ideas into real projects.
              </p>

              {/* City tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CITIES.map(city => (
                  <span
                    key={city}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: "0.75rem", fontWeight: 600,
                      padding: "5px 12px", borderRadius: 20,
                      background: "rgba(85,107,47,0.12)",
                      border: "1px solid rgba(143,188,143,0.15)",
                      color: "#8FBC8F",
                    }}
                  >
                    <MapPin style={{ width: 10, height: 10 }} aria-hidden="true" />
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — benefit grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                opacity: whySection.visible ? 1 : 0,
                transform: whySection.visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s",
              }}
            >
              {WHY_ITEMS.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "1rem 1.1rem",
                    borderRadius: 12,
                    background: "rgba(13,27,30,0.6)",
                    border: "1px solid rgba(95,158,160,0.1)",
                    opacity: whySection.visible ? 1 : 0,
                    transform: whySection.visible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.55s ease ${i * 60 + 300}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 60 + 300}ms`,
                  }}
                >
                  <div
                    style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: "rgba(143,188,143,0.12)",
                      border: "1px solid rgba(143,188,143,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    aria-hidden="true"
                  >
                    <Check style={{ width: 12, height: 12, color: "#8FBC8F" }} />
                  </div>
                  <span style={{ fontSize: "0.825rem", color: "#94a3a8", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          paddingTop: "clamp(3rem,6vw,5rem)",
          paddingBottom: "clamp(3rem,6vw,5rem)",
          background: "#0D1B1E",
        }}
      >
        <BlueprintGrid />

        {/* Centre radial glow */}
        <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(15,76,92,0.25) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div
          ref={ctaSection.ref}
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
          }}
        >
          <div
            style={{
              position: "relative", borderRadius: 24,
              background: "rgba(13,27,30,0.7)",
              border: "1px solid rgba(95,158,160,0.15)",
              padding: "clamp(2rem,5vw,4rem)",
              textAlign: "center",
              backdropFilter: "blur(12px)",
              overflow: "hidden",
              opacity: ctaSection.visible ? 1 : 0,
              transform: ctaSection.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <CornerAccents color="rgba(95,158,160,0.25)" />

            {/* Inner teal glow */}
            <div aria-hidden="true" style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(15,76,92,0.3) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <Eyebrow>Get Started</Eyebrow>

              <h2
                style={{
                  fontSize: "clamp(1.8rem,4vw,3rem)",
                  fontWeight: 800, color: "#F5F7F2",
                  letterSpacing: "-0.02em", lineHeight: 1.08,
                  marginBottom: "1rem",
                }}
              >
                Ready to Build
                <span style={{ color: "#5F9EA0" }}> Your Vision?</span>
              </h2>

              <p style={{ color: "#94a3a8", fontSize: "1rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2.5rem" }}>
                Browse 50+ NCA-compliant plans from KES 8,000, or talk to our team about a custom design tailored exactly to your plot and budget.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                <Link
                  href="/plans"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: "0.95rem", fontWeight: 700,
                    padding: "1rem 2rem", borderRadius: 12,
                    background: "linear-gradient(135deg, #0F4C5C 0%, #0A3A47 100%)",
                    color: "#F5F7F2",
                    border: "1px solid rgba(95,158,160,0.3)",
                    boxShadow: "0 0 28px rgba(15,76,92,0.35)",
                    textDecoration: "none",
                    transition: "box-shadow 0.25s ease, transform 0.25s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 48px rgba(15,76,92,0.55)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(15,76,92,0.35)";
                  }}
                >
                  Browse Plans
                  <ArrowRight style={{ width: 16, height: 16 }} aria-hidden="true" />
                </Link>

                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: "0.95rem", fontWeight: 600,
                    padding: "1rem 1.75rem", borderRadius: 12,
                    color: "#94a3a8",
                    border: "1px solid rgba(148,163,168,0.15)",
                    background: "rgba(255,255,255,0.03)",
                    textDecoration: "none",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "#F5F7F2";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(95,158,160,0.35)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "#94a3a8";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,168,0.15)";
                  }}
                >
                  Talk to Our Team
                </Link>
              </div>
            </div>

            {/* Bottom glow bar */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent, #5F9EA0, #8FBC8F, #5F9EA0, transparent)",
              }}
            />
          </div>
        </div>
      </section>

    </main>
  );
}