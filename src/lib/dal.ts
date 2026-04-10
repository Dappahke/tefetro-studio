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
// Updated to accept searchParams for filtering
export async function fetchProducts(searchParams?: { [key: string]: string | string[] | undefined }) {
  const supabase = await createClient()
  
  // FIXED: Explicitly select elevation_images and addon_count
  let query = supabase
    .from('products')
    .select('*, elevation_images, product_addons(count)', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply category filter
  if (searchParams?.category) {
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
  if (searchParams?.price) {
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

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  
  // FIXED: Map the count result to addon_count for each product
  const products = (data || []).map((p: any) => ({
    ...p,
    addon_count: p.product_addons?.[0]?.count || 0
  }))

  return {
    products,
    total: count || 0,
    limit,
    offset,
  }
}

export async function fetchProductById(id: string) {
  const supabase = await createClient()
  
  // Fetch product with its linked addons via junction table
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (productError) throw new Error(`Failed to fetch product: ${productError.message}`)
  if (!product) throw new Error('Product not found')

  // Fetch linked addons separately
  const { data: linkedAddons, error: addonError } = await supabase
    .from('product_addons')
    .select('addon:addons(*)')
    .eq('product_id', id)

  if (addonError) throw new Error(`Failed to fetch addons: ${addonError.message}`)

  return {
    ...product,
    addons: linkedAddons?.map((la: any) => la.addon) || [],
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

// Admin data — requires admin role (uses adminClient to bypass RLS for all orders)
export async function fetchAllOrders() {
  await verifyAdmin()
  
  const { data, error } = await adminClient
    .from('orders')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`)
  return data || []
}

// Create order — validates price server-side (never trusts frontend total)
// Uses junction table to verify addons belong to this product
export async function createOrder(input: {
  productId: string
  addons: string[]
  paymentRef: string
}) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  // Fetch product with its linked addons
  const product = await fetchProductById(input.productId)
  if (!product) throw new Error('Product not found')

  // Verify all requested addons are linked to this product
  const linkedAddonIds = product.addons.map((a: any) => a.id)
  const invalidAddons = input.addons.filter(id => !linkedAddonIds.includes(id))
  
  if (invalidAddons.length > 0) {
    throw new Error(`Invalid addons for this product: ${invalidAddons.join(', ')}`)
  }

  // Calculate total server-side
  let total = Number(product.price)
  const addonDetails = []

  for (const addonId of input.addons) {
    const addon = product.addons.find((a: any) => a.id === addonId)
    if (addon) {
      total += Number(addon.price)
      addonDetails.push({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        type: addon.type,
      })
    }
  }

  // Insert order with verified total
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

// Create project request (supervision, contracting, etc.)
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