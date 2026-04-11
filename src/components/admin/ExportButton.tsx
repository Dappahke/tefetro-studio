// components/admin/ExportButton.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Loader2,
  ChevronDown 
} from 'lucide-react'

interface Order {
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
  expires_at?: string
  customer_name?: string
  phone?: string
}

interface ExportButtonProps {
  orders: Order[]
  companyName?: string
  logoPath?: string
}

type ExportFormat = 'csv' | 'pdf'

export function ExportButton({ 
  orders, 
  companyName = 'Tefetro',
  logoPath = '/images/tefetro-logo.png'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf')
  const [showDropdown, setShowDropdown] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  // Pre-load logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch(logoPath)
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          setLogoDataUrl(reader.result as string)
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.error('Failed to load logo:', error)
      }
    }
    loadLogo()
  }, [logoPath])

  // Calculate statistics
  const stats = {
    total: orders.reduce((sum, o) => sum + Number(o.total), 0),
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    avgOrder: orders.length > 0 ? orders.reduce((sum, o) => sum + Number(o.total), 0) / orders.length : 0,
  }

  const exportToCSV = () => {
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

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => {
          const cellStr = String(cell)
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${companyName.toLowerCase()}-orders-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    setProgress(0)

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)

      let currentY = margin

      // Header with logo
      const addHeader = () => {
        // Logo
        if (logoDataUrl) {
          try {
            pdf.addImage(logoDataUrl, 'PNG', margin, currentY, 20, 20)
          } catch (e) {
            // Fallback to text logo if image fails
            pdf.setFillColor(239, 150, 28)
            pdf.roundedRect(margin, currentY, 15, 15, 3, 3, 'F')
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'bold')
            pdf.text('T', margin + 5, currentY + 11)
          }
        } else {
          // Fallback text logo
          pdf.setFillColor(239, 150, 28)
          pdf.roundedRect(margin, currentY, 15, 15, 3, 3, 'F')
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'bold')
          pdf.text('T', margin + 5, currentY + 11)
        }
        
        // Company name
        pdf.setTextColor(31, 41, 55)
        pdf.setFontSize(20)
        pdf.setFont('helvetica', 'bold')
        pdf.text(companyName, margin + 25, currentY + 10)
        
        // Report title
        pdf.setFontSize(11)
        pdf.setTextColor(107, 114, 128)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Order Report', margin + 25, currentY + 16)
        
        // Date
        pdf.setFontSize(9)
        pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`, pageWidth - margin, currentY + 10, { align: 'right' })
        
        currentY += 30
        
        // Line separator
        pdf.setDrawColor(229, 231, 235)
        pdf.setLineWidth(0.5)
        pdf.line(margin, currentY, pageWidth - margin, currentY)
        currentY += 15
      }

      addHeader()

      // Summary Cards
      const addSummaryCards = () => {
        const cardWidth = (contentWidth - 9) / 3
        const cardHeight = 25
        
        const cards = [
          { label: 'Total Revenue', value: `KES ${(stats.total / 1000).toFixed(1)}K`, color: [239, 150, 28] },
          { label: 'Total Orders', value: orders.length.toString(), color: [34, 197, 94] },
          { label: 'Avg Order', value: `KES ${stats.avgOrder.toFixed(0)}`, color: [139, 92, 246] }
        ]

        cards.forEach((card, i) => {
          const x = margin + (i * (cardWidth + 4.5))
          
          // Card background
          pdf.setFillColor(249, 250, 251)
          pdf.roundedRect(x, currentY, cardWidth, cardHeight, 4, 4, 'F')
          
          // Color accent
          pdf.setFillColor(card.color[0], card.color[1], card.color[2])
          pdf.roundedRect(x, currentY, 3, cardHeight, 1.5, 1.5, 'F')
          
          // Label
          pdf.setFontSize(8)
          pdf.setTextColor(107, 114, 128)
          pdf.setFont('helvetica', 'normal')
          pdf.text(card.label.toUpperCase(), x + 6, currentY + 8)
          
          // Value
          pdf.setFontSize(14)
          pdf.setTextColor(31, 41, 55)
          pdf.setFont('helvetica', 'bold')
          pdf.text(card.value, x + 6, currentY + 18)
        })
        
        currentY += cardHeight + 15
      }

      addSummaryCards()

      // Status breakdown
      const addStatusBreakdown = () => {
        pdf.setFontSize(12)
        pdf.setTextColor(31, 41, 55)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Order Status Overview', margin, currentY)
        currentY += 10

        const barHeight = 8
        const maxBarWidth = contentWidth * 0.6
        
        const statuses = [
          { label: 'Completed', count: stats.completed, color: [34, 197, 94] },
          { label: 'Pending', count: stats.pending, color: [245, 158, 11] },
          { label: 'Others', count: orders.length - stats.completed - stats.pending, color: [107, 114, 128] }
        ]

        statuses.forEach(status => {
          const percentage = orders.length > 0 ? (status.count / orders.length) * 100 : 0
          const barWidth = (status.count / Math.max(...statuses.map(s => s.count))) * maxBarWidth
          
          // Label
          pdf.setFontSize(9)
          pdf.setTextColor(75, 85, 99)
          pdf.setFont('helvetica', 'normal')
          pdf.text(`${status.label} (${status.count})`, margin, currentY + 5)
          
          // Bar background
          pdf.setFillColor(243, 244, 246)
          pdf.roundedRect(margin + 50, currentY, maxBarWidth, barHeight, 2, 2, 'F')
          
          // Bar fill
          if (status.count > 0) {
            pdf.setFillColor(status.color[0], status.color[1], status.color[2])
            pdf.roundedRect(margin + 50, currentY, barWidth, barHeight, 2, 2, 'F')
          }
          
          // Percentage
          pdf.setFontSize(8)
          pdf.setTextColor(107, 114, 128)
          pdf.text(`${percentage.toFixed(1)}%`, margin + 50 + maxBarWidth + 3, currentY + 5)
          
          currentY += barHeight + 6
        })
        
        currentY += 10
      }

      addStatusBreakdown()

      // Orders table
      const addOrdersTable = () => {
        pdf.setFontSize(12)
        pdf.setTextColor(31, 41, 55)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Order Details', margin, currentY)
        currentY += 12

        const colWidths = [25, 35, 50, 25, 25, 30]
        const headers = ['Order ID', 'Date', 'Customer', 'Product', 'Amount', 'Status']
        
        // Header background
        pdf.setFillColor(249, 250, 251)
        pdf.rect(margin, currentY - 6, contentWidth, 10, 'F')
        
        pdf.setFontSize(8)
        pdf.setTextColor(75, 85, 99)
        pdf.setFont('helvetica', 'bold')
        
        let xPos = margin
        headers.forEach((header, i) => {
          pdf.text(header, xPos + 2, currentY)
          xPos += colWidths[i]
        })
        
        currentY += 8
        pdf.setDrawColor(229, 231, 235)
        pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2)

        pdf.setFont('helvetica', 'normal')
        
        for (let i = 0; i < orders.length; i++) {
          const order = orders[i]
          
          if (currentY > pageHeight - margin - 15) {
            pdf.addPage()
            currentY = margin + 10
            pdf.setFillColor(249, 250, 251)
            pdf.rect(margin, currentY - 6, contentWidth, 10, 'F')
            pdf.setFontSize(8)
            pdf.setTextColor(75, 85, 99)
            pdf.setFont('helvetica', 'bold')
            let hxPos = margin
            headers.forEach((header, hi) => {
              pdf.text(header, hxPos + 2, currentY)
              hxPos += colWidths[hi]
            })
            currentY += 8
            pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2)
            pdf.setFont('helvetica', 'normal')
          }

          if (i % 2 === 0) {
            pdf.setFillColor(255, 255, 255)
          } else {
            pdf.setFillColor(249, 250, 251)
          }
          pdf.rect(margin, currentY - 4, contentWidth, 8, 'F')

          pdf.setFontSize(7)
          pdf.setTextColor(55, 65, 81)
          
          const rowData = [
            order.id.slice(0, 8) + '...',
            new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            (order.profiles?.email || order.email || '').slice(0, 20),
            (order.product_title || 'Plan').slice(0, 12),
            `KES ${order.total}`,
            order.status
          ]
          
          xPos = margin
          rowData.forEach((cell, ci) => {
            if (ci === 5) {
              if (cell === 'completed') pdf.setTextColor(34, 197, 94)
              else if (cell === 'pending') pdf.setTextColor(245, 158, 11)
              else pdf.setTextColor(107, 114, 128)
            } else {
              pdf.setTextColor(55, 65, 81)
            }
            
            pdf.text(String(cell), xPos + 2, currentY + 2)
            xPos += colWidths[ci]
          })
          
          currentY += 8
          setProgress(Math.round((i / orders.length) * 100))
        }
      }

      addOrdersTable()

      // Footer
      const pageCount = pdf.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(156, 163, 175)
        pdf.setFont('helvetica', 'normal')
        pdf.text(
          `${companyName} © ${new Date().getFullYear()} | Page ${i} of ${pageCount} | Confidential`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
      }

      pdf.save(`${companyName.toLowerCase()}-orders-report-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('PDF Export failed:', error)
      alert('PDF export failed. Please try again.')
    } finally {
      setIsExporting(false)
      setProgress(0)
    }
  }

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV()
    } else {
      exportToPDF()
    }
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Format selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-mist rounded-l-xl text-deep-700 hover:bg-canvas transition-colors"
          >
            {exportFormat === 'pdf' ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
            <span className="text-sm font-medium uppercase">{exportFormat}</span>
            <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-mist rounded-xl shadow-lg overflow-hidden z-50">
              <button
                onClick={() => { setExportFormat('pdf'); setShowDropdown(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-canvas transition-colors ${exportFormat === 'pdf' ? 'bg-canvas text-tefetra' : 'text-deep-700'}`}
              >
                <FileText size={16} />
                PDF Report
              </button>
              <button
                onClick={() => { setExportFormat('csv'); setShowDropdown(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-canvas transition-colors ${exportFormat === 'csv' ? 'bg-canvas text-tefetra' : 'text-deep-700'}`}
              >
                <FileSpreadsheet size={16} />
                CSV Data
              </button>
            </div>
          )}
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={isExporting || orders.length === 0}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-r-xl font-medium transition-all
            ${orders.length === 0 || isExporting
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
              : 'bg-tefetra text-white hover:bg-tefetra-600 shadow-lg shadow-tefetra/20'}
          `}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{progress > 0 ? `${progress}%` : 'Exporting...'}</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Export</span>
              <span className="text-xs opacity-70 bg-white/20 px-1.5 py-0.5 rounded">
                {orders.length}
              </span>
            </>
          )}
        </button>
      </div>

      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}