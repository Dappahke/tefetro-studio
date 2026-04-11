'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from "@/types/project"

// ✅ Extend status locally (WITHOUT redefining Project)
type ProjectStatus = 'pending' | 'contacted' | 'in_progress' | 'completed'

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
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDragStart = (projectId: string) => {
    setDraggingId(projectId)
  }

  const handleDrop = async (newStatus: ProjectStatus) => {
    if (!draggingId || isUpdating) return

    setIsUpdating(true)
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
      setIsUpdating(false)
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
          {/* Header */}
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
                className={`bg-white rounded-xl p-4 shadow-soft cursor-move hover:shadow-medium transition-shadow ${
                  isUpdating && draggingId === project.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-sage bg-sage/10 px-2 py-1 rounded">
                    {project.id.slice(0, 8)}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-medium text-deep-700 mb-1">
                  {project.service_type}
                </h4>

                <p className="text-sm text-neutral-600 mb-3">
                  {project.order?.email || 'No email'}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-mist/30">
                  <span className="text-xs text-neutral-500 truncate max-w-[120px]">
                    {project.order?.product?.title || 'Unknown Product'}
                  </span>

                  <button
                    onClick={() => router.push(`/admin/projects/${project.id}`)}
                    className="text-tefetra hover:text-tefetra-600"
                  >
                    →
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