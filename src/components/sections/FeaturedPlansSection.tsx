// src/components/sections/FeaturedPlansSection.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const featuredPlans = [
  {
    id: 1,
    title: "Modern 3-Bedroom Bungalow",
    price: "KES 25,000",
    image: "/images/plan-1.jpg",
    specs: "3 Bed • 2 Bath • 180m²",
    tag: "Best Seller",
  },
  {
    id: 2,
    title: "Contemporary Maisonette",
    price: "KES 65,000",
    image: "/images/plan-2.jpg",
    specs: "4 Bed • 3 Bath • 320m²",
    tag: "Popular",
  },
  {
    id: 3,
    title: "4-Unit Apartment Block",
    price: "KES 120,000",
    image: "/images/plan-3.jpg",
    specs: "4 Units • 2 Bed each • 480m²",
    tag: "Investment",
  },
];

export default function FeaturedPlansSection() {
  return (
    <section className="section">
      <div className="section-inner">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-deep mb-4">
              Featured Plans
            </h2>
            <p className="text-neutral-600">
              Ready-to-build designs, structured for efficiency and cost clarity.
            </p>
          </div>

          <Link
            href="/products"
            className="btn-ghost mt-4 md:mt-0 self-start md:self-auto"
          >
            View All Plans
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {featuredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: typeof featuredPlans[0] }) {
  return (
    <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1">

      {/* Image */}
      <div className="relative aspect-plan overflow-hidden">
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Tag */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-tefetra text-white text-xs font-semibold rounded-full">
          {plan.tag}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">

        <div className="text-sm text-neutral-500 mb-2">
          {plan.specs}
        </div>

        <h3 className="text-lg font-semibold text-deep mb-3 group-hover:text-tefetra transition-colors">
          {plan.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-deep">
            {plan.price}
          </span>

          <Link
            href={`/products/${plan.id}`}
            className="btn-primary py-2 px-4 text-sm"
          >
            View Plan
          </Link>
        </div>

      </div>
    </div>
  );
}