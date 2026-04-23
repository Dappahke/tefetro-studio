export default function WhoWeAre() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
        <div className="bg-[#eaf3fb] rounded-3xl p-10 min-h-[350px]" />

        <div>
          <p className="text-[#e66b00] uppercase tracking-[0.25em] text-sm font-semibold">
            Who We Are
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Practical Design. Modern Delivery.
          </h2>

          <p className="mt-6 text-slate-600 text-lg leading-relaxed">
            Tefetro was built to simplify how people plan and build spaces.
            We combine architectural creativity, practical execution, and
            digital systems to make professional design more accessible.
          </p>

          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            We serve homeowners, developers, investors, and families seeking
            efficient, trustworthy, and design-led solutions.
          </p>
        </div>
      </div>
    </section>
  )
}