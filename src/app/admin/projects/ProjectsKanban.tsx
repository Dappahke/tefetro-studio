'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ProjectStatus = 'pending' | 'contacted' | 'in_progress' | 'completed'

interface Project {
  id: string
  service_type: string
  status: ProjectStatus
  email: string
  created_at: string
  order: {
    id: string
    email: string
    total: number
    product: { title: string }
  }
}

interface ProjectsKanbanProps {
  projects: Project[]
}

const columns: { id: ProjectStatus; title: string; color: string }[] = [
  { id: 'pending', title: 'Pending Review', color: 'bg-tefetra/20 border-tefetra/30' },
  { id: 'contacted', title: 'Contacted', color: 'bg-sage/20 border-sage/30' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-deep/10 border-deep/20' },
  { id: 'completed', title: 'Completed', color: 'bg-neutral-100 border-neutral-200' },
]

export function ProjectsKanban({ projects }: ProjectsKanbanProps) {
  const router = useRouter()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleDragStart = (projectId: string) => {
    setDraggingId(projectId)
  }

  const handleDrop = async (newStatus: ProjectStatus) => {
    if (!draggingId) return

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: draggingId, status: newStatus }),
      })

      if (!res.ok) throw new Error('Update failed')
      
      router.refresh()
    } catch (err) {
      alert('Failed to update status')
    } finally {
      setDraggingId(null)
    }
  }

  const getProjectsByStatus = (status: ProjectStatus) => 
    projects.filter(p => p.status === status)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div 
          key={column.id}
          className={`rounded-2xl border-2 ${column.color} min-h-[400px]`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(column.id)}
        >
          {/* Column Header */}
          <div className="p-4 border-b border-black/5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-deep-700">{column.title}</h3>
              <span className="text-xs bg-white px-2 py-1 rounded-full font-medium">
                {getProjectsByStatus(column.id).length}
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="p-3 space-y-3">
            {getProjectsByStatus(column.id).map((project) => (
              <div
                key={project.id}
                draggable
                onDragStart={() => handleDragStart(project.id)}
                className="bg-white rounded-xl p-4 shadow-soft cursor-move hover:shadow-medium transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-sage bg-sage/10 px-2 py-1 rounded">
                    {project.id.slice(0, 8)}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-medium text-deep-700 mb-1">{project.service_type}</h4>
                <p className="text-sm text-neutral-600 mb-3">{project.order?.email}</p>

                <div className="flex items-center justify-between pt-2 border-t border-mist/30">
                  <span className="text-xs text-neutral-500">
                    {project.order?.product?.title || 'Unknown Product'}
                  </span>
                  <button 
                    onClick={() => router.push(`/admin/projects/${project.id}`)}
                    className="text-tefetra hover:text-tefetra-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}