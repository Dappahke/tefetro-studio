import 'server-only'
import { cache } from 'react'

interface GeoData {
  country: string
  country_code: string
  currency: string
  ip: string
}

// Simple in-memory cache (use Redis in production)
const geoCache = new Map<string, { data: GeoData; expires: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export const getGeoData = cache(async (ip: string): Promise<GeoData | null> => {
  // Check cache
  const cached = geoCache.get(ip)
  if (cached && Date.now() < cached.expires) {
    return cached.data
  }

  try {
    // ipapi.co free tier - no API key needed for basic data
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 } // Next.js cache 24h
    })

    if (!response.ok) throw new Error('Geo lookup failed')

    const data = await response.json()

    if (data.error) throw new Error(data.reason)

    const geoData: GeoData = {
      country: data.country_name,
      country_code: data.country_code,
      currency: data.currency,
      ip: data.ip,
    }

    // Store in cache
    geoCache.set(ip, { data: geoData, expires: Date.now() + CACHE_TTL })
    
    return geoData
  } catch (error) {
    console.error('Geolocation failed:', error)
    return null
  }
})

// Country to currency mapping for common cases (fallback if API fails)
export const countryToCurrency: Record<string, string> = {
  'KE': 'KES', 'TZ': 'TZS', 'UG': 'UGX', 'RW': 'RWF', 'BI': 'BIF', // East Africa
  'NG': 'NGN', 'GH': 'GHS', 'SN': 'XOF', 'CI': 'XOF', // West Africa
  'ZA': 'ZAR', 'ZM': 'ZMW', 'ZW': 'USD', 'MW': 'MWK', // Southern Africa
  'US': 'USD', 'CA': 'CAD', 'MX': 'MXN', // North America
  'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', // Europe
  'IN': 'INR', 'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW', 'SG': 'SGD', // Asia
  'AE': 'AED', 'SA': 'SAR', 'QA': 'QAR', 'KW': 'KWD', // Middle East
  'AU': 'AUD', 'NZ': 'NZD', // Oceania
  'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', // South America
}

export function getCurrencyFromCountry(countryCode: string): string {
  return countryToCurrency[countryCode] || 'USD'
}