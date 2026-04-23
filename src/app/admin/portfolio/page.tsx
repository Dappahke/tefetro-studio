import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PortfolioAdminPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load portfolio projects:', error)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Portfolio Projects
          </h1>
          <p className="text-sm text-slate-500">
            Manage architectural concepts, plans, and showcase work.
          </p>
        </div>

        <Link
          href="/admin/portfolio/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#0f2a44] px-4 py-2 font-medium text-white transition hover:opacity-90"
        >
          + Add Project
        </Link>
      </div>

      {/* Empty State */}
      {!projects || projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            No projects yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Start by adding your first portfolio project.
          </p>

          <Link
            href="/admin/portfolio/new"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              {/* Left */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {project.title}
                </h2>

                <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
                  <span>{project.category}</span>

                  {project.status && (
                    <>
                      <span>•</span>
                      <span>{project.status}</span>
                    </>
                  )}

                  {project.featured && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-amber-600">
                        Featured
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="flex gap-2">
                <Link
                  href={`/our-work/${project.slug}`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View
                </Link>

                <Link
                  href={`/admin/portfolio/edit/${project.id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}