// src/components/sections/TransparencySection.tsx
import { Camera, CheckCircle2, MapPin } from "lucide-react";

const features = [
  "Live CCTV access to your construction site",
  "Daily progress photos and videos",
  "Real-time cost tracking and approvals",
  "Direct communication with project managers",
  "Milestone-based payment verification",
];

export default function TransparencySection() {
  return (
    <section className="section bg-teal-500 relative z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cream-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-inner relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-50/10 text-cream-50 text-sm font-medium mb-6">
              <Camera size={16} />
              Industry First in Kenya
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-cream-50 mb-6">
              Build With Full Transparency
            </h2>
            
            <p className="text-cream-50/80 text-lg leading-relaxed mb-8">
              We believe you should see your project come to life, even when 
              you can't be there. Our real-time monitoring system gives you 
              complete visibility.
            </p>

            <div className="space-y-4">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-cream-50">
                  <div className="w-6 h-6 rounded-full bg-sage-300/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} className="text-sage-300" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <LiveCameraUI />
        </div>
      </div>
    </section>
  );
}

function LiveCameraUI() {
  return (
    <div className="relative">
      <div className="glass-dark rounded-2xl p-6 border border-cream-50/10">
        <div className="aspect-video rounded-xl bg-charcoal-500/50 mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-sage-300/20" />
          <div className="text-center z-10">
            <Camera size={48} className="text-cream-50 mx-auto mb-2" />
            <span className="text-cream-50 text-sm">Live Site Camera</span>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full text-cream-50 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-cream-50 animate-pulse" />
            LIVE
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-charcoal-500/30 flex items-center justify-center">
              <MapPin size={20} className="text-cream-50/50" />
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-cream-50/60 text-sm">
          <span>Site: Karen, Nairobi</span>
          <span>Updated: Just now</span>
        </div>
      </div>
    </div>
  );
}