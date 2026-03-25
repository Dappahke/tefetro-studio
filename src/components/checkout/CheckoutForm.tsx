'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Addon {
  id: string
  name: string
  price: number
  type: string
}

interface CheckoutFormProps {
  productId: string
  productTitle: string
  total: number
  selectedAddons: Addon[]
  userEmail: string
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        callback: (response: { reference: string }) => void
        onClose: () => void
      }) => {
        openIframe: () => void
      }
    }
  }
}

export function CheckoutForm({
  productId,
  productTitle,
  total,
  selectedAddons,
  userEmail
}: CheckoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paystackReady, setPaystackReady] = useState(false)

  // Load Paystack script
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.PaystackPop) {
      setPaystackReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setPaystackReady(true)
    script.onerror = () => setError('Failed to load payment system')

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    setError(null)
    setIsLoading(true)

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

    if (!publicKey) {
      setError('Payment system not configured')
      setIsLoading(false)
      return
    }

    if (!paystackReady) {
      setError('Payment system loading... please wait')
      setIsLoading(false)
      return
    }

    // Generate unique reference
    const reference = `TEF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: userEmail,
      amount: Math.round(total * 100), // Convert to smallest currency unit (kobo/cents)
      currency: 'KES', // Paystack primarily uses KES for Kenya, handles conversion
      ref: reference,

      callback: async (response) => {
        try {
          // Call our secure API
          const res = await fetch('/api/protected/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId,
              paymentRef: response.reference,
              addons: selectedAddons.map(a => a.id),
            }),
          })

          const data = await res.json()

          if (!res.ok || !data.success) {
            throw new Error(data.error || 'Order creation failed')
          }

          // Redirect to success page
          router.push(`/dashboard?order=${data.data.orderId}&success=true`)

        } catch (err) {
          setError(err instanceof Error ? err.message : 'Payment verification failed')
          setIsLoading(false)
        }
      },

      onClose: () => {
        setIsLoading(false)
      },
    })

    handler.openIframe()
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-alert/10 border border-alert/20 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-alert flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-alert">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-xs text-alert-600 hover:underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Order Summary Mobile */}
      <div className="lg:hidden bg-canvas rounded-xl p-4 space-y-2">
        <p className="text-sm text-neutral-600 flex justify-between">
          <span>{productTitle}</span>
          <span className="font-medium">Base Plan</span>
        </p>
        {selectedAddons.map((addon) => (
          <p key={addon.id} className="text-sm text-neutral-600 flex justify-between">
            <span>{addon.name}</span>
            <span className="font-medium text-sage">+ {addon.type}</span>
          </p>
        ))}
        <div className="border-t border-mist/50 pt-2 mt-2">
          <p className="flex justify-between font-bold text-deep-700">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading || !paystackReady}
        className={`
          w-full btn-primary py-4 text-lg
          ${(isLoading || !paystackReady) ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : !paystackReady ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Pay KES {total.toLocaleString()}
          </span>
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-neutral-500 text-center">
        By clicking Pay, you agree to our{' '}
        <a href="/terms" className="text-deep-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-deep-600 hover:underline">Privacy Policy</a>
      </p>
    </div>
  )
}