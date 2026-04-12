// src/components/sections/FeaturedPlansSection.tsx

import Link from "next/link";
import { fetchProducts } from "@/lib/dal";

export default async function FeaturedPlansSection() {
  // Fetch a limited set of products (featured)
  const { products } = await fetchProducts({
    limit: "6", // limit homepage load
  });

  return (
    <div className="section bg-canvas-subtle">
      <div className="section-inner">

        <h2 className="text-3xl font-semibold">
          Featured House Plans
        </h2>

        <p className="mt-2 text-stone-600">
          Explore affordable and modern house designs tailored for Kenyan plots.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {products?.map((plan: any) => (
            <div
              key={plan.id}
              className="glass rounded-xl p-4 hover:shadow-lg transition"
            >

              {/* IMAGE */}
              <div className="aspect-plan bg-stone-200 rounded-lg overflow-hidden">
                {plan.image_url ? (
                  <img
                    src={plan.image_url}
                    alt={`${plan.title} house plan Kenya`}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {/* CONTENT */}
              <h3 className="mt-4 font-semibold">
                {plan.title}
              </h3>

              <p className="text-sm text-stone-500">
                KES {plan.price?.toLocaleString()}
              </p>

              {/* OPTIONAL META */}
              <div className="text-xs text-stone-400 mt-1">
                {plan.bedrooms && <span>{plan.bedrooms} Bedrooms</span>}
              </div>

              {/* CTA */}
              <Link
                href={`/products/${plan.slug || plan.id}`}
                className="mt-4 inline-block text-tefetra font-medium"
              >
                View Plan →
              </Link>
            </div>
          ))}
        </div>

        {/* VIEW ALL */}
        <div className="mt-10 text-center">
          <Link href="/products" className="btn-secondary">
            View All Plans
          </Link>
        </div>

      </div>
    </div>
  );
}