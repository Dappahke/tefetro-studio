// src/components/sections/TargetUsers.tsx
"use client";

import { Home, Building2, Plane, Sprout } from "lucide-react";

const users = [
  {
    icon: Sprout,
    title: "First-Time Land Owners",
    description: "Turn your plot into a home with guidance at every step"
  },
  {
    icon: Home,
    title: "Home Builders",
    description: "Quality plans that match your budget and lifestyle needs"
  },
  {
    icon: Building2,
    title: "Developers",
    description: "Scalable solutions for multiple unit projects"
  },
  {
    icon: Plane,
    title: "Diaspora Clients",
    description: "Build back home with trusted local expertise"
  }
];

export default function TargetUsers() {
  return (
    <section 
      className="py-20 sm:py-28 bg-[#FAF9F6]"
      aria-labelledby="target-users-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <p className="text-[#e66b00] font-semibold text-sm tracking-wider uppercase mb-3">
            Who We Serve
          </p>
          <h2 
            id="target-users-heading"
            className="text-3xl sm:text-4xl font-bold text-[#222]"
          >
            Built for Real Builders
          </h2>
        </header>

        <div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          role="list"
          aria-label="Target customer types"
        >
          {users.map((user, index) => (
            <article 
              key={index}
              className="group text-center"
              role="listitem"
            >
              <div 
                className="w-16 h-16 mx-auto bg-[#eaf3fb] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#1f4e79] transition-colors duration-300"
                aria-hidden="true"
              >
                <user.icon className="w-8 h-8 text-[#1f4e79] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#222] mb-2">
                {user.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">
                {user.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}