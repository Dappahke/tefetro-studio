// src/components/checkout/PaymentRetry.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  Loader2,
  RotateCw,
  MessageCircle,
  X,
  ShieldCheck,
} from 'lucide-react'

interface PaymentRetryProps {
  productId: string
  productTitle: string
  total: number
  selectedAddons: Array<{
    id: string
    name: string
    price: number
    type: string
  }>
  userEmail: string
  originalRef?: string
  onClose?: () => void
}

export function PaymentRetry({
  productId,
  productTitle,
  total,
  selectedAddons,
  originalRef,
  onClose,
}: PaymentRetryProps) {
  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [checking, setChecking] =
    useState(
      !!originalRef
    )

  const [error, setError] =
    useState<
      string | null
    >(null)

  /* -------------------------------- */
  /* Auto Verify Existing Ref         */
  /* -------------------------------- */
  useEffect(() => {
    if (
      !originalRef
    )
      return

    verifyExisting()
  }, [])

  async function verifyExisting() {
    try {
      setChecking(
        true
      )

      const res =
        await fetch(
          `/api/protected/orders/check?ref=${originalRef}`
        )

      const data =
        await res.json()

      if (
        data.exists
      ) {
        router.push(
          `/checkout/success?order=${data.orderId}`
        )
      }
    } catch {
      // silent fail
    } finally {
      setChecking(
        false
      )
    }
  }

  /* -------------------------------- */
  /* Retry Flow                       */
  /* -------------------------------- */
  async function handleRetry() {
    setLoading(
      true
    )
    setError(null)

    try {
      if (
        originalRef
      ) {
        const res =
          await fetch(
            `/api/protected/orders/check?ref=${originalRef}`
          )

        const data =
          await res.json()

        if (
          data.exists
        ) {
          router.push(
            `/checkout/success?order=${data.orderId}`
          )
          return
        }
      }

      const addonParams =
        selectedAddons.length >
        0
          ? `&addons=${selectedAddons
              .map(
                (
                  a
                ) =>
                  a.id
              )
              .join(
                ','
              )}`
          : ''

      router.push(
        `/checkout?productId=${productId}${addonParams}&retry=true`
      )
    } catch {
      setError(
        'Unable to verify payment right now. Please try again.'
      )
      setLoading(
        false
      )
    }
  }

  /* -------------------------------- */
  /* WhatsApp Support                 */
  /* -------------------------------- */
  function contactSupport() {
    const message =
      encodeURIComponent(
        `Hello Tefetro Support, I experienced a payment issue.\n\nProduct: ${productTitle}\nAmount: KES ${total.toLocaleString()}\nReference: ${originalRef || 'N/A'}`
      )

    window.open(
      `https://wa.me/254791939235?text=${message}`,
      '_blank'
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#F28C00] via-[#f3a63f] to-[#0F4C5C]" />

        {/* Close */}
        {onClose && (
          <button
            onClick={
              onClose
            }
            className="absolute top-4 right-4 h-10 w-10 rounded-2xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
          >
            <X className="w-4 h-4 text-slate-700" />
          </button>
        )}

        <div className="p-7">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#F28C00]/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#F28C00]" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Payment Not Confirmed
              </h3>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Your payment may still be processing. We’ll verify it first before retrying.
              </p>
            </div>
          </div>

          {/* Checking */}
          {checking && (
            <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3 text-sm text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking latest payment status...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Order Summary
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {productTitle}
            </p>

            <p className="mt-3 text-2xl font-bold text-[#0F4C5C]">
              KES{' '}
              {total.toLocaleString()}
            </p>

            {selectedAddons.length >
              0 && (
              <p className="mt-2 text-sm text-slate-500">
                Includes{' '}
                {
                  selectedAddons.length
                }{' '}
                add-on
                {selectedAddons.length >
                1
                  ? 's'
                  : ''}
              </p>
            )}

            {originalRef && (
              <p className="mt-3 text-xs text-slate-400 break-all">
                Ref:{' '}
                {
                  originalRef
                }
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={
                handleRetry
              }
              disabled={
                loading ||
                checking
              }
              className="w-full h-12 rounded-2xl bg-[#F28C00] text-white font-semibold hover:bg-[#de8207] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  Retry Payment
                </>
              )}
            </button>

            <button
              onClick={
                contactSupport
              }
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </button>
          </div>

          {/* Footer Trust */}
          <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-[#0F4C5C]" />
            If you were charged but no order appears, our team will manually resolve it promptly.
          </div>
        </div>
      </div>
    </div>
  )
}