// src/lib/dal.ts
import 'server-only'
import { cache } from 'react'
import { createClient } from './supabase/server'
import { adminClient } from './supabase/admin'
import type { User } from '@supabase/supabase-js'

// Cached auth check — prevents multiple DB calls in same request
export const verifySession = cache(async (): Promise<{ user: User; role: 'user' | 'admin'; email: string } | null> => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user || !user.email) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    user,
    role: profile?.role || 'user',
    email: user.email,
  }
})

// Verify admin specifically
export const verifyAdmin = cache(async () => {
  const session = await verifySession()
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }
  return session
})

// Public data — no auth required
export async function fetchProducts(searchParams?: { [key: string]: string | string[] | undefined }) {
  try {
    const supabase = await createClient()
    
    // Build query - removed the product_addons join that's causing issues
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply category filter
    if (searchParams?.category && searchParams.category !== 'all') {
      query = query.eq('category', searchParams.category)
    }

    // Apply search query (title or description)
    if (searchParams?.q) {
      const searchTerm = String(searchParams.q).trim()
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    // Apply bedroom filter
    if (searchParams?.bedrooms) {
      query = query.eq('bedrooms', parseInt(String(searchParams.bedrooms)))
    }

    // Apply floors filter
    if (searchParams?.floors) {
      query = query.eq('floors', parseInt(String(searchParams.floors)))
    }

    // Apply price range filter
    if (searchParams?.price && searchParams.price !== 'all') {
      const priceRange = String(searchParams.price)
      if (priceRange === '0-50000') {
        query = query.gte('price', 0).lte('price', 50000)
      } else if (priceRange === '50000-100000') {
        query = query.gte('price', 50000).lte('price', 100000)
      } else if (priceRange === '100000-250000') {
        query = query.gte('price', 100000).lte('price', 250000)
      } else if (priceRange === '250000+') {
        query = query.gte('price', 250000)
      }
    }

    // Pagination
    const limit = parseInt(String(searchParams?.limit)) || 20
    const offset = parseInt(String(searchParams?.offset)) || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    // Map products with safe defaults
    const products = (data || []).map((p: any) => ({
      ...p,
      addon_count: 0 // Simplified - remove the product_addons join for now
    }))

    return {
      products,
      total: count || 0,
      limit,
      offset,
    }
  } catch (err) {
    console.error('fetchProducts error:', err)
    
    // Return empty data instead of crashing
    return {
      products: [],
      total: 0,
      limit: 20,
      offset: 0,
      error: err instanceof Error ? err.message : 'Failed to fetch products'
    }
  }
}

export async function fetchProductById(id: string) {
  try {
    const supabase = await createClient()
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (productError) {
      console.error('fetchProductById error:', productError)
      throw new Error(`Failed to fetch product: ${productError.message}`)
    }
    
    if (!product) {
      throw new Error('Product not found')
    }

    return {
      ...product,
      addons: [],
    }
  } catch (err) {
    console.error('fetchProductById error:', err)
    throw err
  }
}

// Protected data — requires authentication
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

// Admin data — requires admin role
export async function fetchAllOrders() {
  await verifyAdmin()
  
  const { data, error } = await adminClient
    .from('orders')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`)
  return data || []
}

// Create order — validates price server-side
export async function createOrder(input: {
  productId: string
  addons: string[]
  paymentRef: string
}) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const product = await fetchProductById(input.productId)
  if (!product) throw new Error('Product not found')

  let total = Number(product.price)
  const addonDetails: any[] = []

  const { data, error } = await adminClient
    .from('orders')
    .insert({
      user_id: session.user.id,
      email: session.email,
      product_id: input.productId,
      addons: addonDetails,
      total: total,
      payment_ref: input.paymentRef,
      status: 'completed',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create order: ${error.message}`)
  return data
}

// Create project request
export async function createProjectRequest(input: {
  serviceType: 'supervision' | 'contracting' | 'interior' | 'landscape'
  description?: string
}) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const validServices = ['supervision', 'contracting', 'interior', 'landscape']
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

  if (error) throw new Error(`Failed to create project: ${error.message}`)
  return data
}

/**
 * Fetch random elevation images from products for hero slideshow
 * Uses PostgreSQL unnest to flatten elevation_images arrays and select random unique images
 */
export async function fetchRandomElevationImages(limit: number = 6): Promise<string[]> {
  const supabase = await createClient()
  
  // Supabase storage URL
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // Helper to construct proper storage URL for drawings bucket
  const constructStorageUrl = (path: string): string => {
    if (!path) return ''
    // If already absolute URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    
    // Clean the path - remove any leading slashes
    let cleanPath = path.startsWith('/') ? path.slice(1) : path
    
    // Images are stored in 'drawings' bucket with paths like 'elevations/filename.jpg'
    return `${SUPABASE_URL}/storage/v1/object/public/drawings/${cleanPath}`
  }
  
  try {
    // Try RPC first
    const { data, error } = await supabase
      .rpc('get_random_elevation_images', { image_limit: limit })
    
    if (!error && data && data.length > 0) {
      console.log('RPC success, images:', data.length)
      return data
        .map((row: { image_url: string }) => constructStorageUrl(row.image_url))
        .filter(Boolean)
    }
    
    // Log RPC error for debugging
    if (error) {
      console.warn('RPC failed, using fallback:', error.message)
    }
    
    // Fallback: query manually
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('products')
      .select('elevation_images')
      .not('elevation_images', 'is', null)
      .limit(30)
    
    if (fallbackError || !fallbackData) {
      console.error('Fallback query failed:', fallbackError)
      return []
    }
    
    // Flatten, deduplicate, and construct URLs
    const allImages = fallbackData
      .flatMap((p: any) => p.elevation_images || [])
      .filter((img: string, idx: number, arr: string[]) => 
        arr.indexOf(img) === idx && img && img.trim() !== ''
      )
      .map(constructStorageUrl)
      .filter(Boolean)
    
    console.log('Fallback found images:', allImages.length)
    
    // Shuffle and limit
    return allImages
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      
  } catch (err) {
    console.error('Exception fetching elevation images:', err)
    return []
  }
}