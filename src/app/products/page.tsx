// src/app/products/page.tsx
import { Suspense } from "react";
import { Metadata, Viewport } from "next";
import Link from "next/link";

import { fetchProducts, fetchRandomElevationImages } from "@/lib/dal";

import { HeroSlideshow } from "@/components/products/HeroSlideshow";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSearch } from "@/components/products/ProductSearch";
import { FilterBar } from "@/components/products/FilterBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const SITE_URL = "https://tefetro.studio";

/* ─── SEO: Metadata ─── */
export async function generateViewport(): Promise<Viewport> {
  return {
    themeColor: "#1f4e79",
    width: "device-width",
    initialScale: 1,
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;

  const category = typeof params.category === "string" ? params.category : "";
  const query = typeof params.q === "string" ? params.q : "";
  const bedrooms = typeof params.bedrooms === "string" ? params.bedrooms : "";

  let title = "House Plans Kenya | Architectural Designs | Tefetro Studios";
  if (category) {
    title = `${category} House Plans Kenya | Tefetro Studios`;
  } else if (bedrooms) {
    title = `${bedrooms} Bedroom House Plans Kenya | Tefetro Studios`;
  } else if (query) {
    title = `${query} House Plans Kenya | Tefetro Studios`;
  }

  const description =
    "Buy premium architectural house plans in Kenya. Maisonettes, bungalows, apartments & commercial buildings. Licensed Kenyan architects. Instant digital delivery.";

  const cleanParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (typeof v === "string" && v.trim()) cleanParams.set(k, v);
  });
  const canonical =
    cleanParams.toString() > ""
      ? `${SITE_URL}/products?${cleanParams.toString()}`
      : `${SITE_URL}/products`;

  return {
    title,
    description,
    alternates: { canonical },
    keywords: [
      "house plans Kenya",
      "architectural plans Kenya",
      "maisonette plans",
      "bungalow plans",
      "apartment plans",
      "commercial building plans",
      "building drawings Kenya",
      "residential architecture",
      "Tefetro Studios",
      "Nairobi architects",
    ],
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Tefetro Studios",
      locale: "en_KE",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-products.jpg`,
          width: 1200,
          height: 630,
          alt: "Premium architectural house plans available in Kenya",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-products.jpg`],
    },
  };
}

/* ─── SEO: Schema.org Structured Data ─── */
function buildSchema(products: any[], total: number, category?: string) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category ? `${category} House Plans Kenya` : "House Plans Kenya",
    url: `${SITE_URL}/products`,
    description:
      "Premium architectural house plans for sale in Kenya. Instant download.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: products.slice(0, 12).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: item.title,
          image: item.cover_image,
          description: item.description?.slice(0, 160),
          offers: {
            "@type": "Offer",
            price: item.price,
            priceCurrency: "KES",
            availability:
              item.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/products/${item.slug}`,
          },
          brand: {
            "@type": "Brand",
            name: "Tefetro Studios",
          },
        },
      })),
    },
  };

  schema.breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category ? `${category} Plans` : "House Plans",
        item: `${SITE_URL}/products`,
      },
    ],
  };

  schema.provider = {
    "@type": "Organization",
    name: "Tefetro Studios",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.instagram.com/tefetrostudios",
      "https://www.linkedin.com/company/tefetro-studios",
    ],
  };

  return schema;
}

/* ─── Page ─── */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const [{ products, total, limit, offset }, heroImages] = await Promise.all([
    fetchProducts(params),
    fetchRandomElevationImages(6),
  ]);

  const hasFilters = Object.keys(params).length > 0;
  const category = typeof params.category === "string" ? params.category : undefined;

  return (
    <main className="min-h-screen bg-canvas-100">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildSchema(products, total, category)),
        }}
      />

      {/* ─── Hero ─── */}
      <HeroSlideshow images={heroImages} />

      {/* ─── Main Content: Sidebar + Grid Layout ─── */}
      <section className="section-inner py-10 md:py-14">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <p className="text-caption uppercase tracking-widest text-blueprint-400 font-semibold">
              Premium Catalogue
            </p>

            <h1 className="font-sans text-h1 text-blueprint-900 text-balance">
              {category ? `${category} Plans` : "Architectural Plans"}
            </h1>

            <p className="text-body text-blueprint-600/80">
              {total.toLocaleString()} ready-to-build designs available
            </p>
          </div>

          {hasFilters && (
            <Link
              href="/products"
              className="btn-ghost shrink-0"
              aria-label="Clear all filters"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </Link>
          )}
        </div>

        {/* ─── Two Column Layout: Sidebar Left, Grid Right ─── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* ─── Left Sidebar: Search + Filters ─── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-6">
            {/* Search */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-blueprint-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blueprint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Plans
              </h3>
              <Suspense
                fallback={
                  <div className="h-12 rounded-xl bg-canvas-200 animate-pulse" />
                }
              >
                <ProductSearch />
              </Suspense>
            </div>

            {/* Filters */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-blueprint-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blueprint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </h3>
              <FilterBar />
            </div>

            {/* Help Card */}
            <div className="card p-5 bg-gradient-to-br from-blueprint-50 to-canvas-100 border-blueprint-200">
              <h4 className="text-sm font-semibold text-blueprint-900 mb-2">Need Help?</h4>
              <p className="text-xs text-blueprint-600/70 mb-4 leading-relaxed">
                Can't find what you're looking for? Our team can help you find the perfect plan.
              </p>
              <Link href="/contact" className="btn-secondary w-full justify-center text-sm py-2.5">
                Talk to an Expert
              </Link>
            </div>
          </aside>

          {/* ─── Right Content: Product Grid ─── */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <Suspense fallback={<GridSkeleton />}>
                  <ProductGrid
                    products={products}
                    total={total}
                    limit={limit}
                    offset={offset}
                  />
                </Suspense>

                {total > limit && (
                  <div className="flex justify-center mt-12">
                    <button className="btn-secondary" aria-label="Load more products">
                      Load More Plans
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Breadcrumb ─── */}
      <section className="section-inner pb-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            ...(category ? [{ label: category, href: `/products?category=${category}` }] : []),
          ]}
        />
      </section>

      {/* ─── CTA: Custom Design ─── */}
      <section className="bg-structural">
        <div className="section-inner section-compact text-center">
          <p className="text-caption uppercase tracking-widest text-blueprint-300 font-semibold">
            Need Something Unique?
          </p>

          <h2 className="font-sans text-h1 text-white mt-3 text-balance max-w-3xl mx-auto">
            Request a Custom Design
          </h2>

          <p className="text-body-lg text-blueprint-200/80 mt-4 max-w-xl mx-auto">
            Bespoke architectural plans tailored to your plot, budget, and lifestyle.
          </p>

          <Link href="/contact" className="btn-accent mt-8 inline-flex">
            Book Consultation
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ─── Skeleton ─── */
function GridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="card h-80 animate-pulse bg-canvas-200 rounded-2xl"
        />
      ))}
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <div className="card p-12 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-blueprint-50 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-blueprint-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <h3 className="font-sans text-h3 text-blueprint-900">
        No plans found
      </h3>

      <p className="text-body text-blueprint-600/70 mt-2">
        Try adjusting your filters or search terms.
      </p>

      <Link href="/products" className="btn-primary mt-6 inline-flex">
        Browse All Plans
      </Link>
    </div>
  );
}