// src/app/api/debug/env/route.ts

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const secret = process.env.PAYSTACK_SECRET_KEY

  return NextResponse.json({
    hasSecret: !!secret,
    secretPrefix: secret?.slice(0, 7) || 'none',
    secretLength: secret?.length || 0,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'not set',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}