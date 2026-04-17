import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import DownloadButton from '@/components/checkout/DownloadButton'

interface SuccessPageProps {
  searchParams: Promise<{
    order?: string
    ref?: string
    token?: string
  }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login?redirectTo=/checkout/success')
  }

  const { order: orderId, token: initialToken } = await searchParams

  // Fetch order details if orderId provided
  let order = null
  if (orderId) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, product:products(title, file_path)')
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .single()
    
    if (data) order = data
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-[#6faa99]/10 rounded-full flex items-center justify-center mx-auto border-2 border-[#6faa99]/20">
            <svg className="w-12 h-12 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#0F4C5C]/10">
          {/* Heading */}
          <h1 className="text-2xl font-bold text-[#0F4C5C] mb-2 text-center">
            Payment Successful!
          </h1>
          
          <p className="text-[#1E1E1E]/60 text-center mb-6">
            Thank you for your purchase. A receipt has been sent to{' '}
            <span className="font-medium text-[#0F4C5C]">{session.email}</span>
          </p>

          {/* Order Details Card */}
          {order && (
            <div className="bg-[#FAF9F6] rounded-xl p-4 mb-6 border border-[#0F4C5C]/5">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#0F4C5C]/10">
                <span className="text-xs text-[#1E1E1E]/60">Order ID</span>
                <code className="text-xs font-mono text-[#1F4E79] bg-[#1F4E79]/10 px-2 py-1 rounded">
                  {order.id.slice(-8).toUpperCase()}
                </code>
              </div>
              
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-5 h-5 text-[#0F4C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0F4C5C] line-clamp-2">{order.product?.title || 'Architectural Plan'}</p>
                  <p className="text-xs text-[#1E1E1E]/50">Digital download</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-[#0F4C5C]/10">
                <span className="text-sm text-[#1E1E1E]/60">Total Paid</span>
                <span className="font-bold text-[#F28C00]">KES {Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Download Button - Client Component */}
          <Suspense fallback={
            <div className="mb-4 p-3 bg-[#0F4C5C]/5 rounded-xl flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-[#0F4C5C] animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm text-[#0F4C5C]">Preparing download...</span>
            </div>
          }>
            <DownloadButton orderId={orderId} initialToken={initialToken} />
          </Suspense>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full py-3 px-6 bg-white text-[#0F4C5C] font-semibold rounded-xl border-2 border-[#0F4C5C]/20 hover:border-[#0F4C5C]/40 hover:bg-[#0F4C5C]/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Dashboard
            </Link>
            
            <Link
              href="/products"
              className="block w-full py-3 px-6 bg-white text-[#1E1E1E]/70 font-semibold rounded-xl border border-[#1E1E1E]/20 hover:border-[#1E1E1E]/40 hover:bg-[#1E1E1E]/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#1E1E1E]/50">
            Need help?{' '}
            <a href="mailto:support@tefetra.studio" className="text-[#0F4C5C] hover:text-[#F28C00] transition-colors font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}