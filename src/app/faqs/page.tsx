"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus, Minus, ArrowRight, MessageSquare,
  ShoppingCart, FileText, Shield, Wrench,
  CreditCard, Download, HardHat, HelpCircle,
} from "lucide-react";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Ink:       #0D1B1E   Dark Teal: #0A3A47   Teal:      #0F4C5C
// Light Teal:#5F9EA0   Olive:     #556B2F   Lt Olive:  #8FBC8F
// Muted:     #94a3a8   White:     #F5F7F2
// ─────────────────────────────────────────────────────────────────────────────

// ─── FAQ DATA ─────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    id: "about",
    icon: HelpCircle,
    label: "About Tefetro Studio",
    accent: "#5F9EA0",
    accentDim: "rgba(95,158,160,0.12)",
    accentBorder: "rgba(95,158,160,0.2)",
    questions: [
      {
        q: "What is Tefetro Studio?",
        a: "Tefetro Studio is a Kenyan PropTech platform that gives you direct access to professionally designed, NCA-compliant house plans — available for instant digital download. We also offer custom architectural design services, add-on packages, and construction support for homeowners, investors, and developers across Kenya.",
      },
      {
        q: "Are your architects licensed?",
        a: "Yes. All plans on our platform are prepared by licensed architects registered with the Board of Registration of Architects and Quantity Surveyors (BORAQS) in Kenya and are compliant with the National Construction Authority (NCA) requirements.",
      },
      {
        q: "Which areas of Kenya do you serve?",
        a: "We serve clients nationwide — including Nairobi, Mombasa, Kisumu, Eldoret, Nakuru, Thika, Kiambu, Machakos, and beyond. Because our plans are delivered digitally, geography is no barrier. For site-specific services like supervision or adaptation, our team can advise on coverage.",
      },
      {
        q: "Can I visit your offices?",
        a: "We operate as a digital-first studio. Most client engagement happens online and via phone or email for speed and convenience. If you require in-person consultation for a custom project, please reach out through our contact page and we will arrange it.",
      },
    ],
  },
  {
    id: "plans",
    icon: FileText,
    label: "Plans & Products",
    accent: "#8FBC8F",
    accentDim: "rgba(143,188,143,0.12)",
    accentBorder: "rgba(143,188,143,0.2)",
    questions: [
      {
        q: "What types of house plans do you offer?",
        a: "Our catalogue includes bungalows, maisonettes, modern homes, apartments, rental units, compact plot solutions, and premium custom concepts. Plans cover a range of bedroom configurations from 1-bedroom studio units to 6-bedroom family homes and multi-unit developments.",
      },
      {
        q: "What drawings are included in a standard plan?",
        a: "A standard plan package typically includes floor plans (all levels), front and rear elevations, side elevations, sections, and a roof plan — all as printable PDFs. Some plans also include editable CAD formats. The exact contents are listed on each plan's product page.",
      },
      {
        q: "Are the plans suitable for my plot size?",
        a: "Each plan page shows the recommended minimum plot size, plinth area, and layout dimensions. We offer plans for compact plots (as small as 40×80 ft), standard plots, and larger parcels. If you're unsure, contact us with your plot dimensions and we'll recommend the most suitable options.",
      },
      {
        q: "Can I see the full drawings before buying?",
        a: "Each listing includes exterior preview images, floor plan thumbnails, and a full specification breakdown so you can make an informed decision. Full construction drawings are released after purchase. If you need to see additional details before committing, contact our team.",
      },
      {
        q: "Do you offer 3-bedroom or 4-bedroom specific plans?",
        a: "Yes. You can filter our catalogue by number of bedrooms. We have plans for 1-bedroom through 6-bedroom configurations across all building typologies — from compact bungalows to multi-storey maisonettes.",
      },
      {
        q: "How often do you add new plans?",
        a: "We regularly update the catalogue with new arrivals. Our team designs new plans based on current Kenyan housing trends, popular plot sizes, and client feedback. Subscribe to our updates or check the 'New Arrivals' section on the homepage.",
      },
    ],
  },
  {
    id: "pricing",
    icon: CreditCard,
    label: "Pricing & Payment",
    accent: "#5F9EA0",
    accentDim: "rgba(95,158,160,0.12)",
    accentBorder: "rgba(95,158,160,0.2)",
    questions: [
      {
        q: "How much do plans cost?",
        a: "Ready-made plans start from KES 8,000. The price varies depending on the complexity of the design, number of floors, and included documentation. Prices for each plan are clearly displayed on the product page before you add to cart.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We support M-Pesa, credit and debit cards (Visa & Mastercard), and bank transfer for larger orders. Our checkout is fully secured with SSL encryption. Payment confirmation is sent immediately to your registered email.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No. The price shown on the product page is what you pay. Optional add-ons (structural drawings, BOQ, 3D renders, etc.) are clearly priced as separate line items during checkout — nothing is added without your explicit selection.",
      },
      {
        q: "Can I pay in instalments for custom projects?",
        a: "For custom design projects, we offer a milestone-based payment structure: a deposit to initiate the project, payment at concept stage, and final balance on delivery. Your project manager will outline the schedule clearly before work begins.",
      },
      {
        q: "Do you offer discounts for bulk purchases or developers?",
        a: "Yes. Investors and developers purchasing multiple plans or commissioning multi-unit developments qualify for a tailored pricing arrangement. Contact us directly with your project scope and we'll put together a proposal.",
      },
    ],
  },
  {
    id: "downloads",
    icon: Download,
    label: "Downloads & Files",
    accent: "#8FBC8F",
    accentDim: "rgba(143,188,143,0.12)",
    accentBorder: "rgba(143,188,143,0.2)",
    questions: [
      {
        q: "How do I receive my plans after payment?",
        a: "After your payment is confirmed, you will receive a download link via email and access through your account dashboard. Delivery is instant for ready-made plans — no waiting for couriers or office visits.",
      },
      {
        q: "In what format are the files delivered?",
        a: "Plans are delivered primarily as high-resolution, print-ready PDFs. Select plans also include DWG (AutoCAD) or editable formats where applicable. The available formats are listed on each product page before purchase.",
      },
      {
        q: "How long will my download link be active?",
        a: "Your purchased plans are stored in your account and remain accessible as long as your account is active. We recommend downloading and saving a local backup copy immediately after purchase.",
      },
      {
        q: "What if my download fails or the files are corrupted?",
        a: "Contact our support team immediately with your order number. We will verify your purchase and resend your files or restore access within one business day. We keep secure backups of all purchased documents.",
      },
      {
        q: "Can I share my plans with my contractor or engineer?",
        a: "Yes — and we encourage it. The plans are yours to use with your contractor, structural engineer, and approvals team. You may not resell or redistribute the drawings commercially, but there are no restrictions on professional use for the construction project they were purchased for.",
      },
    ],
  },
  {
    id: "compliance",
    icon: Shield,
    label: "NCA Compliance & Approvals",
    accent: "#5F9EA0",
    accentDim: "rgba(95,158,160,0.12)",
    accentBorder: "rgba(95,158,160,0.2)",
    questions: [
      {
        q: "Are your plans NCA compliant?",
        a: "Yes. All plans in our catalogue meet the requirements set by the National Construction Authority (NCA) and are prepared in line with Kenyan building codes and planning regulations. They are signed and stamped by a registered architect.",
      },
      {
        q: "Can I use these plans to get county council approvals?",
        a: "Ready-made plans provide a strong foundation for the approvals process. However, county councils often require site-specific information (your actual plot survey, site plan, and sometimes structural calculations). We offer a Site Adaptation service that customises the drawings for your specific parcel — strongly recommended before submission.",
      },
      {
        q: "What is the Site Adaptation service?",
        a: "Our Site Adaptation service takes a ready-made plan and modifies it to reflect your actual plot: orientation, setbacks, site contours, and county-specific requirements. This produces a set of drawings that is ready to submit to your county council for approval. It is available as an add-on during checkout or separately.",
      },
      {
        q: "Do you assist with the council approval submission?",
        a: "We can guide you through the process and prepare the required documentation. For full submission management — including liaising with the county office — our team offers an Approvals Support service on request. Contact us for a quote based on your county and project scope.",
      },
      {
        q: "Will I need a structural engineer in addition to these plans?",
        a: "For most permanent structures in Kenya, a structural engineer is required to provide and stamp structural drawings. Our Structural Drawings add-on covers this. Alternatively, our plans are provided in a format that your own structural engineer can work from.",
      },
    ],
  },
  {
    id: "addons",
    icon: ShoppingCart,
    label: "Add-Ons & Extras",
    accent: "#8FBC8F",
    accentDim: "rgba(143,188,143,0.12)",
    accentBorder: "rgba(143,188,143,0.2)",
    questions: [
      {
        q: "What add-ons are available?",
        a: "Our add-on catalogue includes: Structural Drawings, Electrical Layout, Plumbing Drawings, Bill of Quantities (BOQ), 3D Exterior Renders, Interior Design Concepts, Landscaping Plans, and Site Adaptation. Add-ons can be selected during checkout or purchased separately for any existing plan.",
      },
      {
        q: "What is the Bill of Quantities (BOQ) and why do I need it?",
        a: "A Bill of Quantities is a detailed document that lists all the materials, labour, and quantities needed to build the plan. It allows you to get accurate quotations from contractors, compare bids fairly, and manage your construction budget effectively. It is one of the most practical add-ons for anyone actively planning to build.",
      },
      {
        q: "Can I order add-ons after I've already purchased a plan?",
        a: "Yes. Log into your account, navigate to your order history, and select the plan you want to enhance. Add-on options will be available to purchase independently. Alternatively, email our support team with your order number and the add-on you need.",
      },
      {
        q: "How long does it take to receive add-on documents?",
        a: "Delivery times vary by add-on. 3D renders typically take 3–5 business days. Structural and MEP drawings take 5–7 business days. BOQ documents take 3–5 business days. Timelines are confirmed at the point of purchase and you'll receive progress updates.",
      },
    ],
  },
  {
    id: "custom",
    icon: Wrench,
    label: "Custom Design Projects",
    accent: "#5F9EA0",
    accentDim: "rgba(95,158,160,0.12)",
    accentBorder: "rgba(95,158,160,0.2)",
    questions: [
      {
        q: "What is a custom design project?",
        a: "A custom design project is a fully bespoke architectural commission. You brief our team on your plot, budget, preferred style, and room requirements, and we design a plan from scratch specifically for your project — nothing from the catalogue.",
      },
      {
        q: "How do I start a custom project?",
        a: "Fill in our Custom Design Request form on the Contact page or email us directly. Share your plot size, budget range, desired style, bedroom count, and any special features. Our team will respond within one business day with a project proposal and fee structure.",
      },
      {
        q: "How long does a custom project take?",
        a: "Timelines depend on complexity. A standard residential custom project typically takes 3–6 weeks from briefing to final documentation delivery. Multi-unit or complex projects may take longer. Your project manager will provide a clear timeline at the start.",
      },
      {
        q: "Can I make changes after seeing the initial concept?",
        a: "Yes — the custom workflow includes a refinement stage. You receive concept drawings first, provide feedback, and we revise before proceeding to final documentation. The number of revision rounds included is outlined in your project agreement.",
      },
      {
        q: "What do I need to provide for a custom project?",
        a: "At minimum: your plot survey or title deed (showing dimensions and orientation), your budget range, preferred number of rooms, and any style references or inspirational images. The more context you share, the better we can align the design to your vision.",
      },
    ],
  },
  {
    id: "construction",
    icon: HardHat,
    label: "Construction Support",
    accent: "#8FBC8F",
    accentDim: "rgba(143,188,143,0.12)",
    accentBorder: "rgba(143,188,143,0.2)",
    questions: [
      {
        q: "Do you offer site supervision services?",
        a: "Yes. We offer architectural site supervision to ensure your build follows the approved drawings accurately. This is especially important for clients who are not based near the construction site. Contact us with your location and project scope for a supervision quote.",
      },
      {
        q: "Can you help me find a reliable contractor?",
        a: "While we don't directly employ contractors, we can refer you to vetted, NCA-registered contractors from our professional network based on your location and project type. This referral service is available to clients who have purchased plans through our platform.",
      },
      {
        q: "My plot is different from the standard plan. Can you adapt it?",
        a: "Absolutely — that's exactly what our Site Adaptation service is for. We modify the purchased plan to suit your specific plot dimensions, orientation, setbacks, and topography. This is the most common post-purchase service we provide.",
      },
      {
        q: "Can I modify rooms or the layout after purchasing?",
        a: "Yes. We offer room adjustment and layout modification services for purchased plans. Common requests include adding a room, changing a facade, adjusting window positions, or combining two bedrooms into one. Contact us with your modification requirements and we'll provide a quote.",
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useVisible(threshold = 0.08) {
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
        aria-hidden="true"
        style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#8FBC8F", boxShadow: "0 0 6px #8FBC8F",
          display: "inline-block", flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8FBC8F" }}>
        {children}
      </span>
    </div>
  );
}

// ─── Single FAQ item ──────────────────────────────────────────────────────────
function FaqItem({
  q, a, accent, accentBorder, isOpen, onToggle, index,
}: {
  q: string; a: string; accent: string; accentBorder: string;
  isOpen: boolean; onToggle: () => void; index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        background: isOpen
          ? `rgba(13,27,30,0.9)`
          : hovered ? "rgba(15,76,92,0.08)" : "rgba(13,27,30,0.5)",
        border: `1px solid ${isOpen ? accentBorder : hovered ? "rgba(95,158,160,0.18)" : "rgba(95,158,160,0.08)"}`,
        overflow: "hidden",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, padding: "1.1rem 1.4rem", cursor: "pointer",
          background: "transparent", border: "none",
        }}
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.4,
            color: isOpen ? "#F5F7F2" : hovered ? "#F5F7F2" : "#b0bec5",
            transition: "color 0.2s ease",
          }}
        >
          {q}
        </span>
        <span
          style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isOpen ? accentBorder : "rgba(95,158,160,0.08)",
            border: `1px solid ${isOpen ? accentBorder : "rgba(95,158,160,0.12)"}`,
            transition: "background 0.25s, border-color 0.25s",
          }}
          aria-hidden="true"
        >
          {isOpen
            ? <Minus style={{ width: 14, height: 14, color: accent }} />
            : <Plus style={{ width: 14, height: 14, color: "#5F9EA0" }} />
          }
        </span>
      </button>

      {/* Animated answer */}
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? (contentRef.current?.scrollHeight ?? 500) + "px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          style={{
            padding: "0 1.4rem 1.25rem",
            borderTop: `1px solid ${accentBorder}`,
            paddingTop: "1rem",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "#94a3a8", lineHeight: 1.8 }}>
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Category block ───────────────────────────────────────────────────────────
function CategoryBlock({
  category, visible, catIndex,
}: {
  category: typeof FAQ_CATEGORIES[number]; visible: boolean; catIndex: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const Icon = category.icon;

  return (
    <div
      id={`cat-${category.id}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s ease ${catIndex * 80 + 100}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${catIndex * 80 + 100}ms`,
      }}
    >
      {/* Category header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: category.accentDim,
            border: `1px solid ${category.accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <Icon style={{ width: 18, height: 18, color: category.accent }} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.05rem", fontWeight: 700,
              color: "#F5F7F2", letterSpacing: "-0.01em",
            }}
          >
            {category.label}
          </h2>
          <p style={{ fontSize: "0.75rem", color: category.accent, fontWeight: 600 }}>
            {category.questions.length} questions
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${category.accentBorder}, transparent)`,
          marginBottom: "1rem",
        }}
        aria-hidden="true"
      />

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {category.questions.map((item, i) => (
          <FaqItem
            key={i}
            q={item.q}
            a={item.a}
            accent={category.accent}
            accentBorder={category.accentBorder}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function FAQsPage() {
  const heroVis = useVisible(0.1);
  const navVis = useVisible(0.05);
  const mainVis = useVisible(0.03);
  const ctaVis = useVisible(0.15);
  const [activeCategory, setActiveCategory] = useState("about");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ catLabel: string; q: string; a: string; catId: string }[]>([]);

  // Search handler
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results: typeof searchResults = [];
    for (const cat of FAQ_CATEGORIES) {
      for (const item of cat.questions) {
        if (item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)) {
          results.push({ catLabel: cat.label, q: item.q, a: item.a, catId: cat.id });
        }
      }
    }
    setSearchResults(results);
  }, [searchQuery]);

  const totalQuestions = FAQ_CATEGORIES.reduce((acc, c) => acc + c.questions.length, 0);

  return (
    <main style={{ background: "#0A1418", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          paddingTop: "clamp(6rem,12vw,10rem)",
          paddingBottom: "clamp(3rem,6vw,5rem)",
          background: "#0D1B1E",
        }}
      >
        <BlueprintGrid />
        <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "15%", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(15,76,92,0.3) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: 0, right: "5%", width: 400, height: 350, background: "radial-gradient(ellipse, rgba(85,107,47,0.18) 0%, transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />

        <div
          ref={heroVis.ref}
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
          }}
        >
          <div
            style={{
              opacity: heroVis.visible ? 1 : 0,
              transform: heroVis.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.75s ease, transform 0.75s ease",
              maxWidth: 720,
            }}
          >
            <Eyebrow>Help Centre</Eyebrow>

            <h1
              style={{
                fontSize: "clamp(2.2rem,5vw,4rem)",
                fontWeight: 800, color: "#F5F7F2",
                lineHeight: 1.06, letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Frequently Asked
              <br />
              <span style={{ color: "#5F9EA0" }}>Questions.</span>
            </h1>

            <p
              style={{
                color: "#94a3a8", fontSize: "1rem",
                lineHeight: 1.75, marginBottom: "2rem", maxWidth: 520,
              }}
            >
              Everything you need to know about our plans, process, payments, and support.{" "}
              <span style={{ color: "#8FBC8F", fontWeight: 600 }}>{totalQuestions} answers</span>{" "}
              across {FAQ_CATEGORIES.length} categories — or search below.
            </p>

            {/* Search bar */}
            <div style={{ position: "relative", maxWidth: 480 }}>
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)",
                  color: "#5F9EA0",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search questions…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                  borderRadius: 12, fontSize: "0.9rem",
                  background: "rgba(13,27,30,0.8)",
                  border: "1px solid rgba(95,158,160,0.2)",
                  color: "#F5F7F2", outline: "none",
                  boxShadow: "0 0 0 0 rgba(95,158,160,0)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "rgba(95,158,160,0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(95,158,160,0.1)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "rgba(95,158,160,0.2)";
                  e.target.style.boxShadow = "0 0 0 0 rgba(95,158,160,0)";
                }}
                aria-label="Search frequently asked questions"
              />
            </div>
          </div>

          {/* Search results */}
          {searchQuery.trim() && (
            <div
              style={{
                marginTop: "1.5rem",
                maxWidth: 720,
                borderRadius: 16,
                background: "rgba(13,27,30,0.9)",
                border: "1px solid rgba(95,158,160,0.15)",
                overflow: "hidden",
              }}
            >
              {searchResults.length === 0 ? (
                <div style={{ padding: "1.5rem", color: "#94a3a8", fontSize: "0.875rem" }}>
                  No results for &ldquo;{searchQuery}&rdquo; — try a different term or browse the categories below.
                </div>
              ) : (
                <div>
                  <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(95,158,160,0.1)" }}>
                    <p style={{ fontSize: "0.75rem", color: "#5F9EA0", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {searchResults.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1rem 1.25rem",
                        borderBottom: i < searchResults.length - 1 ? "1px solid rgba(95,158,160,0.08)" : "none",
                      }}
                    >
                      <p style={{ fontSize: "0.7rem", color: "#8FBC8F", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                        {r.catLabel}
                      </p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#F5F7F2", marginBottom: 6 }}>{r.q}</p>
                      <p style={{ fontSize: "0.825rem", color: "#94a3a8", lineHeight: 1.65 }}>
                        {r.a.length > 180 ? r.a.slice(0, 180) + "…" : r.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CATEGORY NAV PILLS
      ══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "sticky", top: 0, zIndex: 50,
          borderBottom: "1px solid rgba(95,158,160,0.1)",
          background: "rgba(10,20,24,0.95)",
          backdropFilter: "blur(16px)",
          overflowX: "auto",
        }}
      >
        <div
          ref={navVis.ref}
          style={{
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.75rem clamp(1.25rem,4vw,3rem)",
            opacity: navVis.visible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {FAQ_CATEGORIES.map(cat => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 20, flexShrink: 0,
                  fontSize: "0.78rem", fontWeight: 600,
                  cursor: "pointer",
                  background: isActive ? cat.accentDim : "transparent",
                  border: `1px solid ${isActive ? cat.accentBorder : "transparent"}`,
                  color: isActive ? cat.accent : "#94a3a8",
                  transition: "background 0.2s, border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#F5F7F2";
                    (e.currentTarget as HTMLElement).style.background = "rgba(95,158,160,0.06)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#94a3a8";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <CatIcon style={{ width: 13, height: 13 }} aria-hidden="true" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN FAQ GRID
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          paddingTop: "clamp(3rem,6vw,5rem)",
          paddingBottom: "clamp(4rem,8vw,7rem)",
        }}
      >
        <BlueprintGrid />
        <div aria-hidden="true" style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 900, height: 600, background: "radial-gradient(ellipse, rgba(15,76,92,0.1) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div
          ref={mainVis.ref}
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1280, margin: "0 auto",
            paddingLeft: "clamp(1.25rem,4vw,3rem)",
            paddingRight: "clamp(1.25rem,4vw,3rem)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 560px), 1fr))",
            gap: "clamp(2.5rem,5vw,4rem) clamp(2rem,4vw,5rem)",
          }}
        >
          {FAQ_CATEGORIES.map((cat, i) => (
            <CategoryBlock
              key={cat.id}
              category={cat}
              visible={mainVis.visible}
              catIndex={i}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STILL HAVE QUESTIONS — CTA
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          paddingTop: "clamp(3rem,6vw,5rem)",
          paddingBottom: "clamp(4rem,8vw,6rem)",
          background: "#0D1B1E",
        }}
      >
        <BlueprintGrid />
        <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(15,76,92,0.22) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div
          ref={ctaVis.ref}
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
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "clamp(2rem,4vw,4rem)",
              alignItems: "center",
              backdropFilter: "blur(12px)",
              overflow: "hidden",
              opacity: ctaVis.visible ? 1 : 0,
              transform: ctaVis.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* Left text */}
            <div>
              <Eyebrow>Still Have Questions?</Eyebrow>
              <h2
                style={{
                  fontSize: "clamp(1.5rem,3vw,2.2rem)",
                  fontWeight: 800, color: "#F5F7F2",
                  letterSpacing: "-0.02em", lineHeight: 1.1,
                  marginBottom: "0.75rem",
                }}
              >
                We&apos;re Here
                <span style={{ color: "#5F9EA0" }}> to Help.</span>
              </h2>
              <p style={{ color: "#94a3a8", fontSize: "0.9rem", lineHeight: 1.75, maxWidth: 360 }}>
                Can&apos;t find what you&apos;re looking for? Our team responds to every enquiry within one business day. No bots — real architects and support staff.
              </p>
            </div>

            {/* Right — two contact cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  icon: MessageSquare,
                  title: "Send us a message",
                  desc: "Use our contact form and we'll get back to you within 24 hours.",
                  href: "/contact",
                  label: "Contact Us",
                  accent: "#5F9EA0",
                  accentDim: "rgba(95,158,160,0.12)",
                  accentBorder: "rgba(95,158,160,0.2)",
                },
                {
                  icon: FileText,
                  title: "Browse all plans",
                  desc: "Still deciding? Explore our full catalogue with filters.",
                  href: "/plans",
                  label: "View Plans",
                  accent: "#8FBC8F",
                  accentDim: "rgba(143,188,143,0.12)",
                  accentBorder: "rgba(143,188,143,0.2)",
                },
              ].map((card, i) => {
                const CardIcon = card.icon;
                const [ch, setCh] = useState(false);
                return (
                  <Link
                    key={i}
                    href={card.href}
                    onMouseEnter={() => setCh(true)}
                    onMouseLeave={() => setCh(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "1rem 1.25rem", borderRadius: 14,
                      background: ch ? card.accentDim : "rgba(13,27,30,0.5)",
                      border: `1px solid ${ch ? card.accentBorder : "rgba(95,158,160,0.1)"}`,
                      textDecoration: "none",
                      transition: "background 0.25s, border-color 0.25s",
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: ch ? card.accentDim : "rgba(95,158,160,0.08)",
                        border: `1px solid ${ch ? card.accentBorder : "rgba(95,158,160,0.12)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.25s, border-color 0.25s",
                      }}
                      aria-hidden="true"
                    >
                      <CardIcon style={{ width: 18, height: 18, color: card.accent }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F5F7F2", marginBottom: 2 }}>
                        {card.title}
                      </p>
                      <p style={{ fontSize: "0.775rem", color: "#94a3a8", lineHeight: 1.5 }}>
                        {card.desc}
                      </p>
                    </div>
                    <ArrowRight
                      style={{
                        width: 16, height: 16, flexShrink: 0,
                        color: ch ? card.accent : "#94a3a8",
                        transform: ch ? "translateX(3px)" : "translateX(0)",
                        transition: "color 0.2s, transform 0.2s",
                      }}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
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