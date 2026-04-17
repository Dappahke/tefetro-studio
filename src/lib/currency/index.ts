import 'server-only'
import { headers } from 'next/headers'
import { getGeoData, getCurrencyFromCountry } from './geo'
import { convertPrice, formatPrice } from './rates'

export interface CurrencyInfo {
  amount: number
  currency: string
  formatted: string
  country: string
  countryCode: string
  exchangeRate: number
  isEstimated: boolean
}

// Helper function to check if IP is private/reserved
function isPrivateIp(ip: string): boolean {
  if (!ip) return true
  
  // Remove IPv6 prefix if present
  ip = ip.replace(/^::ffff:/, '')
  
  // Localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true
  
  // Private IPv4 ranges
  if (ip.startsWith('10.')) return true
  if (ip.startsWith('172.16.') || ip.startsWith('172.17.') || ip.startsWith('172.18.') || 
      ip.startsWith('172.19.') || ip.startsWith('172.20.') || ip.startsWith('172.21.') ||
      ip.startsWith('172.22.') || ip.startsWith('172.23.') || ip.startsWith('172.24.') ||
      ip.startsWith('172.25.') || ip.startsWith('172.26.') || ip.startsWith('172.27.') ||
      ip.startsWith('172.28.') || ip.startsWith('172.29.') || ip.startsWith('172.30.') ||
      ip.startsWith('172.31.')) return true
  if (ip.startsWith('192.168.')) return true
  
  // Reserved ranges
  if (ip.startsWith('100.64.') || ip.startsWith('100.65.') || ip.startsWith('100.66.') ||
      ip.startsWith('100.67.') || ip.startsWith('100.68.') || ip.startsWith('100.69.') ||
      ip.startsWith('100.70.') || ip.startsWith('100.71.') || ip.startsWith('100.72.') ||
      ip.startsWith('100.73.') || ip.startsWith('100.74.') || ip.startsWith('100.75.') ||
      ip.startsWith('100.76.') || ip.startsWith('100.77.') || ip.startsWith('100.78.') ||
      ip.startsWith('100.79.') || ip.startsWith('100.80.') || ip.startsWith('100.81.') ||
      ip.startsWith('100.82.') || ip.startsWith('100.83.') || ip.startsWith('100.84.') ||
      ip.startsWith('100.85.') || ip.startsWith('100.86.') || ip.startsWith('100.87.') ||
      ip.startsWith('100.88.') || ip.startsWith('100.89.') || ip.startsWith('100.90.') ||
      ip.startsWith('100.91.') || ip.startsWith('100.92.') || ip.startsWith('100.93.') ||
      ip.startsWith('100.94.') || ip.startsWith('100.95.') || ip.startsWith('100.96.') ||
      ip.startsWith('100.97.') || ip.startsWith('100.98.') || ip.startsWith('100.99.') ||
      ip.startsWith('100.100.')) return true // Carrier-grade NAT
  
  // Docker/container networks
  if (ip.startsWith('172.')) return true
  
  return false
}

// Helper to get a valid public IP from headers
function getPublicIp(headersList: Headers): string {
  // Try x-forwarded-for (most reliable)
  const forwarded = headersList.get('x-forwarded-for')
  if (forwarded) {
    // Get the first IP in the chain
    const ips = forwarded.split(',').map(ip => ip.trim())
    for (const ip of ips) {
      if (!isPrivateIp(ip)) {
        return ip // Return first public IP found
      }
    }
  }
  
  // Try x-real-ip
  const realIp = headersList.get('x-real-ip')
  if (realIp && !isPrivateIp(realIp)) {
    return realIp
  }
  
  // Try cf-connecting-ip (Cloudflare)
  const cfIp = headersList.get('cf-connecting-ip')
  if (cfIp && !isPrivateIp(cfIp)) {
    return cfIp
  }
  
  // Try true-client-ip
  const trueClientIp = headersList.get('true-client-ip')
  if (trueClientIp && !isPrivateIp(trueClientIp)) {
    return trueClientIp
  }
  
  // No public IP found - return null to trigger fallback
  return ''
}

export async function getUserCurrencyInfo(amountKES: number): Promise<CurrencyInfo> {
  // Get IP from request headers
  const headersList = await headers()
  const ip = getPublicIp(headersList)
  
  let geo = null
  let currency = 'USD'
  let country = 'Unknown'
  let countryCode = 'US'
  let isEstimated = false

  // Only attempt geolocation if we have a valid public IP
  if (ip) {
    geo = await getGeoData(ip)
  } else {
    console.log('No public IP found, using fallback detection')
  }
  
  if (geo) {
    currency = geo.currency || getCurrencyFromCountry(geo.country_code)
    country = geo.country
    countryCode = geo.country_code
  } else {
    // Fallback to country detection from accept-language
    const acceptLang = headersList.get('accept-language') || ''
    if (acceptLang.includes('en-GB')) {
      currency = 'GBP'
      countryCode = 'GB'
    } else if (acceptLang.includes('en-US')) {
      currency = 'USD'
      countryCode = 'US'
    } else if (acceptLang.includes('sw')) {
      currency = 'KES'
      countryCode = 'KE'
    } else if (acceptLang.includes('fr')) {
      currency = 'EUR'
      countryCode = 'FR'
    } else if (acceptLang.includes('de')) {
      currency = 'EUR'
      countryCode = 'DE'
    }
    isEstimated = true
  }

  // Convert price
  const conversion = await convertPrice(amountKES, currency)

  return {
    amount: conversion.amount,
    currency: conversion.currency,
    formatted: formatPrice(conversion.amount, currency, getLocaleForCountry(countryCode)),
    country,
    countryCode,
    exchangeRate: conversion.rate,
    isEstimated,
  }
}

function getLocaleForCountry(countryCode: string): string {
  const localeMap: Record<string, string> = {
    'KE': 'sw-KE', 'TZ': 'sw-TZ', 'UG': 'en-UG',
    'NG': 'en-NG', 'GH': 'en-GH',
    'ZA': 'en-ZA',
    'US': 'en-US', 'GB': 'en-GB',
    'DE': 'de-DE', 'FR': 'fr-FR',
    'IN': 'en-IN', 'JP': 'ja-JP',
    'BR': 'pt-BR',
  }
  return localeMap[countryCode] || 'en-US'
}