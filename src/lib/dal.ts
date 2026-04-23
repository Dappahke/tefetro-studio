// src/lib/dal.ts
import 'server-only'
import { cache } from 'react'
import { createClient } from './supabase/server'
import { adminClient } from './supabase/admin'
import type { User } from '@supabase/supabase-js'

type Role = 'user' | 'admin'

type SearchParams = {
  [key: string]: string | string[] | undefined
}

/* =========================================================
   HELPERS
========================================================= */

function asString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

function asNumber(value: string | string[] | undefined, fallback: number) {
  const parsed = parseInt(asString(value) || '', 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

function sanitizeSearchTerm(value: string) {
  return value
    .trim()
    .replace(/[,%]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 60)
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function buildStorageUrl(path: string | null | undefined) {
  if (!path) return ''

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const clean = path.startsWith('/') ? path.slice(1) : path

  return `${base}/storage/v1/object/public/drawings/${clean}`
}

/* =========================================================
   AUTH
========================================================= */

// Cached auth check — avoids repeated auth calls per request
export const verifySession = cache(
  async (): Promise<{ user: User; role: Role; email: string } | null> => {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user || !user.email) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return {
      user,
      role: (profile?.role as Role) || 'user',
      email: user.email,
    }
  }
)

export const verifyAdmin = cache(async () => {
  const session = await verifySession()

  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return session
})

/* =========================================================
   PUBLIC PRODUCTS
========================================================= */

export async function fetchProducts(searchParams?: SearchParams) {
  try {
    const supabase = await createClient()
    const limit = Math.min(asNumber(searchParams?.limit, 20), 50)
    const offset = Math.max(asNumber(searchParams?.offset, 0), 0)

    let query = supabase
      .from('products')
      .select(
        `
        id,
        slug,
        title,
        description,
        price,
        category,
        bedrooms,
        bathrooms,
        floors,
        plinth_area,
        length,
        width,
        elevation_images,
        created_at,
        updated_at
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })

    // Category
    const category = asString(searchParams?.category)
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Search
    const rawQuery = asString(searchParams?.q)
    if (rawQuery) {
      const safeQuery = sanitizeSearchTerm(rawQuery)

      if (safeQuery.length > 0) {
        query = query.or(
          `title.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`
        )
      }
    }

    // Bedrooms
    const bedrooms = asString(searchParams?.bedrooms)
    if (bedrooms) {
      query = query.eq('bedrooms', parseInt(bedrooms, 10))
    }

    // Floors
    const floors = asString(searchParams?.floors)
    if (floors) {
      query = query.eq('floors', parseInt(floors, 10))
    }

    // Price
    const price = asString(searchParams?.price)
    if (price && price !== 'all') {
      if (price === '0-50000') {
        query = query.gte('price', 0).lte('price', 50000)
      } else if (price === '50000-100000') {
        query = query.gte('price', 50000).lte('price', 100000)
      } else if (price === '100000-250000') {
        query = query.gte('price', 100000).lte('price', 250000)
      } else if (price === '250000+') {
        query = query.gte('price', 250000)
      }
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(error.message)
    }

    const products =
      data?.map((p: any) => ({
        ...p,
        slug: p.slug || normalizeSlug(p.title || p.id),
        addon_count: 0,
      })) || []

    return {
      products,
      total: count || 0,
      limit,
      offset,
    }
  } catch (error) {
    console.error('fetchProducts error:', error)

    return {
      products: [],
      total: 0,
      limit: 20,
      offset: 0,
      error:
        error instanceof Error ? error.message : 'Failed to fetch products',
    }
  }
}

/* =========================================================
   SINGLE PRODUCT
========================================================= */

export async function fetchProductById(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw new Error('Product not found')
    }

    return {
      ...data,
      slug: data.slug || normalizeSlug(data.title || data.id),
      addons: [],
    }
  } catch (error) {
    console.error('fetchProductById error:', error)
    throw error
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      throw new Error('Product not found')
    }

    return {
      ...data,
      addons: [],
    }
  } catch (error) {
    console.error('fetchProductBySlug error:', error)
    throw error
  }
}

/* =========================================================
   ORDERS
========================================================= */

export async function fetchUserOrders() {
  const session = await verifySession()

  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`)

  return data || []
}

export async function fetchAllOrders() {
  await verifyAdmin()

  const { data, error } = await adminClient
    .from('orders')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`)

  return data || []
}

export async function createOrder(input: {
  productId: string
  addons: string[]
  paymentRef: string
}) {
  const session = await verifySession()

  if (!session) throw new Error('Unauthorized')

  const product = await fetchProductById(input.productId)

  if (!product) throw new Error('Product not found')

  let total = Number(product.price || 0)

  const addonDetails: any[] = []

  const { data, error } = await adminClient
    .from('orders')
    .insert({
      user_id: session.user.id,
      email: session.email,
      product_id: input.productId,
      addons: addonDetails,
      total,
      payment_ref: input.paymentRef,
      status: 'pending', // safer than completed
      expires_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`)
  }

  return data
}

/* =========================================================
   PROJECT REQUESTS
========================================================= */

export async function createProjectRequest(input: {
  serviceType: 'supervision' | 'contracting' | 'interior' | 'landscape'
  description?: string
}) {
  const session = await verifySession()

  if (!session) throw new Error('Unauthorized')

  const validServices = [
    'supervision',
    'contracting',
    'interior',
    'landscape',
  ]

  if (!validServices.includes(input.serviceType)) {
    throw new Error('Invalid service type')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: session.user.id,
      email: session.email,
      service_type: input.serviceType,
      status: 'pending',
      description: input.description || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`)
  }

  return data
}

/* =========================================================
   HERO IMAGES
========================================================= */

export async function fetchRandomElevationImages(
  limit: number = 6
): Promise<string[]> {
  const supabase = await createClient()

  try {
    // Preferred RPC function
    const { data, error } = await supabase.rpc(
      'get_random_elevation_images',
      {
        image_limit: limit,
      }
    )

    if (!error && data && data.length > 0) {
      return data
        .map((row: { image_url: string }) =>
          buildStorageUrl(row.image_url)
        )
        .filter(Boolean)
    }

    // fallback query
    const { data: rows, error: fallbackError } = await supabase
      .from('products')
      .select('elevation_images')
      .not('elevation_images', 'is', null)
      .limit(30)

    if (fallbackError || !rows) return []

    const images = rows
      .flatMap((row: any) => row.elevation_images || [])
      .filter(
        (img: string, i: number, arr: string[]) =>
          img &&
          img.trim() !== '' &&
          arr.indexOf(img) === i
      )
      .map(buildStorageUrl)

    return images.sort(() => Math.random() - 0.5).slice(0, limit)
  } catch (error) {
    console.error('fetchRandomElevationImages error:', error)
    return []
  }
}