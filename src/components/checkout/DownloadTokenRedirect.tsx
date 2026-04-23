// NEW FILE
// src/components/checkout/DownloadTokenRedirect.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  reference: string
  seconds?: number
}

type State =
  | 'loading'
  | 'ready'
  | 'error'

export default function DownloadTokenRedirect({
  reference,
  seconds = 5,
}: Props) {
  const router =
    useRouter()

  const [
    state,
    setState,
  ] = useState<State>(
    'loading'
  )

  const [
    token,
    setToken,
  ] = useState('')

  const [
    message,
    setMessage,
  ] = useState(
    'Preparing your secure download...'
  )

  const [
    countdown,
    setCountdown,
  ] = useState(
    seconds
  )

  /* ---------------------------------- */
  /* Create Token                       */
  /* ---------------------------------- */

  useEffect(() => {
    if (!reference)
      return

    async function init() {
      try {
        const res =
          await fetch(
            `/api/orders/download-token?reference=${encodeURIComponent(
              reference
            )}`,
            {
              method:
                'GET',
              cache:
                'no-store',
            }
          )

        const data =
          await res.json()

        if (
          !res.ok ||
          !data.token
        ) {
          throw new Error(
            data.error ||
              'Unable to prepare download'
          )
        }

        setToken(
          data.token
        )
        setState(
          'ready'
        )
        setMessage(
          'Download ready. Redirecting...'
        )
      } catch (
        error: any
      ) {
        console.error(
          error
        )

        setState(
          'error'
        )
        setMessage(
          error?.message ||
            'Unable to prepare your download.'
        )
      }
    }

    init()
  }, [reference])

  /* ---------------------------------- */
  /* Countdown                          */
  /* ---------------------------------- */

  useEffect(() => {
    if (
      state !==
      'ready'
    )
      return

    if (
      countdown <=
      0
    ) {
      router.push(
        `/download?token=${encodeURIComponent(
          token
        )}`
      )
      return
    }

    const timer =
      setTimeout(
        () =>
          setCountdown(
            (
              prev
            ) =>
              prev - 1
          ),
        1000
      )

    return () =>
      clearTimeout(
        timer
      )
  }, [
    state,
    countdown,
    token,
    router,
  ])

  /* ---------------------------------- */
  /* UI                                 */
  /* ---------------------------------- */

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#0F4C5C]/10 flex items-center justify-center shrink-0">
          {state ===
          'loading' ? (
            <svg
              className="w-5 h-5 text-[#0F4C5C] animate-spin"
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
          ) : state ===
            'ready' ? (
            <svg
              className="w-5 h-5 text-[#6faa99]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-[#F28C00]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01"
              />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <p className="font-semibold text-slate-900">
            Secure Download
          </p>

          <p className="text-sm text-slate-500 mt-1">
            {message}
          </p>

          {state ===
            'ready' && (
            <>
              <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#F28C00] transition-all duration-1000"
                  style={{
                    width: `${((seconds - countdown) / seconds) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Redirecting in{' '}
                  <span className="font-semibold text-[#F28C00]">
                    {countdown}s
                  </span>
                </span>

                <button
                  onClick={() =>
                    router.push(
                      `/download?token=${encodeURIComponent(
                        token
                      )}`
                    )
                  }
                  className="text-xs font-semibold text-[#0F4C5C] hover:text-[#F28C00]"
                >
                  Download now
                </button>
              </div>
            </>
          )}

          {state ===
            'error' && (
            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-3 text-xs font-semibold text-[#0F4C5C] hover:text-[#F28C00]"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}