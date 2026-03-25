interface Order {
  id: string
  addons: Array<{
    id: string
    name: string
    type: string
  }>
  project_status?: string
  project_created_at?: string
}

interface ProjectListProps {
  orders: Order[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-tefetra/10 text-tefetra',
  contacted: 'bg-sage/10 text-sage',
  in_progress: 'bg-deep/10 text-deep-600',
  completed: 'bg-sage/10 text-sage',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  contacted: 'Team Contacted',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export function ProjectList({ orders }: ProjectListProps) {
  // Flatten orders with service addons into projects
  const projects = orders.flatMap(order => 
    order.addons
      ?.filter(a => a.type === 'service')
      .map(addon => ({
        orderId: order.id,
        addonId: addon.id,
        addonName: addon.name,
        status: order.project_status || 'pending',
        createdAt: order.project_created_at || order.project_created_at,
      })) || []
  )

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-mist/30">
        <p className="text-neutral-600">No active service projects</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-mist/30 overflow-hidden">
      <div className="divide-y divide-mist/30">
        {projects.map((project, idx) => (
          <div key={`${project.orderId}-${project.addonId}-${idx}`} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-deep-700">{project.addonName}</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Requested {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'recently'}
                </p>
              </div>
              
              <span className={`
                text-xs px-3 py-1 rounded-full font-medium
                ${statusColors[project.status] || 'bg-neutral-100 text-neutral-600'}
              `}>
                {statusLabels[project.status] || project.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                {['pending', 'contacted', 'in_progress', 'completed'].map((step, i) => {
                  const isActive = ['pending', 'contacted', 'in_progress', 'completed'].indexOf(project.status) >= i
                  const isCurrent = project.status === step
                  
                  return (
                    <div key={step} className="flex-1 flex items-center">
                      <div className={`
                        h-2 flex-1 rounded-full transition-colors
                        ${isActive ? (isCurrent ? 'bg-tefetra' : 'bg-sage') : 'bg-mist/50'}
                      `} />
                      {i < 3 && (
                        <div className={`
                          w-2 h-2 rounded-full mx-1
                          ${isActive ? 'bg-sage' : 'bg-mist/50'}
                        `} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1 uppercase tracking-wide">
                <span>Submitted</span>
                <span>Contacted</span>
                <span>In Progress</span>
                <span>Done</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}