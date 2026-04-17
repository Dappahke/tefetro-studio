import Link from 'next/link'
import { verifySession } from '@/lib/dal'
import Image from 'next/image'

interface ErrorPageProps {
  searchParams: {
    ref?: string
    message?: string
  }
}

export default async function CheckoutErrorPage({ searchParams }: ErrorPageProps) {
  const session = await verifySession()
  const { ref, message } = await searchParams

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            src="/images/tefetro-logo.png" 
            alt="Tefetro Studios" 
            width={120} 
            height={40} 
            className="mx-auto"
          />
        </div>

        {/* Error Icon */}
        <div className="w-20 h-20 bg-[#F28C00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#F28C00]/20">
          <svg className="w-10 h-10 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#0F4C5C] mb-3">
          Payment Error
        </h1>
        
        <p className="text-[#1E1E1E]/70 mb-4">
          {message || "We encountered an issue processing your payment. No charges have been made."}
        </p>
        
        {ref && (
          <p className="text-sm text-[#1E1E1E]/50 mb-8">
            Reference: <code className="font-mono text-[#1F4E79] bg-[#1F4E79]/10 px-2 py-1 rounded">{ref}</code>
          </p>
        )}

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-[#0F4C5C]/10 mb-8 text-left">
          <h3 className="font-semibold text-[#0F4C5C] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What you can do:
          </h3>
          
          <ul className="space-y-3 text-sm text-[#1E1E1E]/70">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#6faa99] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Check your internet connection and try again
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#6faa99] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Verify your payment method has sufficient funds
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#6faa99] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Try a different payment method (M-Pesa, Card, or Bank Transfer)
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#6faa99] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Wait a few minutes and retry (temporary network issues)
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
            Still having issues?{' '}
            <a href="mailto:support@tefetra.studio" className="underline font-medium hover:text-[#0F4C5C]">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}