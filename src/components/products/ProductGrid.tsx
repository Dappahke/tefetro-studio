// src/components/products/ProductGrid.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { Grid3X3, LayoutList, SlidersHorizontal } from "lucide-react";

interface Product {
  id: string;
  slug?: string;
  title: string;
  price: number;
  category: string | null;
  elevation_images?: string[] | null;
  bedrooms?: number;
  bathrooms?: number;
  plinth_area?: number;
}

interface ProductGridProps {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export function ProductGrid({ products, total, limit, offset }: ProductGridProps) {
  const searchParams = useSearchParams();

  const hasMore = total > offset + limit;
  const showingStart = total === 0 ? 0 : offset + 1;
  const showingEnd = Math.min(offset + products.length, total);
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function buildPageLink(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", String((page - 1) * limit));
    params.set("limit", String(limit));
    return `/products?${params.toString()}`;
  }

  if (products.length === 0) {
    return (
      <section id="products-grid" className="card p-12 md:p-16 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-blueprint-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blueprint-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7l1 11h12l1-11M9 11v4m6-4v4" />
          </svg>
        </div>

        <h3 className="font-sans text-h3 text-blueprint-900">No plans found</h3>
        <p className="text-body text-blueprint-600/70 mt-3 max-w-md mx-auto">
          Try adjusting your filters or search terms to discover available architectural plans.
        </p>

        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Browse All Plans
        </Link>
      </section>
    );
  }

  return (
    <section id="products-grid" className="space-y-10">
      {/* ─── Header: Minimal, Informative ─── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="badge-blueprint">
              {total.toLocaleString()} Plans
            </span>
            <span className="text-caption text-blueprint-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <h2 className="font-sans text-h2 text-blueprint-900 text-balance">
            Architectural Plans
          </h2>
          
          <p className="text-body text-blueprint-600/70">
            Showing <span className="font-semibold text-blueprint-800">{showingStart}–{showingEnd}</span> of{" "}
            <span className="font-semibold text-blueprint-800">{total.toLocaleString()}</span> ready-to-build designs
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button 
            className="p-2.5 rounded-xl bg-blueprint-600 text-white transition-all"
            aria-label="Grid view"
          >
            <Grid3X3 size={18} />
          </button>
          <button 
            className="p-2.5 rounded-xl bg-white border border-blueprint-200 text-blueprint-400 hover:bg-blueprint-50 transition-all"
            aria-label="List view"
          >
            <LayoutList size={18} />
          </button>
          <div className="w-px h-6 bg-blueprint-200 mx-1" />
          <button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-blueprint-200 text-sm font-medium text-blueprint-700 hover:bg-blueprint-50 transition-all"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* ─── Product Grid: 3 Per Row, Square, Tight Gap ─── */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 3}
          />
        ))}
      </div>

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-blueprint-100">
          {/* Previous */}
          {currentPage > 1 ? (
            <Link
              href={buildPageLink(currentPage - 1)}
              className="btn-ghost w-full sm:w-auto justify-center"
            >
              ← Previous
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-canvas-200 text-blueprint-300 font-medium cursor-not-allowed w-full sm:w-auto">
              ← Previous
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1.5">
            {currentPage > 3 && (
              <>
                <Link href={buildPageLink(1)} className="page-btn">
                  1
                </Link>
                {currentPage > 4 && <span className="px-2 text-blueprint-300">…</span>}
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages)
              .filter((page, i, arr) => i === 0 || page - arr[i - 1] <= 2)
              .map(page => (
                <Link
                  key={page}
                  href={buildPageLink(page)}
                  className={cn(
                    "h-10 min-w-[40px] px-3 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200",
                    page === currentPage
                      ? "bg-blueprint-600 text-white shadow-md shadow-blueprint-600/20"
                      : "bg-white border border-blueprint-200 text-blueprint-700 hover:bg-blueprint-50 hover:border-blueprint-300"
                  )}
                >
                  {page}
                </Link>
              ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="px-2 text-blueprint-300">…</span>}
                <Link href={buildPageLink(totalPages)} className="page-btn">
                  {totalPages}
                </Link>
              </>
            )}
          </div>

          {/* Next */}
          {hasMore ? (
            <Link
              href={buildPageLink(currentPage + 1)}
              className="btn-primary w-full sm:w-auto justify-center"
            >
              Next →
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-canvas-200 text-blueprint-300 font-medium cursor-not-allowed w-full sm:w-auto">
              Next →
            </span>
          )}
        </div>
      )}

      {/* ─── Trust Bar ─── */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-caption text-blueprint-400">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Secure Checkout
        </span>
        <span className="w-1 h-1 rounded-full bg-blueprint-300" />
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Instant Download
        </span>
        <span className="w-1 h-1 rounded-full bg-blueprint-300" />
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          M-Pesa Accepted
        </span>
      </div>
    </section>
  );
}

// Helper
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}