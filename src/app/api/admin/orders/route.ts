// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdmin()
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = 20
    const offset = (page - 1) * limit

    // Fixed: Use 'title' instead of 'name' for products
    let query = adminClient
      .from('orders')
      .select('*, profiles(name, email), products(title)', { count: 'exact' })

    // Apply filters
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status'))
    }
    if (searchParams.get('dateFrom')) {
      query = query.gte('created_at', searchParams.get('dateFrom'))
    }
    if (searchParams.get('dateTo')) {
      query = query.lte('created_at', searchParams.get('dateTo'))
    }
    if (searchParams.get('minAmount')) {
      query = query.gte('total', parseFloat(searchParams.get('minAmount')!))
    }
    if (searchParams.get('maxAmount')) {
      query = query.lte('total', parseFloat(searchParams.get('maxAmount')!))
    }
    if (searchParams.get('search')) {
      const search = `%${searchParams.get('search')}%`
      query = query.or(`email.ilike.${search},payment_ref.ilike.${search}`)
    }

    const { data: orders, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({ 
      orders: orders || [], 
      total: count || 0 
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' }, 
      { status: 500 }
    )
  }
}