// src/components/sections/TransparencySection.tsx

import Link from "next/link";
import { CheckCircle2, ArrowRight, Clock, Wallet, MessageSquare } from "lucide-react";

const features = [
  "Daily progress photos and video updates",
  "Real-time cost tracking and approvals",
  "Milestone-based payment system",
  "Direct communication with project team",
  "Weekly structured progress reports",
];

export default function TransparencySection() {
  return (
    <section className="section bg-gradient-brand text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-inner relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-6">
              Transparent Project Management
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay in Control of Your Project
            </h2>

            {/* Description */}
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Building shouldn’t feel uncertain. With Tefetro Studio, you get 
              structured updates, cost visibility, and direct communication 
              throughout your entire project.
            </p>

            {/* FEATURES */}
            <div className="space-y-4">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="text-white/90">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link href="/contact" className="btn-primary gap-2">
                Start Your Project
                <ArrowRight size={18} />
              </Link>
            </div>

          </div>

          {/* RIGHT VISUAL */}
          <TransparencyUI />

        </div>
      </div>
    </section>
  );
}

function TransparencyUI() {
  return (
    <div className="glass-dark rounded-2xl p-6 border border-white/10 space-y-4">

      {/* TOP STATUS */}
      <div className="flex items-center justify-between">
        <span className="text-white font-medium">Project Progress</span>
        <span className="text-xs text-white/60">Updated today</span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="w-2/3 h-full bg-tefetra rounded-full" />
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">

        <div>
          <Clock className="mx-auto mb-1 text-white/70" size={18} />
          <p className="text-white font-medium">Timeline</p>
          <p className="text-white/60 text-xs">On Track</p>
        </div>

        <div>
          <Wallet className="mx-auto mb-1 text-white/70" size={18} />
          <p className="text-white font-medium">Budget</p>
          <p className="text-white/60 text-xs">Controlled</p>
        </div>

        <div>
          <MessageSquare className="mx-auto mb-1 text-white/70" size={18} />
          <p className="text-white font-medium">Updates</p>
          <p className="text-white/60 text-xs">Daily</p>
        </div>

      </div>

      {/* ACTIVITY FEED */}
      <div className="space-y-2 text-sm text-white/80">
        <p>✔ Foundation completed</p>
        <p>✔ Walling in progress</p>
        <p>✔ Materials delivered</p>
      </div>

    </div>
  );
}