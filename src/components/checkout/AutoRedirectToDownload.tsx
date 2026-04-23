// NEW FILE
// src/components/checkout/AutoRedirectToDownload.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  token: string
  seconds?: number
}

export default function AutoRedirectToDownload({
  token,
  seconds = 5,
}: Props) {
  const router =
    useRouter()

  const [
    countdown,
    setCountdown,
  ] = useState(
    seconds
  )

  useEffect(() => {
    if (!token) return

    const timer =
      setInterval(() => {
        setCountdown(
          (
            prev
          ) =>
            prev - 1
        )
      }, 1000)

    return () =>
      clearInterval(
        timer
      )
  }, [token])

  useEffect(() => {
    if (
      countdown <= 0 &&
      token
    ) {
      router.push(
        `/download?token=${encodeURIComponent(
          token
        )}`
      )
    }
  }, [
    countdown,
    token,
    router,
  ])

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="rounded-2xl border border-[#0F4C5C]/10 bg-white shadow-xl px-4 py-3 min-w-[260px]">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#0F4C5C]/10 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-[#0F4C5C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Download Ready
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Redirecting in{' '}
              <span className="font-semibold text-[#F28C00]">
                {countdown}s
              </span>
            </p>

            <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#F28C00] transition-all duration-1000"
                style={{
                  width: `${((seconds - countdown) / seconds) * 100}%`,
                }}
              />
            </div>

            <button
              onClick={() =>
                router.push(
                  `/download?token=${encodeURIComponent(
                    token
                  )}`
                )
              }
              className="mt-3 text-xs font-semibold text-[#0F4C5C] hover:text-[#F28C00] transition"
            >
              Download now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}