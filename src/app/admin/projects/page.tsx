// src/app/admin/projects/page.tsx
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { ProjectsKanban } from '@/components/admin/ProjectsKanban'
import { ProjectsListView } from '@/components/admin/ProjectsListView'
import { RealtimeProjects } from '@/components/admin/RealtimeProjects'
import type { Project } from "@/types/project";
import { 
  LayoutGrid, 
  List, 
  Plus, 
  Search,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

interface ProjectsPageProps {
  searchParams: { 
    view?: string
    status?: string
    search?: string
  }
}

// Raw type from Supabase (order comes as array)
interface RawProject {
  id: string
  order_id: string
  user_id: string | null
  service_type: string
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  created_at: string
  order: Array<{
    id: string
    email: string
    total: number
    product_id: string
    product: Array<{ title: string }>
  }> | null
}


// Transform raw Supabase data to clean Project type
function transformProject(raw: RawProject): Project {
  const orderArray = raw.order
  const firstOrder = orderArray && orderArray.length > 0 ? orderArray[0] : null
  
  return {
    id: raw.id,
    order_id: raw.order_id,
    user_id: raw.user_id,
    service_type: raw.service_type,
    status: raw.status,
    created_at: raw.created_at,
    order: firstOrder ? {
      id: firstOrder.id,
      email: firstOrder.email,
      total: firstOrder.total,
      product_id: firstOrder.product_id,
      product: firstOrder.product && firstOrder.product.length > 0 
        ? firstOrder.product[0] 
        : null
    } : null
  }
}

async function fetchProjects(filters: { status?: string; search?: string }): Promise<Project[]> {
  const { data: rawData, error } = await adminClient
    .from('projects')
    .select(`
      id,
      order_id,
      user_id,
      service_type,
      status,
      created_at,
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

  // Transform raw data to clean type
  const projects = (rawData || []).map(transformProject)

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    return projects.filter((p) => 
      p.order?.email?.toLowerCase().includes(searchLower) ||
      p.order?.product?.title?.toLowerCase().includes(searchLower) ||
      p.service_type?.toLowerCase().includes(searchLower) ||
      p.id?.toLowerCase().includes(searchLower)
    )
  }

  return projects
}

// Stats component
async function ProjectStats() {
  const { data: stats, error } = await adminClient
    .from('projects')
    .select('status')

  if (error) return null

  const counts = {
    total: stats?.length || 0,
    pending: stats?.filter((s) => s.status === 'pending').length || 0,
    inProgress: stats?.filter((s) => s.status === 'in_progress').length || 0,
    completed: stats?.filter((s) => s.status === 'completed').length || 0,
  }

  const completionRate = counts.total > 0 
    ? Math.round((counts.completed / counts.total) * 100) 
    : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Projects"
        value={counts.total}
        icon={<LayoutGrid size={20} />}
        color="bg-blue-50 text-blue-600 border-blue-200"
      />
      <StatCard
        title="Pending"
        value={counts.pending}
        icon={<Clock size={20} />}
        color="bg-amber-50 text-amber-600 border-amber-200"
      />
      <StatCard
        title="In Progress"
        value={counts.inProgress}
        icon={<ArrowUpDown size={20} />}
        color="bg-purple-50 text-purple-600 border-purple-200"
      />
      <StatCard
        title="Completed"
        value={counts.completed}
        trend={`${completionRate}% rate`}
        icon={<CheckCircle2 size={20} />}
        color="bg-emerald-50 text-emerald-600 border-emerald-200"
      />
    </div>
  )
}

function StatCard({ title, value, trend, icon, color }: { 
  title: string
  value: number
  trend?: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className={`rounded-2xl p-5 border ${color} bg-white`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.split(' ')[0]}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      {trend && <p className="text-xs mt-1 opacity-60">{trend}</p>}
    </div>
  )
}

// Loading skeleton
function ProjectsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-mist/30" />
        ))}
      </div>
      <div className="h-96 bg-white rounded-2xl border border-mist/30" />
    </div>
  )
}

export default async function AdminProjectsPage({ searchParams }: ProjectsPageProps) {
  await verifyAdmin()

  const viewMode = searchParams.view || 'kanban'
  const statusFilter = searchParams.status || 'all'
  const searchQuery = searchParams.search || ''

  const projects = await fetchProjects({ 
    status: statusFilter, 
    search: searchQuery 
  })

  const statusOptions = [
    { value: 'all', label: 'All Projects', icon: LayoutGrid },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'in_progress', label: 'In Progress', icon: ArrowUpDown },
    { value: 'review', label: 'Under Review', icon: Filter },
    { value: 'completed', label: 'Completed', icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-[1600px] mx-auto">
      {/* Realtime Updates - invisible component */}
      <RealtimeProjects showToasts={true} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-deep-800 flex items-center gap-3">
            Service Projects
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </h1>
          <p className="text-mist mt-1">
            Manage architectural supervision and contracting projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-tefetra text-white rounded-xl font-medium hover:bg-tefetra-600 transition-all shadow-lg shadow-tefetra/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={18} />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats */}
      <Suspense fallback={<div className="h-24 bg-stone-100 rounded-2xl animate-pulse" />}>
        <ProjectStats />
      </Suspense>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-mist/30 shadow-soft">
        {/* Search */}
        <form className="relative flex-1 max-w-md" action="/admin/projects" method="GET">
          <input type="hidden" name="view" value={viewMode} />
          <input type="hidden" name="status" value={statusFilter} />
          
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
          <input
            type="search"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search projects, clients, or services..."
            className="w-full pl-11 pr-4 py-2.5 bg-canvas border border-mist rounded-xl text-deep-700 placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-tefetra/20 focus:border-tefetra transition-all"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Status Filter Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-canvas border border-mist rounded-xl text-deep-700 hover:bg-white hover:border-tefetra/30 transition-all">
              <Filter size={16} />
              <span className="text-sm font-medium">
                {statusOptions.find(s => s.value === statusFilter)?.label || 'Filter'}
              </span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-mist/30 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                {statusOptions.map((status) => {
                  const Icon = status.icon
                  const isActive = statusFilter === status.value
                  return (
                    <Link
                      key={status.value}
                      href={`/admin/projects?view=${viewMode}&status=${status.value}${searchQuery ? `&search=${searchQuery}` : ''}`}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${isActive ? 'bg-tefetra/10 text-tefetra' : 'text-deep-700 hover:bg-canvas'}
                      `}
                    >
                      <Icon size={16} />
                      {status.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-canvas rounded-xl p-1 border border-mist">
            <Link
              href={`/admin/projects?view=kanban&status=${statusFilter}${searchQuery ? `&search=${searchQuery}` : ''}`}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === 'kanban' 
                  ? 'bg-white text-tefetra shadow-sm' 
                  : 'text-mist hover:text-deep-600'}
              `}
            >
              <LayoutGrid size={16} />
              Board
            </Link>
            <Link
              href={`/admin/projects?view=list&status=${statusFilter}${searchQuery ? `&search=${searchQuery}` : ''}`}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === 'list' 
                  ? 'bg-white text-tefetra shadow-sm' 
                  : 'text-mist hover:text-deep-600'}
              `}
            >
              <List size={16} />
              List
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <div className="min-h-[500px]">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-mist/30 border-dashed">
              <div className="w-20 h-20 bg-canvas rounded-2xl flex items-center justify-center mb-4">
                <LayoutGrid size={32} className="text-mist" />
              </div>
              <h3 className="text-lg font-semibold text-deep-700 mb-2">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-mist text-center max-w-sm mb-6">
                {searchQuery 
                  ? `No projects matching "${searchQuery}" in ${statusFilter} status.`
                  : 'Get started by creating your first architectural supervision or contracting project.'}
              </p>
              {!searchQuery && (
                <Link
                  href="/admin/projects/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-tefetra text-white rounded-xl font-medium hover:bg-tefetra-600 transition-colors"
                >
                  <Plus size={18} />
                  Create Project
                </Link>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'kanban' ? (
                <ProjectsKanban projects={projects} />
              ) : (
                <ProjectsListView projects={projects} />
              )}
            </>
          )}
        </div>
      </Suspense>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-mist pt-4 border-t border-mist/20">
        <p>Showing {projects.length} projects</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Bell size={14} className="text-emerald-500" />
            Real-time updates active
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  )
}