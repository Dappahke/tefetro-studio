'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type PortfolioProject = {
  id: string
  title: string
  slug: string
  category: string
  image: string
  status: string | null
  featured: boolean | null
  featured_order: number | null
  is_for_sale: boolean | null
  ready_to_build: boolean | null
  investor_friendly: boolean | null
  created_at: string | null
}

interface PortfolioTableProps {
  projects: PortfolioProject[]
}

const categoryLabels: Record<string, string> = {
  residential: 'Residential',
  rental_units: 'Rental Units',
  apartments: 'Apartments',
  interiors: 'Interiors',
  landscaping: 'Landscaping',
  technical_planning: 'Technical Planning',
}

export default function PortfolioTable({
  projects,
}: PortfolioTableProps) {
  const router = useRouter()
  const supabase = createClient()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.slug.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === 'all' || project.category === category

      return matchesSearch && matchesCategory
    })
  }, [projects, search, category])

  async function toggleFeatured(
    id: string,
    currentValue: boolean | null
  ) {
    try {
      setLoadingId(id)

      await supabase
        .from('portfolio_projects')
        .update({
          featured: !currentValue,
        })
        .eq('id', id)

      router.refresh()
    } finally {
      setLoadingId(null)
    }
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm(
      'Delete this project permanently?'
    )

    if (!confirmed) return

    try {
      setLoadingId(id)

      await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id)

      router.refresh()
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-600"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-600"
          >
            <option value="all">All Categories</option>
            <option value="residential">Residential</option>
            <option value="rental_units">Rental Units</option>
            <option value="apartments">Apartments</option>
            <option value="interiors">Interiors</option>
            <option value="landscaping">Landscaping</option>
            <option value="technical_planning">
              Technical Planning
            </option>
          </select>

          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center justify-center rounded-xl bg-[#0f2a44] px-4 py-2 font-medium text-white transition hover:opacity-90"
          >
            + Add Project
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No projects found.
                  </td>
                </tr>
              )}

              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-t border-slate-100"
                >
                  {/* Project */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {project.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          /{project.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 text-slate-700">
                    {categoryLabels[project.category] ??
                      project.category}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {project.status ?? 'concept'}
                    </span>
                  </td>

                  {/* Flags */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {project.featured && (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
                          Featured
                        </span>
                      )}

                      {project.is_for_sale && (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                          For Sale
                        </span>
                      )}

                      {project.ready_to_build && (
                        <span className="rounded-full bg-sky-50 px-2 py-1 text-xs text-sky-700">
                          Ready
                        </span>
                      )}

                      {project.investor_friendly && (
                        <span className="rounded-full bg-violet-50 px-2 py-1 text-xs text-violet-700">
                          Investor
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-4 text-slate-600">
                    {project.created_at
                      ? new Date(
                          project.created_at
                        ).toLocaleDateString()
                      : '-'}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          toggleFeatured(
                            project.id,
                            project.featured
                          )
                        }
                        disabled={loadingId === project.id}
                        className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-slate-50"
                      >
                        {project.featured
                          ? 'Unfeature'
                          : 'Feature'}
                      </button>

                      <Link
                        href={`/admin/portfolio/edit/${project.id}`}
                        className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-slate-50"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          deleteProject(project.id)
                        }
                        disabled={loadingId === project.id}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}