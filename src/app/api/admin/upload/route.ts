import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/dal'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'

export async function POST(request: Request) {
  try {
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    await verifyAdmin()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, PDF allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum 10MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`
    const path = `products/${filename}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await adminClient.storage
      .from('drawings')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    return NextResponse.json({
      success: true,
      path,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${path}`,
    })

  } catch (err) {
    console.error('Upload error:', err)
    
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}