import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    const fileName = body.fileName
    const folder = body.folder || 'drawings'

    const ext = fileName.split('.').pop()
    const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`

    const { data, error } = await adminClient.storage
      .from('drawings')
      .createSignedUploadUrl(path)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      token: data.token,
      path,
    })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}