// src/app/admin/projects/new/page.tsx
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { NewProjectForm } from '@/components/admin/NewProjectForm'
import { Suspense } from 'react'

export const metadata = {
  title: 'New Project | Tefetro Admin',
  description: 'Create a new architectural supervision or contracting project',
}

export const dynamic = 'force-dynamic'

// Fetch eligible orders (completed with service addons)
async function fetchEligibleOrders() {
  const { data: orders, error } = await adminClient
    .from('orders')
    .select(`
      id,
      email,
      total,
      created_at,
      addons,
      product_id,
      products!orders_product_id_fkey(id, title),
      user_id
    `)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  // Filter orders with service addons
  return (
    orders?.filter(order =>
        order.addons?.some((addon: any) => addon.type === 'service')
    ).map(order => {
        const { products, ...rest } = order;

        return {
        ...rest,
        product: products?.[0] || null,
        };
    }) || []
    )
}

// Loading skeleton
function NewProjectSkeleton() {
  return (
    <div className="min-h-screen bg-canvas pb-20 animate-pulse">
      <div className="bg-white border-b border-mist/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-200" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-stone-200 rounded" />
              <div className="h-4 w-48 bg-stone-100 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-mist/30 h-64" />
        <div className="bg-white rounded-2xl border border-mist/30 h-96" />
      </div>
    </div>
  )
}

export default async function NewProjectPage() {
  await verifyAdmin()
  const eligibleOrders = await fetchEligibleOrders()

  return (
    <Suspense fallback={<NewProjectSkeleton />}>
      <NewProjectForm eligibleOrders={eligibleOrders} />
    </Suspense>
  )
}