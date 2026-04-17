'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Addon {
  id: string
  name: string
  price: number
  type: 'drawing' | 'service'
}

interface CheckoutFormProps {
  productId: string
  productTitle: string
  total: number
  selectedAddons: Addon[]
  userEmail: string
}

// Paystack callback response type
interface PaystackResponse {
  reference: string
  status: 'success' | 'failed' | 'abandoned'
  trans: string
  transaction: string
  message: string
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
        metadata?: Record<string, any>
        callback: (response: PaystackResponse) => void
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
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  // Load Paystack script with error handling
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (window.PaystackPop) {
      setPaystackReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => {
      console.log('Paystack SDK loaded')
      setPaystackReady(true)
    }
    script.onerror = () => {
      console.error('Failed to load Paystack SDK')
      setError('Failed to load payment system. Please refresh the page.')
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Generate unique reference with timestamp and random component
  const generateReference = useCallback(() => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `TEF-${timestamp}-${random}`
  }, [])

  // Verify payment with backend API
  const verifyPaymentWithBackend = async (paymentRef: string) => {
    try {
      const res = await fetch('/api/protected/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          paymentRef,
          addons: selectedAddons.map(a => a.id),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Too many attempts. Please wait a moment.')
        }
        if (res.status === 400 && data.error?.includes('already exists')) {
          // Redirect to success page with order info
          router.push(`/checkout/success?order=${data.data.orderId}`)
          return
        }
        
        throw new Error(data.error || 'Order creation failed')
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed')
      }

      // Redirect to success page with the order ID
      router.push(`/checkout/success?order=${data.data.orderId}`)

    } catch (err) {
      console.error('Payment verification error:', err)
      
      if (retryCount < MAX_RETRIES && err instanceof TypeError) {
        setRetryCount(prev => prev + 1)
        setError(`Connection issue. Retrying... (${retryCount + 1}/${MAX_RETRIES})`)
        
        setTimeout(() => {
          verifyPaymentWithBackend(paymentRef)
        }, Math.pow(2, retryCount) * 1000)
        
        return
      }

      setError(err instanceof Error ? err.message : 'Payment verification failed')
      setIsLoading(false)
      
      if (err instanceof Error && err.message.includes('verification')) {
        setError(`${err.message}. Don't worry - if your payment was successful, you'll receive an email receipt shortly.`)
      }
    }
  }

  // Handle payment completion
  const handlePayment = async () => {
    setError(null)
    setIsLoading(true)

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

    if (!publicKey) {
      setError('Payment system not configured. Please contact support.')
      setIsLoading(false)
      return
    }

    if (!paystackReady) {
      setError('Payment system still loading... Please wait a moment and try again.')
      setIsLoading(false)
      return
    }

    // Validate amount (must be at least 100 kobo / 1 KES)
    if (total < 1) {
      setError('Invalid order amount')
      setIsLoading(false)
      return
    }

    const reference = generateReference()

    // Define callback as a regular function (not async) to avoid Paystack validation issues
    const paymentCallback = (response: PaystackResponse) => {
      console.log('Paystack callback received:', response)
      
      if (response.status !== 'success') {
        setError(`Payment ${response.status}. Please try again.`)
        setIsLoading(false)
        return
      }

      verifyPaymentWithBackend(response.reference)
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: userEmail,
      amount: Math.round(total * 100), // Convert to kobo
      currency: 'KES',
      ref: reference,
      metadata: {
        product_id: productId,
        product_title: productTitle,
        addons_count: selectedAddons.length,
        custom_fields: [
          {
            display_name: "Product",
            variable_name: "product_title",
            value: productTitle
          },
          {
            display_name: "Addons",
            variable_name: "addons",
            value: selectedAddons.map(a => a.name).join(', ') || 'None'
          }
        ]
      },
      callback: paymentCallback,
      onClose: () => {
        setIsLoading(false)
        setError('Payment window closed. If you completed payment, check your email or dashboard.')
      },
    })

    handler.openIframe()
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-[#F28C00]/10 border border-[#F28C00]/20 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-[#F28C00] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#F28C00]">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                setRetryCount(0)
              }}
              className="text-xs text-[#F28C00]/80 hover:text-[#F28C00] hover:underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Order Summary Mobile */}
      <div className="lg:hidden bg-[#FAF9F6] rounded-xl p-4 space-y-2 border border-[#0F4C5C]/10">
        <p className="text-sm text-[#1E1E1E]/70 flex justify-between">
          <span>{productTitle}</span>
          <span className="font-medium">Base Plan</span>
        </p>
        {selectedAddons.map((addon) => (
          <p key={addon.id} className="text-sm text-[#1E1E1E]/70 flex justify-between">
            <span>{addon.name}</span>
            <span className={`font-medium ${addon.type === 'service' ? 'text-[#6faa99]' : 'text-[#0F4C5C]'}`}>
              + {addon.type === 'service' ? 'Service' : 'Drawing'}
            </span>
          </p>
        ))}
        <div className="border-t border-[#0F4C5C]/10 pt-2 mt-2">
          <p className="flex justify-between font-bold text-[#0F4C5C]">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading || !paystackReady}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-white
          bg-[#F28C00] hover:bg-[#F28C00]/90
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center justify-center gap-2
          shadow-lg shadow-[#F28C00]/20
          hover:shadow-xl hover:shadow-[#F28C00]/30
          hover:-translate-y-0.5
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

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-[#1E1E1E]/50">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>SSL Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-[#6faa99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>256-bit Encryption</span>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-[#1E1E1E]/50 text-center">
        By clicking Pay, you agree to our{' '}
        <a href="/terms" className="text-[#0F4C5C] hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-[#0F4C5C] hover:underline">Privacy Policy</a>
      </p>

      {/* Backup Notice */}
      <p className="text-[10px] text-[#1E1E1E]/40 text-center">
        Payment processed securely by Paystack. If you encounter any issues, 
        please contact <a href="mailto:support@tefetra.studio" className="text-[#0F4C5C] hover:underline">support@tefetra.studio</a>
      </p>
    </div>
  )
}