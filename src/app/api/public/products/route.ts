import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Query parameter validation
const QuerySchema = z.object({
  id: z.string().optional(), // Single product ID
  category: z.string().optional(), // Filter by category
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const queryResult = QuerySchema.safeParse({
      id: searchParams.get('id'),
      category: searchParams.get('category'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const { id, category, limit, offset } = queryResult.data
    const supabase = await createClient()

    // Single product fetch (with addons)
    if (id) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          addons:product_addons(
            addon:addons(*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }
        throw error
      }

      // Flatten addon structure
      const flattened = {
        ...product,
        addons: product.addons?.map((pa: any) => pa.addon) || []
      }

      return NextResponse.json({ data: flattened })
    }

    // List products
    let dbQuery = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    const { data: products, error, count } = await dbQuery

    if (error) throw error

    return NextResponse.json({
      data: products,
      meta: {
        total: count || 0,
        limit,
        offset,
      }
    })

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}