'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuickBuyButtonProps {
  productId: string
  selectedAddons?: string[]
  className?: string
  fullWidth?: boolean
}

export function QuickBuyButton({ 
  productId, 
  selectedAddons = [],
  className = '',
  fullWidth = false
}: QuickBuyButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickBuy = () => {
    setIsLoading(true)
    
    const params = new URLSearchParams()
    params.set('productId', productId)
    
    if (selectedAddons.length > 0) {
      params.set('addons', selectedAddons.join(','))
    }
    
    params.set('quickBuy', 'true')
    
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <button
      onClick={handleQuickBuy}
      disabled={isLoading}
      className={`
        relative inline-flex items-center justify-center gap-2 
        bg-tefetra text-white font-semibold rounded-xl
        transition-all duration-300 ease-out
        hover:bg-tefetra-500 hover:shadow-accent hover:-translate-y-0.5
        active:translate-y-0
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${fullWidth ? 'w-full' : ''}
        py-4 px-8 text-lg
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Redirecting...</span>
        </>
      ) : (
        <>
          <span>Quick Buy</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </>
      )}
    </button>
  )
}