import Link from 'next/link'
import { verifySession } from '@/lib/dal'

interface CancelPageProps {
  searchParams: {
    ref?: string
    reason?: string
  }
}

export default async function CheckoutCancelPage({ searchParams }: CancelPageProps) {
  const session = await verifySession()
  const { ref, reason } = await searchParams

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-[#F28C00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#F28C00]/20">
          <svg className="w-10 h-10 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#0F4C5C] mb-3">
          Payment Cancelled
        </h1>
        
        <p className="text-[#1E1E1E]/70 mb-2">
          Your payment was not completed. No charges have been made to your account.
        </p>
        
        {ref && (
          <p className="text-sm text-[#1E1E1E]/50 mb-8">
            Reference: <code className="font-mono text-[#1F4E79]">{ref}</code>
          </p>
        )}

        {/* Help Card */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10 mb-8 text-left">
          <h3 className="font-semibold text-[#0F4C5C] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why did this happen?
          </h3>
          
          <ul className="space-y-3 text-sm text-[#1E1E1E]/70">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#6faa99] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You closed the payment window before completing
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#6faa99] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              There was an issue with your payment method
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#6faa99] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              The payment session expired
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full py-3 px-6 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-200 shadow-lg shadow-[#F28C00]/20 hover:shadow-xl hover:shadow-[#F28C00]/30 hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </span>
          </Link>
          
          <Link
            href="/products"
            className="block w-full py-3 px-6 bg-white text-[#0F4C5C] font-semibold rounded-xl border-2 border-[#0F4C5C]/20 hover:border-[#0F4C5C]/40 hover:bg-[#0F4C5C]/5 transition-all duration-200"
          >
            Back to Products
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-[#6faa99]/5 rounded-xl border border-[#6faa99]/10">
          <p className="text-sm text-[#6faa99] flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Need help?{' '}
            <a href="mailto:support@tefetra.studio" className="underline font-medium hover:text-[#0F4C5C]">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}