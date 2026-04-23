import Link from 'next/link'

export default function AboutHero() {
  return (
    <section className="bg-[#0f2a44] text-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="uppercase tracking-[0.25em] text-[#4f86c6] text-sm font-semibold">
          About Tefetro
        </p>

        <h1 className="mt-4 text-5xl font-bold max-w-3xl">
          Building Smarter Spaces for Modern Living
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-2xl">
          Tefetro Limited helps clients access professional house plans,
          technical expertise, and build-ready solutions through a modern
          digital experience.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">
          <Link
            href="/products"
            className="bg-[#e66b00] px-6 py-3 rounded-xl font-semibold"
          >
            Explore House Plans
          </Link>

          <Link
            href="/contact"
            className="border border-white/20 px-6 py-3 rounded-xl font-semibold"
          >
            Talk to Our Team
          </Link>
        </div>
      </div>
    </section>
  )
}