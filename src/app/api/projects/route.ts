// src/app/api/projects/route.ts
import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await adminClient
      .from('projects')
      .insert({
        order_id: body.order_id,
        user_id: body.user_id,
        service_type: body.service_type,
        status: body.status || 'pending',
        location: body.location || null,
        notes: body.notes || null,
        start_date: body.start_date || null,
        due_date: body.due_date || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}