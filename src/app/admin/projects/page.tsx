import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { ProjectsKanban } from '@/components/admin/ProjectsKanban'
import { ProjectsListView } from '@/components/admin/ProjectsListView'

interface ProjectsPageProps {
  searchParams: { view?: string }
}

export default async function AdminProjectsPage({ searchParams }: ProjectsPageProps) {
  const session = await verifyAdmin()

  // Fetch projects with related order data
  const { data: projects, error } = await adminClient
    .from('projects')
    .select(`
      *,
      order:orders(
        id, 
        email, 
        total, 
        product_id,
        product:products(title)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`)

  const viewMode = searchParams.view || 'kanban' // 'kanban' or 'list'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-700">Service Projects</h1>
          <p className="text-sm text-neutral-500">
            {projects?.length || 0} active projects • Supervision & Contracting
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center bg-white rounded-lg p-1 shadow-soft border border-mist/30">
          <a 
            href="/admin/projects?view=kanban"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'kanban' ? 'bg-tefetra text-white' : 'text-neutral-600 hover:bg-canvas'
            }`}
          >
            📋 Board
          </a>
          <a 
            href="/admin/projects?view=list"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-tefetra text-white' : 'text-neutral-600 hover:bg-canvas'
            }`}
          >
            📑 List
          </a>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <ProjectsKanban projects={projects || []} />
      ) : (
        <ProjectsListView projects={projects || []} />
      )}
    </div>
  )
}