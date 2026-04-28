// src/app/api/admin/upload/route.ts
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Increase request body size for uploads
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // 2. Verify logged in user
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Auth error:', userError)

      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 3. Verify admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      console.error('Admin check failed:', profileError)

      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    console.log('✅ Admin verified:', user.email)

    // 4. Parse form data
    const formData = await request.formData()

    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'drawings'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 5. Allowed types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // 6. 50MB max upload
    const MAX_SIZE = 50 * 1024 * 1024

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 50MB)' },
        { status: 400 }
      )
    }

    // 7. Clean filename
    const ext = file.name.split('.').pop()
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase()

    const filename = `${Date.now()}-${safeName}.${ext}`
    const path = `${folder}/${filename}`

    // 8. Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await adminClient.storage
      .from('drawings')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)

      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    // 9. Get public URL
    const { data } = adminClient.storage
      .from('drawings')
      .getPublicUrl(path)

    return NextResponse.json({
      success: true,
      path,
      url: data.publicUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (err: any) {
    console.error('Upload error:', err)

    return NextResponse.json(
      {
        error: err?.message || 'Failed to upload file',
      },
      { status: 500 }
    )
  }
}