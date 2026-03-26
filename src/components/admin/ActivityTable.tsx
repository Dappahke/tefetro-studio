import Link from 'next/link'

interface Log {
  id: string
  event: string
  user_id: string | null
  email: string | null
  order_id: string | null
  project_id: string | null
  metadata: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
  admin?: {
    id: string
    email: string
    role: string
  }
}

interface ActivityTableProps {
  logs: Log[]
  currentPage: number
  totalPages: number
}

const eventColors: Record<string, string> = {
  payment_success: 'bg-sage/10 text-sage',
  payment_failed: 'bg-alert/10 text-alert',
  download_link_generated: 'bg-tefetra/10 text-tefetra',
  download_completed: 'bg-deep/10 text-deep-600',
  project_created: 'bg-sage/10 text-sage',
  project_status_updated: 'bg-tefetra/10 text-tefetra',
  order_created: 'bg-sage/10 text-sage',
  link_regenerated: 'bg-neutral-100 text-neutral-600',
  product_created: 'bg-sage/10 text-sage',
  product_updated: 'bg-tefetra/10 text-tefetra',
  product_deleted: 'bg-alert/10 text-alert',
  user_updated: 'bg-tefetra/10 text-tefetra',
  admin_login: 'bg-deep/10 text-deep-600',
}

const eventLabels: Record<string, string> = {
  payment_success: 'Payment Success',
  payment_failed: 'Payment Failed',
  download_link_generated: 'Download Link Generated',
  download_completed: 'Download Completed',
  project_created: 'Project Created',
  project_status_updated: 'Project Status Updated',
  order_created: 'Order Created',
  link_regenerated: 'Link Regenerated',
  product_created: 'Product Created',
  product_updated: 'Product Updated',
  product_deleted: 'Product Deleted',
  user_updated: 'User Updated',
  admin_login: 'Admin Login',
}

function formatMetadata(metadata: any): string {
  if (!metadata) return '-'
  if (typeof metadata === 'string') return metadata
  
  const parts: string[] = []
  if (metadata.amount) parts.push(`KES ${metadata.amount}`)
  if (metadata.paymentRef) parts.push(`Ref: ${metadata.paymentRef.slice(0, 8)}...`)
  if (metadata.reason) parts.push(metadata.reason)
  if (metadata.oldStatus && metadata.newStatus) parts.push(`${metadata.oldStatus} → ${metadata.newStatus}`)
  if (metadata.serviceType) parts.push(metadata.serviceType)
  if (metadata.adminId) parts.push(`by admin`)
  
  return parts.join(' • ') || JSON.stringify(metadata).slice(0, 50)
}

function getDeviceInfo(userAgent: string | null): string {
  if (!userAgent) return 'Unknown'
  if (userAgent.includes('Mobile')) return '📱 Mobile'
  if (userAgent.includes('Tablet')) return '💻 Tablet'
  return '🖥️ Desktop'
}

export function ActivityTable({ logs, currentPage, totalPages }: ActivityTableProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-mist/30">
        <div className="w-16 h-16 bg-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-deep-700">No activity recorded</h3>
        <p className="text-neutral-600 mt-2">Audit logs will appear here when actions are performed.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-mist/30 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-canvas/50">
            <tr className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/30">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-canvas/30 transition-colors group">
                {/* Event */}
                <td className="px-6 py-4">
                  <span className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                    ${eventColors[log.event] || 'bg-neutral-100 text-neutral-600'}
                  `}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {eventLabels[log.event] || log.event}
                  </span>
                </td>

                {/* User */}
                <td className="px-6 py-4">
                  {log.email ? (
                    <div>
                      <p className="text-sm font-medium text-deep-700 truncate max-w-[150px]">
                        {log.email}
                      </p>
                      {log.user_id && (
                        <code className="text-[10px] text-neutral-400 font-mono">
                          {log.user_id.slice(0, 8)}...
                        </code>
                      )}
                    </div>
                  ) : log.admin ? (
                    <div>
                      <p className="text-sm font-medium text-deep-700">
                        {log.admin.email}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 bg-deep/10 text-deep-600 rounded">
                        {log.admin.role}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-neutral-400">System</span>
                  )}
                </td>

                {/* Details */}
                <td className="px-6 py-4">
                  <p className="text-sm text-neutral-600 max-w-[250px] truncate">
                    {formatMetadata(log.metadata)}
                  </p>
                  {(log.order_id || log.project_id) && (
                    <div className="flex items-center gap-2 mt-1">
                      {log.order_id && (
                        <Link 
                          href={`/admin/orders/${log.order_id}`}
                          className="text-[10px] px-2 py-0.5 bg-sage/10 text-sage rounded hover:bg-sage/20 transition-colors"
                        >
                          Order #{log.order_id.slice(0, 6)}
                        </Link>
                      )}
                      {log.project_id && (
                        <Link 
                          href={`/admin/projects?highlight=${log.project_id}`}
                          className="text-[10px] px-2 py-0.5 bg-tefetra/10 text-tefetra rounded hover:bg-tefetra/20 transition-colors"
                        >
                          Project #{log.project_id.slice(0, 6)}
                        </Link>
                      )}
                    </div>
                  )}
                </td>

                {/* Source */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <span>{getDeviceInfo(log.user_agent)}</span>
                    {log.ip_address && (
                      <span className="text-xs text-neutral-400 font-mono">
                        {log.ip_address}
                      </span>
                    )}
                  </div>
                </td>

                {/* Time */}
                <td className="px-6 py-4 text-right">
                  <time 
                    className="text-sm text-neutral-500"
                    title={new Date(log.created_at).toLocaleString()}
                  >
                    {new Date(log.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-canvas/50 border-t border-mist/30 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${currentPage === 1 
                  ? 'text-neutral-300 cursor-not-allowed' 
                  : 'text-deep-700 hover:bg-mist/50'}
              `}
              aria-disabled={currentPage === 1}
            >
              Previous
            </Link>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                const isActive = page === currentPage
                return (
                  <Link
                    key={page}
                    href={`?page=${page}`}
                    className={`
                      w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors
                      ${isActive 
                        ? 'bg-tefetra text-white' 
                        : 'text-neutral-600 hover:bg-mist/50'}
                    `}
                  >
                    {page}
                  </Link>
                )
              })}
              {totalPages > 5 && (
                <span className="text-neutral-400 px-2">...</span>
              )}
            </div>
            <Link
              href={`?page=${Math.min(totalPages, currentPage + 1)}`}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${currentPage === totalPages 
                  ? 'text-neutral-300 cursor-not-allowed' 
                  : 'text-deep-700 hover:bg-mist/50'}
              `}
              aria-disabled={currentPage === totalPages}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}