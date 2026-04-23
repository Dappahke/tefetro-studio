// src/app/checkout/success/page.tsx

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/dal'
import {
  CheckCircle2,
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

import AutoRedirectToDownload from '@/components/checkout/AutoRedirectToDownload'

interface Props {
  searchParams: {
    reference?: string
    trxref?: string
  }
}

export default async function SuccessPage({
  searchParams,
}: Props) {
  const session =
    await verifySession()

  if (!session) {
    redirect(
      '/login?redirectTo=/checkout/success'
    )
  }

  const supabase =
    await createClient()

  const paymentRef =
    searchParams.reference ||
    searchParams.trxref

  if (!paymentRef) {
    redirect('/dashboard/orders')
  }

  /* ----------------------------- */
  /* Find order by payment ref     */
  /* ----------------------------- */

  let order: any = null

  const { data } =
    await supabase
      .from('orders')
      .select(
        `
        *,
        product:products(
          id,
          title,
          file_path,
          slug
        )
      `
      )
      .eq(
        'payment_ref',
        paymentRef
      )
      .eq(
        'user_id',
        session.user.id
      )
      .single()

  if (data) {
    order = data
  }

  const productTitle =
    order?.product
      ?.title ||
    'Architectural Plan'

  const totalPaid =
    Number(
      order?.total || 0
    )

  const orderId =
    order?.id
      ? order.id
          .slice(-8)
          .toUpperCase()
      : paymentRef
          .slice(-8)
          .toUpperCase()

  const token =
    order?.download_url ||
    ''

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* Redirect Controller */}
      {token && (
        <AutoRedirectToDownload
          token={token}
          seconds={5}
        />
      )}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="rounded-[30px] overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* HERO */}
          <div className="bg-gradient-to-r from-[#0F4C5C] to-[#143f49] px-6 md:px-10 py-10 text-center text-white">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-10 h-10 text-[#6faa99]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Payment Successful
            </h1>

            <p className="mt-3 text-white/75 max-w-xl mx-auto">
              Your payment has been confirmed and your files are ready.
            </p>

            {token ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm">
                <ArrowRight className="w-4 h-4" />
                Redirecting to downloads in 5 seconds...
              </div>
            ) : (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-400/20 px-4 py-2 text-sm text-amber-100">
                Preparing your secure download...
              </div>
            )}
          </div>

          {/* BODY */}
          <div className="p-6 md:p-10">
            <div className="grid md:grid-cols-[1fr_320px] gap-8">
              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-5">
                  Order Receipt
                </h2>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                  <Row
                    label="Customer"
                    value={
                      session.email ||
                      'Client'
                    }
                  />

                  <Row
                    label="Payment Status"
                    value="Paid"
                    success
                  />

                  <Row
                    label="Order ID"
                    value={
                      orderId
                    }
                  />

                  <Row
                    label="Product"
                    value={
                      productTitle
                    }
                  />

                  <Row
                    label="Amount Paid"
                    value={`KES ${totalPaid.toLocaleString()}`}
                    highlight
                  />
                </div>

                {token && (
                  <Link
                    href={`/download?token=${encodeURIComponent(
                      token
                    )}`}
                    className="mt-6 h-12 rounded-2xl bg-[#F28C00] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#e38200] transition"
                  >
                    Download Now
                  </Link>
                )}
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 p-5">
                  <p className="font-semibold text-slate-900">
                    What Happens Next
                  </p>

                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>
                      • Secure download unlocks instantly
                    </li>
                    <li>
                      • Order stored in dashboard
                    </li>
                    <li>
                      • Re-download anytime
                    </li>
                    <li>
                      • Support available if needed
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-[#0F4C5C]/10 bg-[#0F4C5C]/5 p-5">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#0F4C5C] mt-0.5" />

                    <div>
                      <p className="font-semibold text-[#0F4C5C]">
                        Secure Purchase Record
                      </p>

                      <p className="text-sm text-slate-600 mt-1">
                        Your payment has been verified and safely stored.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="w-full h-12 rounded-2xl bg-[#0F4C5C] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#143d48] transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Link>

                  <Link
                    href="/products"
                    className="w-full h-12 rounded-2xl border border-slate-200 bg-white text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
              Need help?{' '}
              <a
                href="mailto:support@tefetro.studio"
                className="font-medium text-[#0F4C5C] hover:text-[#F28C00]"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Row({
  label,
  value,
  success = false,
  highlight = false,
}: {
  label: string
  value: string
  success?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={[
          'text-sm font-semibold text-right',
          success
            ? 'text-green-600'
            : highlight
            ? 'text-[#F28C00] text-base'
            : 'text-slate-900',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}