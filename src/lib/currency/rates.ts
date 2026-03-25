import 'server-only'

interface ExchangeRates {
  base: string
  date: string
  rates: Record<string, number>
}

// Cache for exchange rates
let ratesCache: { data: ExchangeRates; expires: number } | null = null
const RATES_CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

export async function getExchangeRates(): Promise<ExchangeRates | null> {
  // Return cached if valid
  if (ratesCache && Date.now() < ratesCache.expires) {
    return ratesCache.data
  }

  try {
    // exchangerate-api.com free tier (1.5k requests/month)
    // Uses USD as base - gives us all currency rates in one call
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      next: { revalidate: 21600 } // Next.js cache 6h
    })

    if (!response.ok) throw new Error('Rates fetch failed')

    const data: ExchangeRates = await response.json()

    // Store in memory cache
    ratesCache = { data, expires: Date.now() + RATES_CACHE_TTL }

    return data
  } catch (error) {
    console.error('Exchange rates fetch failed:', error)
    
    // Return stale cache if available (graceful degradation)
    if (ratesCache) return ratesCache.data
    
    return null
  }
}

// Convert amount from base currency (KES) to target currency
export async function convertPrice(
  amountKES: number,
  targetCurrency: string
): Promise<{ amount: number; rate: number; currency: string }> {
  const rates = await getExchangeRates()
  
  if (!rates || targetCurrency === 'KES') {
    return { amount: amountKES, rate: 1, currency: 'KES' }
  }

  // rates are USD-based, so: KES → USD → target
  const kesToUsd = 1 / rates.rates['KES']  // KES per USD
  const usdToTarget = rates.rates[targetCurrency] || 1
  
  const rate = kesToUsd * usdToTarget
  const converted = amountKES * rate

  return {
    amount: converted,
    rate,
    currency: targetCurrency,
  }
}

// Format price for display
export function formatPrice(
  amount: number,
  currency: string,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}