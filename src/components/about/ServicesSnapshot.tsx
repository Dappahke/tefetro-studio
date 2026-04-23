export default function ServicesSnapshot() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">
        <div className="border rounded-3xl p-8">
          <h3 className="text-2xl font-bold">Design Services</h3>

          <ul className="mt-6 space-y-3 text-slate-600">
            <li>• House Plans</li>
            <li>• Custom Designs</li>
            <li>• Interior Concepts</li>
            <li>• Landscape Concepts</li>
          </ul>
        </div>

        <div className="border rounded-3xl p-8">
          <h3 className="text-2xl font-bold">Technical Services</h3>

          <ul className="mt-6 space-y-3 text-slate-600">
            <li>• BOQ</li>
            <li>• Structural Drawings</li>
            <li>• Approvals</li>
            <li>• Site Consultancy</li>
            <li>• Supervision</li>
          </ul>
        </div>
      </div>
    </section>
  )
}