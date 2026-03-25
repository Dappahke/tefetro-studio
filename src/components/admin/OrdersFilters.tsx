'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface OrdersFiltersProps {
  currentFilters: { [key: string]: string | undefined }
  totalOrders: number
}

export function OrdersFilters({ currentFilters, totalOrders }: OrdersFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [search, setSearch] = useState(currentFilters.search || '')

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset to page 1 when filtering
    params.delete('page')
    
    router.push(`/admin/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/admin/orders')
  }

  const hasFilters = Object.keys(currentFilters).some(k => k !== 'page' && currentFilters[k])

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-mist/30 overflow-hidden">
      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-mist/30">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by email, order ID, or payment ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', search)}
              className="w-full pl-10 pr-4 py-2.5 bg-canvas rounded-xl border border-mist/50 focus:border-tefetra focus:ring-1 focus:ring-tefetra outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => applyFilter('search', search)}
            className="btn-primary px-6"
          >
            Search
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              btn-ghost px-4 flex items-center gap-2
              ${isExpanded ? 'bg-canvas' : ''}
            `}
          >
            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
            {hasFilters && (
              <span className="w-2 h-2 bg-tefetra rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 bg-canvas/30 border-b border-mist/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                Status
              </label>
              <select
                value={currentFilters.status || ''}
                onChange={(e) => applyFilter('status', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-mist/50 focus:border-tefetra outline-none"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                From Date
              </label>
              <input
                type="date"
                value={currentFilters.dateFrom || ''}
                onChange={(e) => applyFilter('dateFrom', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-mist/50 focus:border-tefetra outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                To Date
              </label>
              <input
                type="date"
                value={currentFilters.dateTo || ''}
                onChange={(e) => applyFilter('dateTo', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-mist/50 focus:border-tefetra outline-none"
              />
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                Min Amount (KES)
              </label>
              <input
                type="number"
                placeholder="0"
                value={currentFilters.minAmount || ''}
                onChange={(e) => applyFilter('minAmount', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-mist/50 focus:border-tefetra outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                Max Amount (KES)
              </label>
              <input
                type="number"
                placeholder="No limit"
                value={currentFilters.maxAmount || ''}
                onChange={(e) => applyFilter('maxAmount', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-mist/50 focus:border-tefetra outline-none"
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-mist/30">
              <span className="text-sm text-neutral-500">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {currentFilters.status && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-tefetra/10 text-tefetra rounded-lg text-xs">
                    Status: {currentFilters.status}
                    <button onClick={() => applyFilter('status', '')} className="hover:text-tefetra-700">×</button>
                  </span>
                )}
                {currentFilters.dateFrom && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-tefetra/10 text-tefetra rounded-lg text-xs">
                    From: {currentFilters.dateFrom}
                    <button onClick={() => applyFilter('dateFrom', '')} className="hover:text-tefetra-700">×</button>
                  </span>
                )}
                {currentFilters.dateTo && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-tefetra/10 text-tefetra rounded-lg text-xs">
                    To: {currentFilters.dateTo}
                    <button onClick={() => applyFilter('dateTo', '')} className="hover:text-tefetra-700">×</button>
                  </span>
                )}
                {(currentFilters.minAmount || currentFilters.maxAmount) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-tefetra/10 text-tefetra rounded-lg text-xs">
                    Amount: {currentFilters.minAmount || '0'} - {currentFilters.maxAmount || '∞'}
                    <button onClick={() => { applyFilter('minAmount', ''); applyFilter('maxAmount', '') }} className="hover:text-tefetra-700">×</button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-alert hover:text-alert-600 ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="px-4 py-3 bg-canvas/30 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold text-deep-700">{totalOrders}</span> orders
        </p>
        {hasFilters && (
          <p className="text-xs text-neutral-500">
            Filters applied
          </p>
        )}
      </div>
    </div>
  )
}