const items = [
  {
    title: 'Ready-Made House Plans',
    text: 'Fast access to professional designs.',
  },
  {
    title: 'Full Project Support',
    text: 'Consultancy, approvals, and supervision.',
  },
  {
    title: 'Modern Digital Experience',
    text: 'Easy browsing and organized workflow.',
  },
  {
    title: 'Built for Real Markets',
    text: 'Designed for real plots, budgets, and lifestyles.',
  },
]

export default function WhyTefetro() {
  return (
    <section className="bg-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <p className="text-[#e66b00] uppercase tracking-[0.25em] text-sm font-semibold">
            Why Tefetro
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            What Makes Us Different
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white border rounded-3xl p-6"
            >
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-3 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}