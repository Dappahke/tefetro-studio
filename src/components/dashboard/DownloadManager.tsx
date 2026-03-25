'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  product_id: string
  product_title?: string
  download_url?: string
  expires_at: string
  file_path?: string
}

interface DownloadManagerProps {
  orders: Order[]
}

export function DownloadManager({ orders }: DownloadManagerProps) {
  const [regenerating, setRegenerating] = useState<string | null>(null)

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date()

  const handleRegenerate = async (orderId: string) => {
    setRegenerating(orderId)
    
    try {
      const res = await fetch('/api/protected/downloads/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!res.ok) throw new Error('Failed to regenerate')

      const data = await res.json()
      
      if (data.success) {
        // Refresh page to show new link
        window.location.reload()
      }
    } catch (err) {
      alert('Failed to regenerate link. Please try again.')
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-mist/30 overflow-hidden">
      <div className="divide-y divide-mist/30">
        {orders.map((order) => {
          const expired = isExpired(order.expires_at)
          const expiresIn = Math.ceil((new Date(order.expires_at).getTime() - Date.now()) / (1000 * 60 * 60))

          return (
            <div key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-deep-700">
                    {order.product_title || 'Architectural Plan'}
                  </h3>
                  
                  {expired ? (
                    <p className="text-sm text-alert flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Link expired
                    </p>
                  ) : (
                    <p className={`text-sm mt-1 ${expiresIn < 6 ? 'text-alert' : 'text-sage'}`}>
                      Expires in {expiresIn} hours
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!expired && order.download_url ? (
                    <a
                      href={order.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  ) : (
                    <button
                      onClick={() => handleRegenerate(order.id)}
                      disabled={regenerating === order.id}
                      className="btn-secondary flex items-center gap-2"
                    >
                      {regenerating === order.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Regenerate Link
                        </>
                      )}
                    </button>
                  )}
                  
                  <Link 
                    href={`/dashboard/orders/${order.id}`}
                    className="btn-ghost p-2"
                    title="Order details"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}