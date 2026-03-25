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

export async function getUserCurrencyInfo(amountKES: number): Promise<CurrencyInfo> {
  // Get IP from request headers
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || '8.8.8.8' // Fallback for localhost

  // Detect location
  const geo = await getGeoData(ip)
  
  let currency = 'USD'
  let country = 'Unknown'
  let countryCode = 'US'
  let isEstimated = false

  if (geo) {
    currency = geo.currency || getCurrencyFromCountry(geo.country_code)
    country = geo.country
    countryCode = geo.country_code
  } else {
    // Fallback to country detection from accept-language
    const acceptLang = headersList.get('accept-language') || ''
    if (acceptLang.includes('en-GB')) currency = 'GBP'
    else if (acceptLang.includes('en-US')) currency = 'USD'
    else if (acceptLang.includes('sw')) { currency = 'KES'; countryCode = 'KE' }
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