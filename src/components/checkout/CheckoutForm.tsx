// REWRITE FILE
// src/components/checkout/CheckoutForm.tsx

'use client'

import { useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'

import type {
  CheckoutAddon,
} from '@/types/checkout'

interface CheckoutFormProps {
  productId: string
  productTitle: string
  total: number
  selectedAddons: CheckoutAddon[]
  userEmail: string
}

export function CheckoutForm({
  productId,
  productTitle,
  total,
  selectedAddons,
  userEmail,
}: CheckoutFormProps) {
  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  async function handleCheckout() {
    try {
      setLoading(true)
      setError('')

      const res =
        await fetch(
          '/api/paystack/initialize',
          {
            method:
              'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify(
              {
                productId,
                productTitle,
                email:
                  userEmail,
                total,
                addons:
                  selectedAddons.map(
                    (
                      a
                    ) => ({
                      id: a.id,
                      name: a.name,
                      price:
                        a.price,
                      type: a.type,
                    })
                  ),
              }
            ),
          }
        )

      const data =
        await res.json()

      if (
        !res.ok ||
        !data?.authorization_url
      ) {
        throw new Error(
          data?.error ||
            'Unable to initialize payment.'
        )
      }

      window.location.href =
        data.authorization_url
    } catch (
      err: any
    ) {
      setError(
        err.message ||
          'Payment failed.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#0F4C5C] mb-2">
          Account Email
        </label>

        <input
          type="email"
          value={
            userEmail
          }
          readOnly
          className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600 outline-none"
        />
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-[#6faa99]/20 bg-[#6faa99]/5 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="w-5 h-5 text-[#6faa99] shrink-0 mt-0.5" />

          <div>
            <p className="text-sm font-semibold text-[#0F4C5C]">
              Secure Payment
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Your payment is processed securely through Paystack.
            </p>
          </div>
        </div>
      </div>

      {/* Addons Summary */}
      {selectedAddons.length >
        0 && (
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-[#0F4C5C] mb-3">
            Selected Add-ons
          </p>

          <div className="space-y-2">
            {selectedAddons.map(
              (
                addon
              ) => (
                <div
                  key={
                    addon.id
                  }
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-600">
                    {
                      addon.name
                    }
                  </span>

                  <span className="font-medium text-[#0F4C5C]">
                    KES{' '}
                    {Number(
                      addon.price
                    ).toLocaleString()}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={
          handleCheckout
        }
        disabled={
          loading
        }
        className="w-full h-14 rounded-2xl bg-[#F28C00] text-white font-semibold hover:bg-[#da7d00] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Redirecting...
          </>
        ) : (
          <>
            Pay KES{' '}
            {Number(
              total
            ).toLocaleString()}
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-500">
        By proceeding, you agree to our payment terms and delivery policy.
      </p>
    </div>
  )
}