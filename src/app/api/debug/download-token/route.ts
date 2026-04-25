// app/api/debug/download-token/route.ts
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { env } from '@/lib/env'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  
  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
  }
  
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
  const signature = createHash('sha256')
    .update(`${orderId}:${expiresAt}:${env.server.DOWNLOAD_SECRET}`)
    .digest('hex')
  
  const token = `${orderId}:${expiresAt}:${signature}`
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return NextResponse.json({ 
    success: true,
    token,
    url: `${baseUrl}/download?token=${token}`,
    expiresIn: '5 minutes'
  })
}