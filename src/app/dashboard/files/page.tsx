// src/app/dashboard/files/page.tsx

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          My Files
        </h1>

        <p className="text-slate-500 mt-2">
          Access purchased drawings, PDFs and downloads.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p className="text-slate-500">
          No files available yet.
        </p>
      </div>
    </div>
  )
}