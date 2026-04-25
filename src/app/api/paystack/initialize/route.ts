// src/app/api/paystack/initialize/route.ts

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// ── Types ──
interface PaystackInitPayload {
  email: string
  total: number
  productId: string
  productTitle: string
  userId?: string | null
  addons?: Array<{
    id: string
    name: string
    price: number
    type: string
  }>
}

interface PaystackResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

// ── Constants ──
const PAYSTACK_API = 'https://api.paystack.co/transaction/initialize'
const MIN_AMOUNT_KES = 100 // Minimum 1 KES (100 kobo)
const MAX_AMOUNT_KES = 10000000 // Maximum 100,000 KES

// ── Simple in-memory rate limiter (use Redis in production) ──
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10

  const record = rateLimit.get(ip)
  
  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// ── Validation helpers ──
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

function isValidUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

function sanitizeString(str: string, maxLength: number = 200): string {
  return str
    .replace(/[<>\"']/g, '')
    .slice(0, maxLength)
    .trim()
}

// ── Main handler ──
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()

  try {
    // ── Get client IP ──
    const hdrs = headers()
    const forwarded = hdrs.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    // ── Rate limiting ──
    if (!checkRateLimit(ip)) {
      console.warn(`[${requestId}] Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // ── Read and validate body ──
    let rawBody: string
    try {
      rawBody = await req.text()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    if (!rawBody || rawBody.length > 10000) {
      return NextResponse.json(
        { error: 'Request body too large or empty' },
        { status: 400 }
      )
    }

    let body: Record<string, unknown>
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // ── Extract and validate fields ──
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const total = typeof body.total === 'number' ? body.total : NaN
    const productId = typeof body.productId === 'string' ? body.productId.trim() : ''
    const productTitle = typeof body.productTitle === 'string' ? body.productTitle.trim() : ''
    const userId = body.userId === null || body.userId === undefined 
      ? null 
      : typeof body.userId === 'string' ? body.userId.trim() : null
    const addons = Array.isArray(body.addons) ? body.addons : []

    // ── Field validation ──
    const validationErrors: string[] = []

    if (!email || !isValidEmail(email)) {
      validationErrors.push('Valid email is required')
    }

    if (isNaN(total) || total < MIN_AMOUNT_KES || total > MAX_AMOUNT_KES) {
      validationErrors.push(`Amount must be between ${MIN_AMOUNT_KES} and ${MAX_AMOUNT_KES} KES`)
    }

    if (!productId || productId.length < 3 || productId.length > 100) {
      validationErrors.push('Valid product ID is required')
    }

    if (!productTitle || productTitle.length < 1 || productTitle.length > 200) {
      validationErrors.push('Valid product title is required')
    }

    if (userId && !isValidUuid(userId)) {
      validationErrors.push('Invalid user ID format')
    }

    // Validate addons
    const sanitizedAddons = addons.map((addon: any, index: number) => {
      if (!addon || typeof addon !== 'object') {
        validationErrors.push(`Addon ${index}: Invalid format`)
        return null
      }

      const id = typeof addon.id === 'string' ? sanitizeString(addon.id, 50) : ''
      const name = typeof addon.name === 'string' ? sanitizeString(addon.name, 100) : 'Addon'
      const price = typeof addon.price === 'number' ? addon.price : 0
      const type = typeof addon.type === 'string' ? sanitizeString(addon.type, 20) : 'drawing'

      if (!id) {
        validationErrors.push(`Addon ${index}: ID is required`)
      }

      return { id, name, price, type }
    }).filter(Boolean)

    if (validationErrors.length > 0) {
      console.warn(`[${requestId}] Validation failed:`, validationErrors)
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // ── Get secret key ──
    const secret = process.env.PAYSTACK_SECRET_KEY?.trim()

    if (!secret) {
      console.error(`[${requestId}] PAYSTACK_SECRET_KEY not configured`)
      return NextResponse.json(
        { error: 'Payment service temporarily unavailable' },
        { status: 503 }
      )
    }

    if (!secret.startsWith('sk_')) {
      console.error(`[${requestId}] Invalid secret key format`)
      return NextResponse.json(
        { error: 'Payment service configuration error' },
        { status: 500 }
      )
    }

    // ── Build Paystack payload ──
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tefetro.studio'
    const amountInKobo = Math.round(total * 100)

    const paystackPayload = {
      email: sanitizeString(email, 254),
      amount: amountInKobo,
      currency: 'KES',
      callback_url: `${siteUrl}/checkout/success`,
      metadata: {
        user_id: userId,
        product_id: sanitizeString(productId, 100),
        product_title: sanitizeString(productTitle, 200),
        addons: sanitizedAddons,
        request_id: requestId,
        ip_address: ip,
      },
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    }

    // ── Call Paystack ──
    console.log(`[${requestId}] Initializing payment for ${email}, amount: ${amountInKobo} kobo`)

    const response = await fetch(PAYSTACK_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    })

    let paystackData: PaystackResponse
    try {
      paystackData = await response.json()
    } catch {
      console.error(`[${requestId}] Invalid JSON from Paystack`)
      return NextResponse.json(
        { error: 'Payment provider returned invalid response' },
        { status: 502 }
      )
    }

    // ── Handle Paystack response ──
    if (!paystackData.status) {
      console.warn(`[${requestId}] Paystack error:`, paystackData.message)
      return NextResponse.json(
        { error: paystackData.message || 'Unable to initialize payment' },
        { status: 400 }
      )
    }

    if (!paystackData.data?.authorization_url) {
      console.error(`[${requestId}] Paystack missing authorization_url`)
      return NextResponse.json(
        { error: 'Payment provider returned incomplete data' },
        { status: 502 }
      )
    }

    // ── Success ──
    const duration = Date.now() - startTime
    console.log(`[${requestId}] Payment initialized successfully in ${duration}ms, reference: ${paystackData.data.reference}`)

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      access_code: paystackData.data.access_code,
    })

  } catch (error: any) {
    console.error(`[${requestId}] Fatal error:`, error.message || error)
    return NextResponse.json(
      { error: 'Payment initialization failed. Please try again.' },
      { status: 500 }
    )
  }
}

// ── OPTIONS handler for CORS preflight ──
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}