import Link from 'next/link'

export default function AboutCTA() {
  return (
    <section className="bg-slate-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold">
          Ready to Start Your Project?
        </h2>

        <p className="mt-4 text-lg text-slate-600">
          Explore ready-made plans or speak with our team for custom
          design and technical support.
        </p>

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link
            href="/products"
            className="bg-[#0f2a44] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Plans
          </Link>

          <Link
            href="/contact"
            className="border px-6 py-3 rounded-xl font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}