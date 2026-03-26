import Link from 'next/link'
import { PriceDisplayCompact } from '../products/PriceDisplayCompact'

interface Project {
  id: string
  service_type: string
  status: string
  email: string
  created_at: string
  updated_at: string
  order: {
    id: string
    email: string
    total: number
    product: { title: string }
  }
}

interface ProjectsListViewProps {
  projects: Project[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-tefetra/10 text-tefetra',
  contacted: 'bg-sage/10 text-sage',
  in_progress: 'bg-deep/10 text-deep-600',
  completed: 'bg-neutral-100 text-neutral-600',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export function ProjectsListView({ projects }: ProjectsListViewProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-mist/30">
        <div className="w-16 h-16 bg-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-deep-700">No projects yet</h3>
        <p className="text-neutral-600 mt-2">Service requests will appear here</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-mist/30 overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-canvas border-b border-mist/30">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Project</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Client</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Order Value</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Last Updated</th>
              <th className="text-right py-4 px-6 font-semibold text-deep-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/30">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-canvas/50 transition-colors">
                <td className="py-4 px-6">
                  <div>
                    <h4 className="font-medium text-deep-700">{project.service_type}</h4>
                    <p className="text-xs text-neutral-500">
                      {project.order?.product?.title || 'Unknown Product'}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-neutral-600">{project.order?.email || project.email}</p>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-neutral-100 text-neutral-600'}`}>
                    {statusLabels[project.status] || project.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <PriceDisplayCompact amountKES={project.order?.total || 0} />
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-neutral-600">
                    {new Date(project.updated_at || project.created_at).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link 
                    href={`/admin/projects/${project.id}`}
                    className="btn-ghost text-sm py-2 px-4"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}