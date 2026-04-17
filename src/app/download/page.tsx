'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function DownloadContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'expired'>('loading')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{filename?: string, fileSize?: number, productTitle?: string}>({})
  const [errorMessage, setErrorMessage] = useState('')
  const [countdown, setCountdown] = useState(2)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('No download token provided')
      return
    }

    fetchDownloadUrl(token)
  }, [token])

  // Countdown timer for auto-download
  useEffect(() => {
    if (status === 'ready' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (status === 'ready' && countdown === 0 && downloadUrl) {
      window.location.href = downloadUrl
    }
  }, [status, countdown, downloadUrl])

  const fetchDownloadUrl = async (downloadToken: string) => {
    try {
      const res = await fetch(`/api/protected/downloads?token=${encodeURIComponent(downloadToken)}`)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 410) {
          setStatus('expired')
        } else {
          setStatus('error')
          setErrorMessage(data.error || 'Failed to get download link')
        }
        return
      }

      setDownloadUrl(data.downloadUrl)
      setFileInfo({
        filename: data.filename,
        fileSize: data.fileSize,
        productTitle: data.productTitle
      })
      setStatus('ready')
      setCountdown(2)

    } catch (err) {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  const handleManualDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo Section with Animation */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-[#0F4C5C]/5">
            <Image 
              src="/images/tefetro-logo.png" 
              alt="Tefetro Studios" 
              width={120} 
              height={40} 
              className="mx-auto"
              priority
            />
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#0F4C5C]/10">
              <div className="w-20 h-20 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#0F4C5C]/20 animate-pulse">
                <svg className="w-10 h-10 text-[#0F4C5C] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#0F4C5C] mb-3 text-center">Preparing Download...</h1>
              <p className="text-[#1E1E1E]/60 text-center">Please wait while we verify your download link</p>
              <div className="mt-6 flex justify-center">
                <div className="w-32 h-1 bg-[#0F4C5C]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F28C00] rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ready State */}
        {status === 'ready' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-[#6faa99]/10 rounded-full flex items-center justify-center mx-auto border-2 border-[#6faa99]/20 animate-in zoom-in duration-300">
                <svg className="w-12 h-12 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#0F4C5C]/10">
              <h1 className="text-2xl font-bold text-[#0F4C5C] mb-2 text-center">Download Ready!</h1>
              
              {/* Countdown Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F28C00]/10 rounded-full">
                  <svg className="w-4 h-4 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-[#F28C00]">
                    Auto-download in {countdown}s
                  </span>
                </div>
              </div>

              {/* Product Title */}
              {fileInfo.productTitle && (
                <div className="mb-4 p-3 bg-[#FAF9F6] rounded-xl border border-[#0F4C5C]/5">
                  <p className="text-sm text-[#1E1E1E]/60 text-center">You purchased</p>
                  <p className="font-semibold text-[#0F4C5C] text-center">{fileInfo.productTitle}</p>
                </div>
              )}

              {/* File Card */}
              <div className="bg-gradient-to-br from-[#FAF9F6] to-white rounded-xl p-5 mb-6 border-2 border-[#0F4C5C]/10 hover:border-[#0F4C5C]/20 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F28C00]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F4C5C] truncate">{fileInfo.filename || 'Architectural Plan.pdf'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-[#1E1E1E]/50">{formatFileSize(fileInfo.fileSize)}</p>
                      <div className="w-1 h-1 bg-[#1E1E1E]/30 rounded-full"></div>
                      <p className="text-xs text-[#6faa99]">Digital Download</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleManualDownload}
                className="w-full py-3.5 px-6 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-200 shadow-lg shadow-[#F28C00]/20 hover:shadow-xl hover:shadow-[#F28C00]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Now
              </button>

              {/* Expiry Notice */}
              <div className="mt-6 bg-[#6faa99]/5 rounded-xl p-3 border border-[#6faa99]/10">
                <p className="text-sm text-[#6faa99] flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  This download link will expire in 5 minutes
                </p>
              </div>
            </div>

            {/* Dashboard Link */}
            <div className="text-center mt-4">
              <Link
                href="/dashboard"
                className="text-sm text-[#0F4C5C] hover:text-[#F28C00] transition-colors inline-flex items-center gap-1 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Expired State */}
        {status === 'expired' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#0F4C5C]/10">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#F28C00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#F28C00]/20">
                  <svg className="w-12 h-12 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#0F4C5C] mb-3">Link Expired</h1>
                <p className="text-[#1E1E1E]/60 mb-8">Your download link has expired for security reasons</p>

                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="block w-full py-3.5 px-6 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-200 shadow-lg shadow-[#F28C00]/20 hover:shadow-xl hover:shadow-[#F28C00]/30 hover:-translate-y-0.5"
                  >
                    Go to Dashboard
                  </Link>
                  <p className="text-sm text-[#1E1E1E]/50 pt-2">
                    You can regenerate your download link from your order history
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#0F4C5C]/10">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#F28C00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#F28C00]/20">
                  <svg className="w-12 h-12 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#0F4C5C] mb-3">Download Failed</h1>
                <p className="text-[#1E1E1E]/60 mb-8">{errorMessage}</p>

                <div className="space-y-3">
                  <button
                    onClick={() => token && fetchDownloadUrl(token)}
                    className="block w-full py-3.5 px-6 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-200 shadow-lg shadow-[#F28C00]/20 hover:shadow-xl hover:shadow-[#F28C00]/30 hover:-translate-y-0.5"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/dashboard"
                    className="block w-full py-3.5 px-6 bg-white text-[#0F4C5C] font-semibold rounded-xl border-2 border-[#0F4C5C]/20 hover:border-[#0F4C5C]/40 hover:bg-[#0F4C5C]/5 transition-all duration-200"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#1E1E1E]/50">
            Need help?{' '}
            <a href="mailto:support@tefetra.studio" className="text-[#0F4C5C] hover:text-[#F28C00] transition-colors font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#0F4C5C]/20 animate-pulse">
            <svg className="w-10 h-10 text-[#0F4C5C] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <p className="text-[#0F4C5C] font-medium">Loading...</p>
          <div className="mt-4 w-32 h-1 bg-[#0F4C5C]/10 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#F28C00] rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  )
}