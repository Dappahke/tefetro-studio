"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowUpRight, Bed, Bath, Square,
  ChevronLeft, ChevronRight, FileImage, ArrowRight,
} from "lucide-react";

// ─── Palette (mirrors HeroSection) ──────────────────────────────────────────
// Ink:       #0D1B1E   Dark Teal: #0A3A47   Teal:      #0F4C5C
// Light Teal:#5F9EA0   Olive:     #556B2F   Lt Olive:  #8FBC8F
// Cream:     #FAF9F6   Muted:     #94a3a8   White:     #F5F7F2
// ────────────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  price: number | null;
  file_path: string | null;
  elevation_images: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  plinth_area: number | null;
  category: string | null;
}

function formatPrice(price: number | null): string {
  if (!price) return "Price on request";
  return `KES ${price.toLocaleString()}`;
}

function formatArea(area: number | null): string {
  if (!area) return "N/A";
  return `${area} m²`;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

function isImage(path: string | null | undefined): boolean {
  if (!path) return false;
  const lower = path.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function getStorageUrl(fileName: string | null | undefined): string | null {
  if (!fileName) return null;
  if (fileName.startsWith("http://") || fileName.startsWith("https://")) return fileName;
  const clean = fileName.startsWith("/") ? fileName.slice(1) : fileName;
  const fullPath = clean.includes("/") ? clean : `elevations/${clean}`;
  const { data } = supabase.storage.from("drawings").getPublicUrl(fullPath);
  return data?.publicUrl || null;
}

function getFirstImage(plan: Product): string | null {
  if (plan.elevation_images?.length) {
    for (const img of plan.elevation_images.filter(Boolean)) {
      if (isImage(img)) {
        const url = getStorageUrl(img.split("/").pop() || img);
        if (url) return url;
      }
    }
  }
  if (plan.file_path && isImage(plan.file_path)) {
    return getStorageUrl(plan.file_path.split("/").pop() || plan.file_path);
  }
  return null;
}

function shuffleArray<T>(array: T[]): T[] {
  const s = [...array];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function useCarousel(itemCount: number, itemsPerView: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, itemCount - itemsPerView);
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;
  const next = useCallback(() => setCurrentIndex((i) => Math.min(i + 1, maxIndex)), [maxIndex]);
  const prev = useCallback(() => setCurrentIndex((i) => Math.max(i - 1, 0)), []);
  const goTo = useCallback((i: number) => setCurrentIndex(Math.max(0, Math.min(i, maxIndex))), [maxIndex]);
  return { currentIndex, next, prev, goTo, canGoNext, canGoPrev, maxIndex };
}

// ─── CARD ────────────────────────────────────────────────────────────────────
function PlanCard({ plan, index }: { plan: Product; index: number }) {
  const imageSrc = getFirstImage(plan);
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="group relative flex flex-col h-full overflow-hidden"
      style={{
        borderRadius: "18px",
        background: "#0D1B1E",
        border: "1px solid rgba(95,158,160,0.12)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(95,158,160,0.3), 0 24px 60px rgba(0,0,0,0.5)"
          : "0 0 0 1px rgba(95,158,160,0.08), 0 4px 24px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease",
        animationDelay: `${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* ── Image ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "4/3", background: "#0A3A47" }}
      >
        {/* Blueprint grid on image placeholder */}
        {(!imageSrc || imgError) && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage: `
                linear-gradient(rgba(95,158,160,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(95,158,160,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        )}

        {imageSrc && !imgError ? (
          <Image
            src={imageSrc}
            alt={`${plan.title} — Architectural house plan Kenya`}
            fill
            className="object-cover"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <FileImage className="w-10 h-10" style={{ color: "rgba(95,158,160,0.3)" }} />
            <span className="text-xs font-medium" style={{ color: "rgba(95,158,160,0.4)" }}>
              No Preview
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(13,27,30,0.85) 0%, rgba(13,27,30,0.1) 50%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Blueprint corner accents */}
        <div
          className="absolute top-3 right-3 w-6 h-6 pointer-events-none"
          aria-hidden="true"
          style={{ borderTop: "1.5px solid rgba(95,158,160,0.4)", borderRight: "1.5px solid rgba(95,158,160,0.4)" }}
        />
        <div
          className="absolute bottom-3 left-3 w-6 h-6 pointer-events-none"
          aria-hidden="true"
          style={{ borderBottom: "1.5px solid rgba(95,158,160,0.4)", borderLeft: "1.5px solid rgba(95,158,160,0.4)" }}
        />

        {/* Category badge */}
        {plan.category && (
          <div className="absolute top-3 left-3">
            <span
              className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(13,27,30,0.85)",
                color: "#8FBC8F",
                border: "1px solid rgba(143,188,143,0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              {plan.category}
            </span>
          </div>
        )}

        {/* Price — bottom of image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <p
            className="font-bold"
            style={{
              fontSize: "1.05rem",
              color: "#F5F7F2",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {formatPrice(plan.price)}
          </p>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3
          className="font-bold mb-2 line-clamp-1"
          style={{
            fontSize: "1rem",
            color: hovered ? "#5F9EA0" : "#F5F7F2",
            transition: "color 0.25s ease",
          }}
        >
          {plan.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1"
          style={{ color: "#94a3a8" }}
        >
          {plan.description || "Complete architectural drawings with floor plans, elevations and sections."}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {plan.bedrooms != null && plan.bedrooms > 0 && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
              style={{
                background: "rgba(15,76,92,0.2)",
                color: "#5F9EA0",
                border: "1px solid rgba(95,158,160,0.15)",
              }}
            >
              <Bed className="w-3 h-3" aria-hidden="true" />
              {plan.bedrooms} Bed
            </span>
          )}
          {plan.bathrooms != null && plan.bathrooms > 0 && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
              style={{
                background: "rgba(15,76,92,0.2)",
                color: "#5F9EA0",
                border: "1px solid rgba(95,158,160,0.15)",
              }}
            >
              <Bath className="w-3 h-3" aria-hidden="true" />
              {plan.bathrooms} Bath
            </span>
          )}
          {plan.plinth_area != null && plan.plinth_area > 0 && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
              style={{
                background: "rgba(85,107,47,0.15)",
                color: "#8FBC8F",
                border: "1px solid rgba(143,188,143,0.15)",
              }}
            >
              <Square className="w-3 h-3" aria-hidden="true" />
              {formatArea(plan.plinth_area)}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/products/${plan.slug || plan.id}`}
          className="group/btn w-full inline-flex items-center justify-center gap-2 font-semibold text-sm"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            background: hovered
              ? "linear-gradient(135deg, #0F4C5C 0%, #0A3A47 100%)"
              : "rgba(15,76,92,0.12)",
            color: hovered ? "#F5F7F2" : "#5F9EA0",
            border: `1px solid ${hovered ? "rgba(95,158,160,0.4)" : "rgba(95,158,160,0.18)"}`,
            transition: "background 0.3s ease, color 0.3s ease, border-color 0.3s ease",
            boxShadow: hovered ? "0 0 20px rgba(15,76,92,0.3)" : "none",
          }}
        >
          View Plan Details
          <ArrowUpRight
            className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Bottom glow bar on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #0F4C5C, #8FBC8F, #0F4C5C)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
        aria-hidden="true"
      />
    </article>
  );
}

// ─── SKELETON ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        borderRadius: "18px",
        background: "#0D1B1E",
        border: "1px solid rgba(95,158,160,0.08)",
        aspectRatio: "auto",
      }}
    >
      <div style={{ aspectRatio: "4/3", background: "rgba(15,76,92,0.15)" }} className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(95,158,160,0.06) 50%, transparent 100%)",
            animation: "shimmer 1.6s infinite",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      <div className="p-5 space-y-3">
        <div style={{ height: "16px", borderRadius: "6px", background: "rgba(95,158,160,0.08)", width: "70%" }} />
        <div style={{ height: "12px", borderRadius: "6px", background: "rgba(95,158,160,0.06)", width: "100%" }} />
        <div style={{ height: "12px", borderRadius: "6px", background: "rgba(95,158,160,0.06)", width: "80%" }} />
        <div style={{ height: "38px", borderRadius: "10px", background: "rgba(95,158,160,0.07)", marginTop: "16px" }} />
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function FeaturedPlans() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [startX, setStartX] = useState(0);

  const { currentIndex, next, prev, goTo, canGoNext, canGoPrev } = useCarousel(
    products.length,
    itemsPerView
  );

  // Fetch
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, title, slug, description, price, file_path, elevation_images, bedrooms, bathrooms, plinth_area, category"
          )
          .not("slug", "is", null);
        if (error) throw error;
        if (data?.length) {
          setProducts(shuffleArray(data as Product[]).slice(0, 6));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load plans.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Intersection observer for entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#0A1418", paddingTop: "clamp(4rem,8vw,7rem)", paddingBottom: "clamp(4rem,8vw,7rem)" }}
      aria-labelledby="featured-plans-heading"
    >
      {/* ── Blueprint grid ─────────────────────────────────────────────── */}
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

      {/* ── Ambient glows ──────────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse, rgba(15,76,92,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse, rgba(85,107,47,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />

      <div
        className="relative z-10 max-w-7xl mx-auto"
        style={{ paddingLeft: "clamp(1.25rem,4vw,3rem)", paddingRight: "clamp(1.25rem,4vw,3rem)" }}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span
                className="text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
                style={{
                  color: "#8FBC8F",
                  background: "rgba(85,107,47,0.12)",
                  border: "1px solid rgba(143,188,143,0.2)",
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                  style={{ background: "#8FBC8F", boxShadow: "0 0 6px #8FBC8F" }}
                  aria-hidden="true"
                />
                Featured Collection
              </span>
            </div>

            <h2
              id="featured-plans-heading"
              className="font-bold tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#F5F7F2", lineHeight: 1.08 }}
            >
              Popular House
              <span style={{ color: "#5F9EA0" }}> Plans.</span>
            </h2>
            <p className="mt-3 max-w-lg" style={{ color: "#94a3a8", fontSize: "1rem", lineHeight: 1.65 }}>
              Affordable, modern designs tailored for Kenyan plots — instantly downloadable.
            </p>
          </div>

          {/* Nav arrows + View All */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={prev}
              disabled={!canGoPrev}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: canGoPrev ? "rgba(15,76,92,0.2)" : "rgba(148,163,168,0.06)",
                border: `1px solid ${canGoPrev ? "rgba(95,158,160,0.3)" : "rgba(148,163,168,0.1)"}`,
                color: canGoPrev ? "#5F9EA0" : "#94a3a840",
                cursor: canGoPrev ? "pointer" : "not-allowed",
              }}
              aria-label="Previous plans"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={!canGoNext}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: canGoNext ? "rgba(15,76,92,0.2)" : "rgba(148,163,168,0.06)",
                border: `1px solid ${canGoNext ? "rgba(95,158,160,0.3)" : "rgba(148,163,168,0.1)"}`,
                color: canGoNext ? "#5F9EA0" : "#94a3a840",
                cursor: canGoNext ? "pointer" : "not-allowed",
              }}
              aria-label="Next plans"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
              style={{
                color: "#F5F7F2",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(15,76,92,0.2)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(95,158,160,0.3)";
                (e.currentTarget as HTMLElement).style.color = "#5F9EA0";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = "#F5F7F2";
              }}
            >
              View All Plans
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </header>

        {/* ── Carousel ───────────────────────────────────────────────────── */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          {loading ? (
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: itemsPerView }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div
              className="flex items-center justify-center h-48 rounded-2xl"
              style={{ background: "rgba(15,76,92,0.08)", border: "1px solid rgba(95,158,160,0.1)" }}
            >
              <p style={{ color: "#94a3a8" }}>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div
              className="flex items-center justify-center h-48 rounded-2xl"
              style={{ background: "rgba(15,76,92,0.08)", border: "1px solid rgba(95,158,160,0.1)" }}
            >
              <p style={{ color: "#94a3a8" }}>No plans available at the moment.</p>
            </div>
          ) : (
            <>
              <div
                ref={containerRef}
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${products.length}, calc(${100 / itemsPerView}% - ${(6 * (itemsPerView - 1)) / itemsPerView}px))`,
                    transform: `translateX(calc(-${currentIndex} * (100% / ${itemsPerView} + ${6 / itemsPerView}px) ))`,
                    transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                    willChange: "transform",
                    width: `${(products.length / itemsPerView) * 100}%`,
                  }}
                >
                  {products.map((plan, i) => (
                    <PlanCard key={plan.id} plan={plan} index={i} />
                  ))}
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.max(1, products.length - itemsPerView + 1) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-300 focus:outline-none"
                    style={{
                      height: "6px",
                      width: i === currentIndex ? "28px" : "6px",
                      background: i === currentIndex ? "#5F9EA0" : "rgba(95,158,160,0.2)",
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Mobile CTA ─────────────────────────────────────────────────── */}
        <div
          className="mt-10 sm:hidden text-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full"
            style={{
              color: "#5F9EA0",
              border: "1px solid rgba(95,158,160,0.25)",
              background: "rgba(15,76,92,0.1)",
            }}
          >
            View All Plans
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Shimmer keyframes ───────────────────────────────────────────── */}
        <style>{`
          @keyframes shimmer {
            0%   { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes shimmer { 0%, 100% { background-position: 0 0; } }
          }
        `}</style>
      </div>
    </section>
  );
}