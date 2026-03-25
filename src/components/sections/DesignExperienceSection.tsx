// src/components/sections/DesignExperienceSection.tsx
import { CheckCircle2, Play, Home, Palette, Eye } from "lucide-react";

const features = [
  "Photorealistic 3D renders",
  "Interactive walkthroughs",
  "Material and finish previews",
  "Day and lighting simulations",
];

export default function DesignExperienceSection() {
  return (
    <section className="section bg-cream-50 relative z-10">
      <div className="section-inner">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-teal-500 mb-6">
              See the Design Before You Build
            </h2>
            <p className="text-charcoal-400 text-lg leading-relaxed mb-8">
              Every plan comes with immersive 3D visualizations. Walk through 
              your future home with Twinmotion-powered walkthroughs and 
              photorealistic renders.
            </p>
            
            <ul className="space-y-4 mb-8">
              {features.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-charcoal-500">
                  <CheckCircle2 size={20} className="text-sage-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button className="btn-secondary gap-2">
              <Play size={18} />
              Watch Demo
            </button>
          </div>

          <VisualGrid />
        </div>
      </div>
    </section>
  );
}

function VisualGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="aspect-[3/4] rounded-2xl bg-cream-200 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-charcoal-300">
            <Home size={48} />
          </div>
        </div>
        <div className="aspect-video rounded-2xl bg-teal-500/10 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-teal-500">
            <Play size={32} />
          </div>
        </div>
      </div>
      <div className="space-y-4 pt-8">
        <div className="aspect-video rounded-2xl bg-cream-200 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-charcoal-300">
            <Palette size={32} />
          </div>
        </div>
        <div className="aspect-[3/4] rounded-2xl bg-sage-300/20 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-sage-400">
            <Eye size={48} />
          </div>
        </div>
      </div>
    </div>
  );
}