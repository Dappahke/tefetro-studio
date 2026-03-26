'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const eventOptions = [
  { value: '', label: 'All Events' },
  { value: 'payment_success', label: 'Payment Success' },
  { value: 'payment_failed', label: 'Payment Failed' },
  { value: 'order_created', label: 'Order Created' },
  { value: 'download_completed', label: 'Download Completed' },
  { value: 'project_created', label: 'Project Created' },
  { value: 'project_status_updated', label: 'Project Updated' },
  { value: 'admin_login', label: 'Admin Login' },
]

export function ActivityFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to page 1
    router.push(`/admin/activity?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft border border-mist/30">
      <div className="flex flex-wrap items-center gap-4">
        {/* Event Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-600">Event:</label>
          <select
            value={searchParams.get('event') || ''}
            onChange={(e) => updateFilter('event', e.target.value)}
            className="text-sm border border-mist rounded-lg px-3 py-2 bg-canvas focus:border-tefetra focus:outline-none"
          >
            {eventOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-600">From:</label>
          <input
            type="date"
            value={searchParams.get('dateFrom') || ''}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
            className="text-sm border border-mist rounded-lg px-3 py-2 bg-canvas focus:border-tefetra focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-600">To:</label>
          <input
            type="date"
            value={searchParams.get('dateTo') || ''}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
            className="text-sm border border-mist rounded-lg px-3 py-2 bg-canvas focus:border-tefetra focus:outline-none"
          />
        </div>

        {/* Clear Filters */}
        {(searchParams.get('event') || searchParams.get('dateFrom') || searchParams.get('dateTo')) && (
          <button
            onClick={() => router.push('/admin/activity')}
            className="text-sm text-alert hover:text-alert-600 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}