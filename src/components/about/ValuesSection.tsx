const values = [
  'Integrity',
  'Functionality',
  'Innovation',
  'Excellence',
]

export default function ValuesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-[#e66b00] uppercase tracking-[0.25em] text-sm font-semibold">
          Our Values
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Principles That Guide Our Work
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((item) => (
            <div key={item} className="border rounded-3xl p-6">
              <h3 className="text-lg font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}