// src/components/sections/TestimonialsSection.tsx

const testimonials = [
  {
    quote:
      "I could monitor my project remotely while abroad. The structure and transparency gave me complete confidence.",
    author: "James M.",
    role: "Homeowner, Karen",
  },
  {
    quote:
      "Clear pricing, professional plans, and strong execution. Everything was structured from day one.",
    author: "Sarah O.",
    role: "Developer, Kiambu",
  },
  {
    quote:
      "From plan purchase to construction, the process was smooth and predictable. No surprises.",
    author: "Michael K.",
    role: "First-time Builder, Ngong",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section">
      <div className="section-inner">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deep mb-4">
            Trusted by Homeowners & Developers
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Real projects. Real clients. Proven results across Kenya.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: typeof testimonials[0];
}) {
  return (
    <div className="glass rounded-2xl p-8 relative h-full">

      {/* Quote mark */}
      <div className="text-6xl text-neutral-200 font-serif absolute top-4 left-4">
        &ldquo;
      </div>

      {/* Content */}
      <p className="text-neutral-700 leading-relaxed mb-6 relative z-10 pt-4">
        {testimonial.quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-deep/10 flex items-center justify-center">
          <span className="text-deep font-semibold">
            {testimonial.author[0]}
          </span>
        </div>

        <div>
          <div className="font-semibold text-deep">
            {testimonial.author}
          </div>
          <div className="text-sm text-neutral-500">
            {testimonial.role}
          </div>
        </div>
      </div>

    </div>
  );
}