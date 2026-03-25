// src/components/sections/TrustBar.tsx

import { CheckCircle2, Shield, Eye, Clock } from "lucide-react";

const trustIndicators = [
  { icon: CheckCircle2, text: "Designed by Licensed Professionals" },
  { icon: Shield, text: "Registered & Verified Business" },
  { icon: Eye, text: "Clear Pricing — No Hidden Costs" },
  { icon: Clock, text: "Real-Time Project Visibility" },
];

export default function TrustBar() {
  return (
    <div className="section-inner py-6">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
        {trustIndicators.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-2 text-white/90"
            >
              <Icon size={18} className="text-tefetra" />
              <span className="text-sm font-medium">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}