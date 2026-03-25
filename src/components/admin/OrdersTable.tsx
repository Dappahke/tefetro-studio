'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PriceDisplayCompact } from '../products/PriceDisplayCompact'

interface Order {
  id: string
  email: string
  profiles?: { email: string }
  product_title?: string
  total: number
  status: string
  payment_ref: string
  created_at: string
  download_url?: string
  expires_at?: string
}

interface OrdersTableProps {
  orders: Order[]
  currentPage: number
  totalPages: number
  totalOrders: number
}

export function OrdersTable({ orders, currentPage, totalPages, totalOrders }: OrdersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }

  const toggleSelect = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/admin/orders?${params.toString()}`)
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-mist/30">
        <div className="w-16 h-16 bg-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-deep-700">No orders found</h3>
        <p className="text-neutral-600 mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-mist/30 overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-tefetra/10 px-6 py-3 border-b border-tefetra/20 flex items-center justify-between">
          <span className="text-sm font-medium text-tefetra-700">
            {selectedOrders.length} selected
          </span>
          <div className="flex gap-2">
            <button className="text-xs btn-ghost py-1.5 px-3">
              Export Selected
            </button>
            <button className="text-xs btn-primary py-1.5 px-3">
              Resend Email
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-canvas/50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-mist text-tefetra focus:ring-tefetra"
                />
              </th>
              <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                Order Details
              </th>
              <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                Customer
              </th>
              <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                Amount
              </th>
              <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                Date
              </th>
              <th className="text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/30">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id
              const expired = isExpired(order.expires_at)

              return (
                <>
                  <tr 
                    key={order.id} 
                    className={`hover:bg-canvas/30 transition-colors ${isExpanded ? 'bg-canvas/20' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-mist text-tefetra focus:ring-tefetra"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <code className="text-xs font-mono text-sage bg-sage/10 px-2 py-1 rounded">
                          {order.id.slice(0, 12)}...
                        </code>
                        <p className="text-sm text-neutral-600 mt-1">
                          {order.product_title || 'Architectural Plan'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-deep-700">{order.profiles?.email || order.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <PriceDisplayCompact amountKES={order.total} className="font-medium" />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${order.status === 'completed' ? 'bg-sage/10 text-sage' : 
                          order.status === 'pending' ? 'bg-tefetra/10 text-tefetra' : 
                          'bg-neutral-100 text-neutral-600'}
                      `}>
                        {order.status}
                      </span>
                      {order.download_url && (
                        <span className={`
                          ml-2 text-[10px] px-1.5 py-0.5 rounded
                          ${expired ? 'bg-alert/10 text-alert' : 'bg-sage/10 text-sage'}
                        `}>
                          {expired ? 'Expired' : 'Active'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-neutral-600">
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {new Date(order.created_at).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="p-2 text-neutral-400 hover:text-deep-700 transition-colors"
                          title="Toggle details"
                        >
                          <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-tefetra hover:text-tefetra-600 transition-colors"
                          title="View full details"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <tr className="bg-canvas/30">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wide">Payment Ref</p>
                            <p className="text-sm font-mono text-deep-700">{order.payment_ref}</p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wide">Download Status</p>
                            <p className={`text-sm ${expired ? 'text-alert' : 'text-sage'}`}>
                              {expired ? 'Link expired' : 'Link active'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs btn-ghost py-1.5 px-3">
                              Regenerate Link
                            </button>
                            <button className="text-xs btn-primary py-1.5 px-3">
                              Resend Email
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-mist/30 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Showing {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalOrders)} of {totalOrders}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-mist/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-canvas transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === pageNum 
                    ? 'bg-tefetra text-white' 
                    : 'border border-mist/50 hover:bg-canvas'}
                `}
              >
                {pageNum}
              </button>
            )
          })}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-mist/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-canvas transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}