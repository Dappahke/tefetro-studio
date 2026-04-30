"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Plus, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Palette (unified with Hero + FeaturedPlans) ─────────────────────────────
// Ink:       #0D1B1E   Dark Teal: #0A3A47   Teal:      #0F4C5C
// Light Teal:#5F9EA0   Olive:     #556B2F   Lt Olive:  #8FBC8F
// Muted:     #94a3a8   White:     #F5F7F2
// ────────────────────────────────────────────────────────────────────────────

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Choose a Design",
    description:
      "Browse 50+ NCA-compliant plans and purchase ready-made drawings that match your vision and plot.",
    accent: "#5F9EA0",
    accentBg: "rgba(15,76,92,0.18)",
    accentBorder: "rgba(95,158,160,0.2)",
    tag: "Browse & Buy",
  },
  {
    icon: Plus,
    number: "02",
    title: "Add What You Need",
    description:
      "Enhance your plan with a BOQ cost estimate, interior design package, or landscaping drawings.",
    accent: "#8FBC8F",
    accentBg: "rgba(85,107,47,0.18)",
    accentBorder: "rgba(143,188,143,0.2)",
    tag: "Customise",
  },
  {
    icon: Users,
    number: "03",
    title: "Get Expert Help",
    description:
      "Connect with our licensed architects for council approvals, site supervision, and build support.",
    accent: "#5F9EA0",
    accentBg: "rgba(15,76,92,0.18)",
    accentBorder: "rgba(95,158,160,0.2)",
    tag: "Build with Confidence",
  },
];

