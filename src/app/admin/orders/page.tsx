// src/app/admin/orders/page.tsx
import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { OrdersFilters } from '@/components/admin/OrdersFilters'
import { ExportButton } from '@/components/admin/ExportButton'
import { RealtimeOrders } from '@/components/admin/RealtimeOrders'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { 
    status?: string
    dateFrom?: string
    dateTo?: string
    minAmount?: string
    maxAmount?: string
    search?: string
    page?: string
  }
}) {
  const session = await verifyAdmin()
  if (!session.user) redirect('/login')

  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const limit = 20
  const offset = (page - 1) * limit

  // Build query with server-side filtering
  // FIXED: Use 'title' instead of 'name' for products table
  let query = adminClient
    .from('orders')
    .select('*, profiles(name, email), products(title)', { count: 'exact' })

  // Apply filters at database level
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }
  
  if (searchParams.dateFrom) {
    query = query.gte('created_at', searchParams.dateFrom)
  }
  
  if (searchParams.dateTo) {
    query = query.lte('created_at', searchParams.dateTo)
  }
  
  if (searchParams.minAmount) {
    query = query.gte('total', parseFloat(searchParams.minAmount))
  }
  
  if (searchParams.maxAmount) {
    query = query.lte('total', parseFloat(searchParams.maxAmount))
  }
  
  if (searchParams.search) {
    query = query.or(`email.ilike.%${searchParams.search}%,payment_ref.ilike.%${searchParams.search}%`)
  }

  // Execute query with pagination
  const { data: orders, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching orders:', error)
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-rose-600 mb-2">Error loading orders</h2>
        <p className="text-mist">{error.message}</p>
      </div>
    )
  }

  const totalOrders = count || 0
  const totalPages = Math.ceil(totalOrders / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-700">Orders Management</h1>
          <p className="text-neutral-500 mt-1">
            {totalOrders} total orders
          </p>
        </div>
        <ExportButton orders={orders || []} />
      </div>

      {/* Filters */}
      <OrdersFilters 
        currentFilters={searchParams}
        totalOrders={totalOrders}
      />

      {/* Real-time wrapper */}
      <RealtimeOrders 
        initialOrders={orders || []}
        currentPage={page}
        totalPages={totalPages}
        totalOrders={totalOrders}
        filters={searchParams}
      />
    </div>
  )
}