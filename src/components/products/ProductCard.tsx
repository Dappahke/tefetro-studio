// src/components/products/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BedIcon, BathIcon, AreaIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  slug?: string | null;
  title: string;
  price: number;
  category: string | null;
  elevation_images?: string[] | null;
  bedrooms?: number;
  bathrooms?: number;
  plinth_area?: number;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const href = `/products/${product.slug || product.id}`;

  const imageUrl = useMemo(() => {
    const first = product.elevation_images?.[0];
    if (!first) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings${first.startsWith("/") ? "" : "/"}${first}`;
  }, [product.elevation_images]);

  const specs = [
    { icon: BedIcon, value: product.bedrooms, label: "Beds" },
    { icon: BathIcon, value: product.bathrooms, label: "Baths" },
    { icon: AreaIcon, value: product.plinth_area, label: "m²" },
  ].filter((item) => item.value !== null && item.value !== undefined);

  return (
    <Link href={href} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-2xl bg-white",
          "border border-blueprint-100",
          "shadow-sm transition-all duration-500",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-blueprint-900/10",
          "focus-within:ring-2 focus-within:ring-blueprint-400"
        )}
      >
        {/* ─── Image Section: Square ─── */}
        <div className="relative aspect-square overflow-hidden bg-canvas-200">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={() => setImageError(true)}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-blueprint-300">
              <svg className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7h16M5 7l1 12h12l1-12" />
              </svg>
              <span className="mt-2 text-sm">No Preview</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-blueprint-900/0 group-hover:bg-blueprint-900/10 transition-all duration-500" />

          {/* Category badge */}
          {product.category && (
            <div className="absolute left-3 top-3">
              <span className="badge-blueprint text-xs">
                {product.category}
              </span>
            </div>
          )}

          {/* Price — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-blueprint-900/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-white font-bold text-lg">
              KES {product.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ─── Body: Compact ─── */}
        <div className="p-3">
          {/* Title */}
          <h3 className="font-semibold text-blueprint-900 text-sm group-hover:text-blueprint-700 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Specs row */}
          {specs.length > 0 && (
            <div className="flex items-center gap-2 mt-1.5 text-xs text-blueprint-500">
              {specs.map((spec, i) => (
                <span key={spec.label} className="flex items-center gap-1">
                  {i > 0 && <span className="text-blueprint-200">·</span>}
                  <spec.icon size={12} />
                  <span>{spec.value} {spec.label}</span>
                </span>
              ))}
            </div>
          )}

          {/* CTA hint */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-blueprint-50">
            <span className="text-xs text-blueprint-400">View details</span>
            <span className="text-blueprint-600 group-hover:text-accent-500 transition-colors">
              →
            </span>
          </div>
        </div>

        {/* ─── Bottom accent line ─── */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blueprint-600 via-deep-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </article>
    </Link>
  );
}