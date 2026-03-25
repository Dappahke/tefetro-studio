'use client'

import { useState, useEffect } from 'react'

interface PriceDisplayCompactProps {
  amountKES: number
  className?: string
}

type Currency = 'KES' | 'USD' | 'EUR' | 'GBP'

// Simplified rates for client-side (approximate)
const RATES: Record<Currency, number> = {
  KES: 1,
  USD: 0.0077,
  EUR: 0.0071,
  GBP: 0.0061,
}

const SYMBOLS: Record<Currency, string> = {
  KES: 'KES',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function PriceDisplayCompact({ amountKES, className = '' }: PriceDisplayCompactProps) {
  const [currency, setCurrency] = useState<Currency>('KES')
  const [detected, setDetected] = useState(true)

  useEffect(() => {
    // Try to get currency from cookie (set by server) or detect
    const saved = document.cookie.match(/preferredCurrency=([A-Z]{3})/)?.[1] as Currency
    if (saved && RATES[saved]) {
      setCurrency(saved)
      setDetected(false)
      return
    }

    // Simple detection from browser
    const locale = navigator.language
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (locale.includes('en-GB') || locale.includes('en-IE')) setCurrency('GBP')
    else if (locale.includes('de') || locale.includes('fr') || locale.includes('it') || locale.includes('es')) setCurrency('EUR')
    else if (locale.includes('en-US') || tz.startsWith('America/')) setCurrency('USD')
    else setCurrency('KES') // Default
  }, [])

  const converted = amountKES * RATES[currency]
  
  const format = (amount: number, curr: Currency): string => {
    if (curr === 'KES') {
      return `${SYMBOLS[curr]} ${Math.round(amount).toLocaleString()}`
    }
    return `${SYMBOLS[curr]}${amount.toFixed(2)}`
  }

  const toggle = () => {
    const currencies: Currency[] = ['KES', 'USD', 'EUR', 'GBP']
    const currentIndex = currencies.indexOf(currency)
    const next = currencies[(currentIndex + 1) % currencies.length]
    setCurrency(next)
    setDetected(false)
    
    // Save preference
    document.cookie = `preferredCurrency=${next};path=/;max-age=${60*60*24*30}`
  }

  return (
    <button
      onClick={toggle}
      className={`font-bold text-tefetra hover:text-tefetra-600 transition-colors ${className}`}
      title={`Click to change currency${detected ? ' (auto-detected)' : ''}`}
    >
      <span className="text-lg">{format(converted, currency)}</span>
      {detected && (
        <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-sage/20 text-sage rounded-full align-top">
          auto
        </span>
      )}
    </button>
  )
}