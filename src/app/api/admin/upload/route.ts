// src/app/api/admin/upload/route.ts
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server' // Use server client for middleware session
import { limiters, getIdentifier } from '@/lib/security/rate-limiter'

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const identifier = getIdentifier(request)
    const rateLimit = await limiters.general.check(identifier)
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // 2. Get session from middleware (Supabase server client)
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 3. Verify admin role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      console.error('Admin check failed:', profileError)
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('✅ Admin verified:', user.email)

    // 4. Process file upload
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'drawings'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`
    const path = `${folder}/${filename}`

    // Upload to Supabase
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await adminClient.storage
      .from('drawings')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      path,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${path}`,
    })

  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}