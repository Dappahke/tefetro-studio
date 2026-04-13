// src/components/sections/FeaturedPlans.tsx
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/lib/dal";
import { ArrowUpRight, Bed, Bath, Square } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  price: number | null;
  image_url?: string | null;
  elevation_images?: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  plinth_area: number | null;
  category?: string | null;
}

function formatPrice(price: number | null): string {
  if (!price) return "Price on request";
  return `KES ${price.toLocaleString()}`;
}

function formatArea(area: number | null): string {
  if (!area) return "N/A";
  return `${area} m²`;
}

// Helper to fix image URLs - handles relative paths from Supabase
function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // If already absolute URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If starts with /, return as-is
  if (path.startsWith('/')) {
    return path;
  }

  // Otherwise, prepend / to make it relative to public folder
  return `/${path}`;
}

export default async function FeaturedPlans() {
  const { products } = await fetchProducts({
    limit: "6",
  });

  if (!products || products.length === 0) {
    return (
      <section className="py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#666]">No plans available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-20 sm:py-28 bg-[#FAF9F6]"
      aria-labelledby="featured-plans-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <p className="text-[#e66b00] font-semibold text-sm tracking-wider uppercase mb-3">
            Featured Collection
          </p>
          <h2 
            id="featured-plans-heading"
            className="text-3xl sm:text-4xl font-bold text-[#222] mb-4"
          >
            Popular House Plans
          </h2>
          <p className="text-[#666] max-w-2xl mx-auto">
            Explore affordable and modern house designs tailored for Kenyan plots.
          </p>
        </header>

        <div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Featured house plans"
        >
          {products.map((plan: Product) => {
            const imageSrc = getImageUrl(plan.image_url) || 
                            (plan.elevation_images && plan.elevation_images.length > 0 
                              ? getImageUrl(plan.elevation_images[0]) 
                              : null);

            return (
              <article 
                key={plan.id}
                className="group relative bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#0f2a44]/8 hover:-translate-y-2 hover:border-[#1f4e79]/20"
                role="listitem"
                itemScope
                itemType="https://schema.org/Product"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eaf3fb]">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`${plan.title} - Architectural house plan Kenya`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#eaf3fb]">
                      <span className="text-[#4f86c6] text-sm font-medium">No Image</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  {plan.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-[#1f4e79] text-xs font-semibold rounded-full">
                        {plan.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Title & Price */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 
                      className="text-lg font-bold text-[#222] group-hover:text-[#1f4e79] transition-colors line-clamp-1"
                      itemProp="name"
                    >
                      {plan.title}
                    </h3>
                    <div 
                      className="text-[#e66b00] font-bold whitespace-nowrap"
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <meta itemProp="price" content={plan.price?.toString() || "0"} />
                      <meta itemProp="priceCurrency" content="KES" />
                      <meta itemProp="availability" content="https://schema.org/InStock" />
                      <span>{formatPrice(plan.price)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p 
                    className="text-sm text-[#666] mb-4 line-clamp-2"
                    itemProp="description"
                  >
                    {plan.description || "Complete architectural drawings with floor plans and elevations."}
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-sm text-[#666] mb-5">
                    {plan.bedrooms !== null && plan.bedrooms > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-[#1f4e79]" aria-hidden="true" />
                        <span>{plan.bedrooms} Beds</span>
                      </div>
                    )}
                    {plan.bathrooms !== null && plan.bathrooms > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-[#1f4e79]" aria-hidden="true" />
                        <span>{plan.bathrooms} Baths</span>
                      </div>
                    )}
                    {plan.plinth_area !== null && plan.plinth_area > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Square className="w-4 h-4 text-[#1f4e79]" aria-hidden="true" />
                        <span>{formatArea(plan.plinth_area)}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link 
                    href={`/products/${plan.slug || plan.id}`}
                    className="w-full group/btn flex items-center justify-center gap-2 py-3 px-4 bg-[#f8f9fa] hover:bg-[#1f4e79] text-[#222] hover:text-white rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1f4e79] focus:ring-offset-2"
                    aria-label={`View details for ${plan.title}`}
                  >
                    <span>View Plan Details</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" aria-hidden="true" />
                  </Link>
                </div>

                {/* Hover Gradient Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e66b00] to-[#ff7f00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" aria-hidden="true" />
              </article>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-[#1f4e79] font-semibold hover:text-[#e66b00] transition-colors"
          >
            View All Plans
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}