// src/app/download/page.tsx

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type DownloadFile = {
  id: string
  title: string
  filename: string
  url: string
  size?: number
  type: 'main' | 'addon'
  badge?: string
}

type DownloadResponse = {
  success: boolean
  productTitle: string
  files: DownloadFile[]
  expiresInMinutes: number
}

function DownloadContent() {
  const searchParams =
    useSearchParams()

  const token =
    searchParams.get(
      'token'
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [data, setData] =
    useState<DownloadResponse | null>(
      null
    )

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError(
        'Missing secure download token.'
      )
      return
    }

    loadDownloads()
  }, [token])

  async function loadDownloads() {
    try {
      setLoading(true)

      const res =
        await fetch(
          `/api/protected/downloads?token=${encodeURIComponent(
            token!
          )}`
        )

      const json =
        await res.json()

      if (!res.ok) {
        throw new Error(
          json.error ||
            'Unable to load files'
        )
      }

      setData(json)
    } catch (err: any) {
      setError(
        err.message ||
          'Download failed'
      )
    } finally {
      setLoading(false)
    }
  }

  function formatSize(
    bytes?: number
  ) {
    if (!bytes) return ''

    if (
      bytes <
      1024
    )
      return `${bytes} B`

    if (
      bytes <
      1024 * 1024
    )
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(1)} MB`
  }

  function downloadFile(
    url: string
  ) {
    window.open(
      url,
      '_blank'
    )
  }

  /* ---------------------------------- */
  /* Loading                            */
  /* ---------------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-200 text-center">
          <div className="w-20 h-20 rounded-full bg-[#0F4C5C]/10 mx-auto flex items-center justify-center mb-6 animate-pulse">
            <svg
              className="w-10 h-10 text-[#0F4C5C] animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#0F4C5C]">
            Preparing Files
          </h1>

          <p className="mt-3 text-slate-500">
            Verifying your secure purchase...
          </p>
        </div>
      </main>
    )
  }

  /* ---------------------------------- */
  /* Error                              */
  /* ---------------------------------- */

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-200 text-center">
          <h1 className="text-2xl font-bold text-[#0F4C5C]">
            Download Error
          </h1>

          <p className="mt-3 text-slate-500">
            {error}
          </p>

          <Link
            href="/dashboard/orders"
            className="mt-6 inline-flex h-12 px-6 rounded-2xl bg-[#F28C00] text-white font-semibold items-center justify-center"
          >
            Go to Orders
          </Link>
        </div>
      </main>
    )
  }

  const mainFiles =
    data.files.filter(
      (
        item
      ) =>
        item.type ===
        'main'
    )

  const addonFiles =
    data.files.filter(
      (
        item
      ) =>
        item.type ===
        'addon'
    )

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}

        <div className="text-center mb-10">
          <div className="inline-block bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-5">
            <Image
              src="/images/tefetro-logo.png"
              alt="Tefetro"
              width={140}
              height={44}
            />
          </div>

          <h1 className="text-4xl font-bold text-[#0F4C5C]">
            Your Files Are Ready
          </h1>

          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            Thank you for your purchase. Download your premium files below.
          </p>

          <div className="mt-5 inline-flex px-4 py-2 rounded-full bg-[#6faa99]/10 text-[#6faa99] text-sm font-medium">
            Link expires in {data.expiresInMinutes} minutes
          </div>
        </div>

        {/* Product Card */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
          <p className="text-sm text-slate-500">
            Purchased Product
          </p>

          <h2 className="text-2xl font-bold text-[#0F4C5C] mt-1">
            {data.productTitle}
          </h2>
        </div>

        {/* Main Files */}

        <SectionTitle
          title="Included Files"
        />

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {mainFiles.map(
            (
              file
            ) => (
              <FileCard
                key={
                  file.id
                }
                file={
                  file
                }
                onDownload={() =>
                  downloadFile(
                    file.url
                  )
                }
                formatSize={
                  formatSize
                }
              />
            )
          )}
        </div>

        {/* Addons */}

        {addonFiles.length >
          0 && (
          <>
            <SectionTitle
              title="Selected Add-ons"
            />

            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {addonFiles.map(
                (
                  file
                ) => (
                  <FileCard
                    key={
                      file.id
                    }
                    file={
                      file
                    }
                    onDownload={() =>
                      downloadFile(
                        file.url
                      )
                    }
                    formatSize={
                      formatSize
                    }
                  />
                )
              )}
            </div>
          </>
        )}

        {/* Footer */}

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/orders"
            className="h-12 rounded-2xl bg-[#0F4C5C] text-white font-semibold flex items-center justify-center"
          >
            My Orders
          </Link>

          <Link
            href="/products"
            className="h-12 rounded-2xl border border-slate-200 bg-white text-slate-800 font-semibold flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({
  title,
}: {
  title: string
}) {
  return (
    <h3 className="text-xl font-bold text-[#0F4C5C] mb-5">
      {title}
    </h3>
  )
}

function FileCard({
  file,
  onDownload,
  formatSize,
}: {
  file: DownloadFile
  onDownload: () => void
  formatSize: (
    n?: number
  ) => string
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex gap-4 items-start">
        <div className="w-14 h-14 rounded-2xl bg-[#F28C00]/10 flex items-center justify-center shrink-0">
          <svg
            className="w-7 h-7 text-[#F28C00]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5L18 8.5V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-[#0F4C5C]">
            {file.title}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            {file.filename}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              {file.type ===
              'main'
                ? 'Included'
                : 'Addon'}
            </span>

            {file.badge && (
              <span className="px-2 py-1 rounded-full bg-[#6faa99]/10 text-[#6faa99]">
                {
                  file.badge
                }
              </span>
            )}

            {file.size && (
              <span className="text-slate-400">
                {formatSize(
                  file.size
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={
          onDownload
        }
        className="mt-5 w-full h-11 rounded-2xl bg-[#F28C00] text-white font-semibold hover:bg-[#e58300] transition"
      >
        Download File
      </button>
    </div>
  )
}

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <p className="text-[#0F4C5C] font-semibold">
            Loading...
          </p>
        </main>
      }
    >
      <DownloadContent />
    </Suspense>
  )
}