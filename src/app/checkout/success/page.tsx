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

import DownloadTokenRedirect from '@/components/checkout/DownloadTokenRedirect'

interface Props {
  searchParams: {
    reference?: string
    trxref?: string
  }
}

export default async function SuccessPage({ searchParams }: Props) {
  const session = await verifySession()

  if (!session) {
    redirect('/login?redirectTo=/checkout/success')
  }

  const paymentRef = searchParams.reference || searchParams.trxref

  if (!paymentRef) {
    redirect('/dashboard/orders')
  }

  const supabase = await createClient()

  /* Try to get order */
  let { data: order } = await supabase
    .from('orders')
    .select(
      `
      id,
      total,
      email,
      status,
      payment_ref,
      product:products(
        id,
        title,
        slug
      )
    `
    )
    .eq('payment_ref', paymentRef)
    .limit(1)
    .maybeSingle()

  /* ── SELF-HEAL: If webhook missed, verify with Paystack ── */
  if (!order) {
    console.log('[SUCCESS] Order not found, attempting self-heal:', paymentRef)

    const secret = process.env.PAYSTACK_SECRET_KEY?.trim()

    if (secret) {
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(paymentRef)}`,
        {
          headers: { Authorization: `Bearer ${secret}` },
          cache: 'no-store',
        }
      )

      const verifyData = await verifyRes.json()

      if (verifyData.status && verifyData.data?.status === 'success') {
        const data = verifyData.data
        const metadata = data.metadata || {}

        // Create the missing order
        const { data: inserted } = await supabase
          .from('orders')
          .insert({
            user_id: metadata.user_id || session.user?.id || null,
            email: data.customer?.email || session.email,
            product_id: metadata.product_id || null,
            addons: metadata.addons || [],
            total: data.amount / 100,
            payment_ref: paymentRef,
            status: 'paid',
            metadata: data,
          })
          .select(
            `
            id,
            total,
            email,
            status,
            payment_ref,
            product:products(
              id,
              title,
              slug
            )
          `
          )
          .single()

        if (inserted) {
          order = inserted
          console.log('[SUCCESS] Order self-healed:', inserted.id)
        }
      }
    }
  }

  /* If still no order after self-heal, show error state */
  if (!order) {
    return (
      <main className="min-h-screen bg-[#FAF9F6]">
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
            <h1 className="text-2xl font-bold text-[#0F4C5C] mb-4">
              Order Processing
            </h1>
            <p className="text-slate-500 mb-6">
              Your payment was successful, but we're still processing your order.
              This usually takes a few seconds.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard/orders"
                className="h-12 px-6 rounded-2xl bg-[#0F4C5C] text-white font-semibold flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                View Orders
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="h-12 px-6 rounded-2xl border border-slate-200 text-slate-800 font-semibold"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const product = Array.isArray(order?.product)
    ? order?.product?.[0]
    : order?.product

  const productTitle = product?.title || 'Architectural Plan'
  const totalPaid = Number(order?.total || 0)
  const orderId = order?.id
    ? order.id.slice(-8).toUpperCase()
    : paymentRef.slice(-8).toUpperCase()

  const customerEmail =
    order?.email || session.user?.email || session.email || 'Client'

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <DownloadTokenRedirect reference={paymentRef} seconds={5} />

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
              Your payment has been confirmed and your secure files are being prepared.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm">
              <ArrowRight className="w-4 h-4" />
              Redirecting to downloads in 5 seconds...
            </div>
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
                  <Row label="Customer" value={customerEmail} />
                  <Row label="Payment Status" value="Paid" success />
                  <Row label="Order ID" value={orderId} />
                  <Row label="Product" value={productTitle} />
                  <Row
                    label="Amount Paid"
                    value={`KES ${totalPaid.toLocaleString()}`}
                    highlight
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 p-5">
                  <p className="font-semibold text-slate-900">
                    What Happens Next
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>• Secure download unlocks automatically</li>
                    <li>• Order saved to dashboard</li>
                    <li>• Re-download anytime later</li>
                    <li>• Support available if needed</li>
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
                        Your payment has been verified and securely stored.
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
      <span className="text-sm text-slate-500">{label}</span>
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