function StepCard({
  step,
  index,
  visible,
}: {
  step: (typeof steps)[number];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = step.icon;

  return (
    <article
      role="listitem"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "20px",
        background: hovered
          ? "linear-gradient(160deg, rgba(15,76,92,0.14) 0%, rgba(13,27,30,0.9) 100%)"
          : "#0D1B1E",
        border: `1px solid ${hovered ? step.accentBorder : "rgba(95,158,160,0.1)"}`,
        boxShadow: hovered
          ? `0 0 0 1px ${step.accentBorder}, 0 24px 60px rgba(0,0,0,0.45)`
          : "0 0 0 1px rgba(95,158,160,0.06), 0 4px 24px rgba(0,0,0,0.25)",
        padding: "2rem 2rem 2.25rem",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        opacity: visible ? 1 : 0,
        transition: [
          `opacity 0.65s ease ${index * 120 + 200}ms`,
          `transform ${hovered ? "0.4s cubic-bezier(0.16,1,0.3,1)" : "0.4s cubic-bezier(0.16,1,0.3,1)"}`,
          `box-shadow 0.4s ease`,
          `border-color 0.3s ease`,
          `background 0.3s ease`,
        ].join(", "),
        overflow: "hidden",
      }}
    >
      {/* Blueprint grid inside card */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(95,158,160,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(95,158,160,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          borderRadius: "20px",
        }}
      />

      {/* Corner accents */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 20,
          height: 20,
          borderTop: `1.5px solid ${hovered ? step.accent : "rgba(95,158,160,0.2)"}`,
          borderRight: `1.5px solid ${hovered ? step.accent : "rgba(95,158,160,0.2)"}`,
          transition: "border-color 0.3s ease",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          width: 20,
          height: 20,
          borderBottom: `1.5px solid ${hovered ? step.accent : "rgba(95,158,160,0.2)"}`,
          borderLeft: `1.5px solid ${hovered ? step.accent : "rgba(95,158,160,0.2)"}`,
          transition: "border-color 0.3s ease",
        }}
      />

      {/* Large ghost number */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -16,
          right: 12,
          fontSize: "7rem",
          fontWeight: 800,
          lineHeight: 1,
          color: hovered ? step.accent : "rgba(95,158,160,0.06)",
          transition: "color 0.4s ease",
          userSelect: "none",
          letterSpacing: "-0.04em",
        }}
      >
        {step.number}
      </div>

      {/* Tag */}
      <div style={{ marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "5px 12px",
            borderRadius: "20px",
            background: hovered ? step.accentBg : "rgba(95,158,160,0.07)",
            color: hovered ? step.accent : "#94a3a8",
            border: `1px solid ${hovered ? step.accentBorder : "rgba(95,158,160,0.1)"}`,
            transition: "background 0.3s, color 0.3s, border-color 0.3s",
          }}
        >
          {step.tag}
        </span>
      </div>

      {/* Icon */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 1,
          width: 52,
          height: 52,
          borderRadius: 14,
          background: hovered ? step.accentBg : "rgba(95,158,160,0.08)",
          border: `1px solid ${hovered ? step.accentBorder : "rgba(95,158,160,0.12)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          transition: "background 0.3s, border-color 0.3s",
          boxShadow: hovered ? `0 0 20px ${step.accentBg}` : "none",
        }}
      >
        <Icon
          style={{
            width: 22,
            height: 22,
            color: hovered ? step.accent : "#5F9EA0",
            transition: "color 0.3s ease",
          }}
        />
      </div>

      {/* Step label */}
      <p
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: hovered ? step.accent : "rgba(95,158,160,0.45)",
          marginBottom: "0.5rem",
          transition: "color 0.3s ease",
        }}
      >
        Step {step.number}
      </p>

      {/* Title */}
      <h3
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "#F5F7F2",
          marginBottom: "0.75rem",
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
        }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "0.9rem",
          color: "#94a3a8",
          lineHeight: 1.7,
          maxWidth: "32ch",
        }}
      >
        {step.description}
      </p>

      {/* Bottom glow bar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </article>
  );
}

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#0A1418",
        paddingTop: "clamp(4rem,8vw,7rem)",
        paddingBottom: "clamp(4rem,8vw,7rem)",
      }}
      aria-labelledby="how-it-works-heading"
    >
      {/* Blueprint grid */}
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

      {/* Ambient glow — centre */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 500,
          background:
            "radial-gradient(ellipse, rgba(15,76,92,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* Olive glow — bottom left */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          bottom: 0,
          left: 0,
          width: 400,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(85,107,47,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />

      <div
        className="relative z-10 max-w-7xl mx-auto"
        style={{
          paddingLeft: "clamp(1.25rem,4vw,3rem)",
          paddingRight: "clamp(1.25rem,4vw,3rem)",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header
          className="mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 mb-5"
            style={{
              background: "rgba(85,107,47,0.12)",
              border: "1px solid rgba(143,188,143,0.2)",
              borderRadius: "20px",
              padding: "5px 14px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#8FBC8F",
                boxShadow: "0 0 6px #8FBC8F",
                display: "inline-block",
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#8FBC8F",
              }}
            >
              Simple Process
            </span>
          </div>

          {/* Title + subtitle side by side on large screens */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              id="how-it-works-heading"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#F5F7F2",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                maxWidth: "22ch",
              }}
            >
              From Plan to{" "}
              <span style={{ color: "#5F9EA0" }}>Built.</span>
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px #8FBC8F",
                }}
              >
                Three Steps.
              </span>
            </h2>

            <div
              style={{
                maxWidth: 380,
                color: "#94a3a8",
                fontSize: "0.95rem",
                lineHeight: 1.7,
              }}
            >
              <p>
                We&apos;ve stripped out the friction. No weeks of back-and-forth, no
                mystery pricing — just a clear path from browsing to building.
              </p>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 mt-4 font-semibold text-sm"
                style={{ color: "#5F9EA0" }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLElement).style.color = "#8FBC8F")
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLElement).style.color = "#5F9EA0")
                }
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </header>

        {/* ── Connector line (desktop) ────────────────────────────────────── */}
        <div
          className="relative"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          {/* Horizontal dashed connector behind cards */}
          <div
            className="hidden md:block absolute pointer-events-none"
            aria-hidden="true"
            style={{
              top: 68,
              left: "calc(33.333% - 8px)",
              right: "calc(33.333% - 8px)",
              height: 1,
              background:
                "repeating-linear-gradient(90deg, rgba(95,158,160,0.25) 0, rgba(95,158,160,0.25) 6px, transparent 6px, transparent 14px)",
              zIndex: 0,
            }}
          />

          {/* Step cards */}
          <div
            className="grid md:grid-cols-3 gap-6 relative z-10"
            role="list"
            aria-label="Process steps"
          >
            {steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} visible={visible} />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA strip ───────────────────────────────────────────── */}
        <div
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-6"
          style={{
            background: "rgba(15,76,92,0.1)",
            border: "1px solid rgba(95,158,160,0.12)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.65s ease 0.7s, transform 0.65s ease 0.7s",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#F5F7F2",
                marginBottom: 4,
              }}
            >
              Ready to start your build?
            </p>
            <p style={{ fontSize: "0.875rem", color: "#94a3a8" }}>
              50+ plans ready for download — from KES 8,000
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #0F4C5C 0%, #0A3A47 100%)",
                color: "#F5F7F2",
                border: "1px solid rgba(95,158,160,0.3)",
                boxShadow: "0 0 24px rgba(15,76,92,0.35)",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 36px rgba(15,76,92,0.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(15,76,92,0.35)";
              }}
            >
              Browse Plans
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl"
              style={{
                color: "#94a3a8",
                border: "1px solid rgba(148,163,168,0.15)",
                background: "rgba(255,255,255,0.03)",
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
              Talk to Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}