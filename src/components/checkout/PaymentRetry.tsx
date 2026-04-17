'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PaymentRetryProps {
  productId: string
  productTitle: string
  total: number
  selectedAddons: Array<{ id: string; name: string; price: number; type: string }>
  userEmail: string
  originalRef?: string
  onClose?: () => void
}

export function PaymentRetry({
  productId,
  productTitle,
  total,
  selectedAddons,
  userEmail,
  originalRef,
  onClose
}: PaymentRetryProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRetry = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if original payment actually succeeded (webhook might have processed it)
      if (originalRef) {
        const checkRes = await fetch(`/api/protected/orders/check?ref=${originalRef}`)
        const checkData = await checkRes.json()
        
        if (checkData.exists) {
          // Payment actually succeeded! Redirect to success
          router.push(`/dashboard?order=${checkData.orderId}&success=true`)
          return
        }
      }

      // Otherwise, redirect back to checkout with same params
      const addonParams = selectedAddons.length > 0 
        ? `&addons=${selectedAddons.map(a => a.id).join(',')}` 
        : ''
      
      router.push(`/checkout?productId=${productId}${addonParams}&retry=true`)
      
    } catch (err) {
      setError('Unable to check payment status. Please try again.')
      setIsLoading(false)
    }
  }

  const handleContactSupport = () => {
    window.location.href = `mailto:support@tefetra.studio?subject=Payment Issue - ${originalRef || 'Unknown'}&body=I encountered an issue with my payment for ${productTitle}. Please assist.`
  }

  return (
    <div className="fixed inset-0 bg-[#1E1E1E]/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#0F4C5C]/10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#F28C00]/10 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F28C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[#0F4C5C]">Payment Incomplete</h3>
            <p className="text-xs text-[#1E1E1E]/50">We couldn&apos;t confirm your payment</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#F28C00]/10 border border-[#F28C00]/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-[#F28C00]">{error}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-[#FAF9F6] rounded-xl p-4 mb-6 border border-[#0F4C5C]/5">
          <p className="text-sm text-[#1E1E1E]/60 mb-1">{productTitle}</p>
          <p className="text-lg font-bold text-[#F28C00]">KES {total.toLocaleString()}</p>
          {selectedAddons.length > 0 && (
            <p className="text-xs text-[#1E1E1E]/50 mt-1">
              + {selectedAddons.length} addon{selectedAddons.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#F28C00] text-white font-semibold rounded-xl hover:bg-[#F28C00]/90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Checking...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Payment
              </>
            )}
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full py-3 px-4 bg-white text-[#0F4C5C] font-semibold rounded-xl border-2 border-[#0F4C5C]/20 hover:border-[#0F4C5C]/40 hover:bg-[#0F4C5C]/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contact Support
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2 text-sm text-[#1E1E1E]/50 hover:text-[#1E1E1E] transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Reassurance */}
        <p className="mt-4 text-xs text-[#1E1E1E]/40 text-center">
          If you were charged but don&apos;t see your order, our team will resolve this within 24 hours.
        </p>
      </div>
    </div>
  )
}