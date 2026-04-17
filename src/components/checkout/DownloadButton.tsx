'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DownloadButtonProps {
  orderId?: string
  initialToken?: string
}

export default function DownloadButton({ orderId, initialToken }: DownloadButtonProps) {
  const [downloadToken, setDownloadToken] = useState<string | null>(initialToken || null)
  const [isGeneratingToken, setIsGeneratingToken] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateToken = async () => {
      if (orderId && !downloadToken && !isGeneratingToken && !error) {
        setIsGeneratingToken(true)
        setError(null)
        try {
          console.log('Generating token for order:', orderId)
          const response = await fetch(`/api/protected/downloads/generate/${orderId}`)
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to generate download token')
          }
          
          if (data.success && data.token) {
            console.log('Token generated successfully')
            // Don't encode here - let the Link component handle it
            setDownloadToken(data.token)
          } else {
            throw new Error('Invalid response from server')
          }
        } catch (err) {
          console.error('Failed to generate download token:', err)
          setError(err instanceof Error ? err.message : 'Failed to prepare download')
        } finally {
          setIsGeneratingToken(false)
        }
      }
    }
    
    generateToken()
  }, [orderId, downloadToken, isGeneratingToken, error])

  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
        <p className="text-sm text-red-600 text-center">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setIsGeneratingToken(false)
          }}
          className="mt-2 text-sm text-[#0F4C5C] hover:underline w-full text-center"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (downloadToken) {
    return (
      <div className="mb-4">
        <Link
          href={`/download?token=${encodeURIComponent(downloadToken)}`}
          className="block w-full py-3.5 px-6 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-200 shadow-lg shadow-[#F28C00]/20 hover:shadow-xl hover:shadow-[#F28C00]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Your Files
        </Link>
        <p className="text-xs text-center text-[#1E1E1E]/40 mt-2">
          Download link expires in 5 minutes
        </p>
      </div>
    )
  }

  if (isGeneratingToken) {
    return (
      <div className="mb-4 p-3 bg-[#0F4C5C]/5 rounded-xl flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-[#0F4C5C] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-sm text-[#0F4C5C]">Preparing your download...</span>
      </div>
    )
  }

  return null
}