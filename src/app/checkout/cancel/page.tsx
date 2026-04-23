// src/app/checkout/cancel/page.tsx

import Link from 'next/link'
import {
  XCircle,
  RotateCcw,
  ShoppingBag,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react'

import { verifySession } from '@/lib/dal'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

interface CancelPageProps {
  searchParams: {
    ref?: string
    reason?: string
    productId?: string
    addons?: string
  }
}

export default async function CheckoutCancelPage({
  searchParams,
}: CancelPageProps) {
  await verifySession()

  const {
    ref,
    productId,
    addons,
  } = searchParams

  /* -------------------------------- */
  /* Smart Retry Link                 */
  /* -------------------------------- */
  const retryUrl =
    productId
      ? `/checkout?productId=${productId}${
          addons
            ? `&addons=${addons}`
            : ''
        }`
      : '/checkout'

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumb
          className="mb-8"
          items={[
            {
              label:
                'Checkout',
              href: '/checkout',
            },
            {
              label:
                'Cancelled',
              href: '/checkout/cancel',
            },
          ]}
        />

        <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Hero */}
          <div className="px-6 md:px-10 py-10 text-center border-b border-slate-100 bg-gradient-to-b from-[#fff7ea] to-white">
            <div className="mx-auto h-20 w-20 rounded-full bg-[#F28C00]/10 border border-[#F28C00]/20 flex items-center justify-center mb-5">
              <XCircle className="w-10 h-10 text-[#F28C00]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Payment Cancelled
            </h1>

            <p className="mt-3 text-slate-600 max-w-xl mx-auto">
              Your payment was not completed. No worries — no successful charge has been recorded on this order.
            </p>

            {ref && (
              <p className="mt-4 text-sm text-slate-400">
                Reference:{' '}
                <span className="font-mono text-slate-600">
                  {ref}
                </span>
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-10 grid md:grid-cols-[1fr_320px] gap-8">
            {/* Left */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-5">
                Common Reasons
              </h2>

              <div className="space-y-4">
                {[
                  'You closed the payment window before completion.',
                  'The payment session timed out.',
                  'Your bank or card required extra approval.',
                  'Temporary network interruption during payment.',
                ].map(
                  (
                    item
                  ) => (
                    <div
                      key={
                        item
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>

              {/* Reassurance */}
              <div className="mt-6 rounded-3xl border border-[#0F4C5C]/10 bg-[#0F4C5C]/5 p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#0F4C5C] mt-0.5" />

                  <div>
                    <p className="font-semibold text-[#0F4C5C]">
                      Your Selection Is Still Available
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      You can return to checkout anytime and complete payment securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="font-semibold text-slate-900">
                  What would you like to do next?
                </p>

                <div className="mt-5 space-y-3">
                  <Link
                    href={
                      retryUrl
                    }
                    className="w-full h-12 rounded-2xl bg-[#F28C00] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#de8207] transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry Payment
                  </Link>

                  <Link
                    href="/products"
                    className="w-full h-12 rounded-2xl border border-slate-200 bg-white text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Browse Plans
                  </Link>

                  <a
                    href="https://wa.me/254791939235"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-12 rounded-2xl border border-slate-200 bg-white text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Support
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                If money was deducted but payment failed, contact support with your payment reference for immediate assistance.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}