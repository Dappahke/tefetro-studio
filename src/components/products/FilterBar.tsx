// src/components/products/FilterBar.tsx
"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Home, Building2, Factory, Landmark, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
}

const categories: FilterOption[] = [
  { value: "", label: "All Plans" },
  { value: "residential", label: "Residential", icon: Home },
  { value: "commercial", label: "Commercial", icon: Building2 },
  { value: "industrial", label: "Industrial", icon: Factory },
  { value: "institutional", label: "Institutional", icon: Landmark },
];

const bedrooms: FilterOption[] = [
  { value: "", label: "Any" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Beds" },
  { value: "3", label: "3 Beds" },
  { value: "4", label: "4 Beds" },
  { value: "5", label: "5+ Beds" },
];

const budgetRanges: FilterOption[] = [
  { value: "", label: "Any Budget" },
  { value: "0-50000", label: "Under KES 50K" },
  { value: "50000-150000", label: "KES 50K – 150K" },
  { value: "150000-300000", label: "KES 150K – 300K" },
  { value: "300000+", label: "KES 300K+" },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "";
  const currentBedrooms = searchParams.get("bedrooms") || "";
  const currentBudget = searchParams.get("budget") || "";

  const hasFilters = currentCategory || currentBedrooms || currentBudget;

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("offset");
      startTransition(() => {
        router.replace(`/products?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("bedrooms");
    params.delete("budget");
    params.delete("offset");
    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className={cn("space-y-6", isPending && "opacity-70")}>
      {/* Active Filters Summary */}
      {hasFilters && (
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blueprint-100 text-blueprint-700 text-xs font-medium">
                {categories.find(c => c.value === currentCategory)?.label}
                <button onClick={() => updateFilter("category", "")} className="hover:text-blueprint-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {currentBedrooms && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-deep-100 text-deep-700 text-xs font-medium">
                {bedrooms.find(b => b.value === currentBedrooms)?.label}
                <button onClick={() => updateFilter("bedrooms", "")} className="hover:text-deep-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {currentBudget && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-100 text-accent-700 text-xs font-medium">
                {budgetRanges.find(b => b.value === currentBudget)?.label}
                <button onClick={() => updateFilter("budget", "")} className="hover:text-accent-900">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-xs text-blueprint-400 hover:text-blueprint-600 transition-colors font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Property Type */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-blueprint-400">
          Property Type
        </h4>
        <div className="space-y-1">
          {categories.map((item) => {
            const active = currentCategory === item.value;
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                onClick={() => updateFilter("category", item.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-blueprint-600 text-white shadow-sm"
                    : "text-blueprint-700 hover:bg-blueprint-50"
                )}
              >
                {Icon && <Icon size={16} className={active ? "text-white" : "text-blueprint-400"} />}
                <span>{item.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-blueprint-400 flex items-center gap-2">
          <BedDouble size={14} />
          Bedrooms
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {bedrooms.map((item) => {
            const active = currentBedrooms === item.value;
            return (
              <button
                key={item.value}
                onClick={() => updateFilter("bedrooms", item.value)}
                className={cn(
                  "px-2 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-center",
                  active
                    ? "bg-deep-600 text-white shadow-sm"
                    : "bg-white border border-blueprint-200 text-blueprint-600 hover:border-deep-400 hover:bg-deep-50"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-blueprint-400">
          Budget Range
        </h4>
        <div className="space-y-1.5">
          {budgetRanges.map((item) => {
            const active = currentBudget === item.value;
            return (
              <button
                key={item.value}
                onClick={() => updateFilter("budget", item.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                  active
                    ? "bg-accent-500 text-white shadow-sm"
                    : "text-blueprint-600 hover:bg-blueprint-50"
                )}
              >
                <span className="font-medium">{item.label}</span>
                {active && <span className="w-2 h-2 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-blueprint-400">
          Sort By
        </h4>
        <select
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-blueprint-200 text-sm text-blueprint-700 focus:outline-none focus:border-blueprint-400 focus:ring-2 focus:ring-blueprint-400/15 transition-all"
          defaultValue="newest"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="bedrooms">Most Bedrooms</option>
        </select>
      </div>
    </div>
  );
}