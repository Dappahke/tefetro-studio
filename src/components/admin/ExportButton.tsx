'use client'

import { useState } from 'react'

interface Order {
  expires_at: any
  id: string
  email: string
  profiles?: { email: string }
  product_title?: string
  product_id?: string
  total: number
  status: string
  payment_ref: string
  created_at: string
  addons?: Array<{ name: string; price: number }>
}

interface ExportButtonProps {
  orders: Order[]
}

export function ExportButton({ orders }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToExcel = () => {
    setIsExporting(true)

    try {
      // CSV Headers
      const headers = [
        'Order ID',
        'Date',
        'Customer Email',
        'Product',
        'Product ID',
        'Addons',
        'Total (KES)',
        'Status',
        'Payment Reference',
        'Download Status'
      ]

      // CSV Rows
      const rows = orders.map(order => {
        const addonsList = order.addons?.map(a => a.name).join('; ') || ''
        const downloadStatus = order.expires_at 
          ? new Date(order.expires_at) > new Date() ? 'Active' : 'Expired'
          : 'N/A'

        return [
          order.id,
          new Date(order.created_at).toISOString(),
          order.profiles?.email || order.email,
          order.product_title || 'Architectural Plan',
          order.product_id || '',
          addonsList,
          order.total,
          order.status,
          order.payment_ref,
          downloadStatus
        ]
      })

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => 
          row.map(cell => {
            // Escape cells with commas or quotes
            const cellStr = String(cell)
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`
            }
            return cellStr
          }).join(',')
        )
      ].join('\n')

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `tefetro-orders-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting || orders.length === 0}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
        ${orders.length === 0 
          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
          : 'bg-sage/10 text-sage hover:bg-sage hover:text-white'}
      `}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export Excel</span>
          <span className="text-xs opacity-70">({orders.length})</span>
        </>
      )}
    </button>
  )
}