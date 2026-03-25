import { verifyAdmin } from '@/lib/dal'
import { fetchAllOrders } from '@/lib/dal'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { OrdersFilters } from '@/components/admin/OrdersFilters'
import { ExportButton } from '@/components/admin/ExportButton'

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
  await verifyAdmin()
  
  const orders = await fetchAllOrders()
  
  // Apply filters from searchParams
  let filteredOrders = orders
  
  if (searchParams.status) {
    filteredOrders = filteredOrders.filter((o: any) => o.status === searchParams.status)
  }
  
  if (searchParams.dateFrom) {
    filteredOrders = filteredOrders.filter((o: any) => 
      new Date(o.created_at!) >= new Date(searchParams.dateFrom as string)
    )
  }
  
  if (searchParams.dateTo) {
    filteredOrders = filteredOrders.filter((o: any) => 
      new Date(o.created_at!) <= new Date(searchParams.dateTo as string)
    )
  }
  
  if (searchParams.minAmount) {
    filteredOrders = filteredOrders.filter((o: any) => 
      o.total >= parseInt(searchParams.minAmount as string)
    )
  }
  
  if (searchParams.maxAmount) {
    filteredOrders = filteredOrders.filter((o: any) => 
      o.total <= parseInt(searchParams.maxAmount as string)
    )
  }
  
  if (searchParams.search) {
    const searchLower = searchParams.search.toLowerCase()
    filteredOrders = filteredOrders.filter((o: any) => 
      o.email?.toLowerCase().includes(searchLower) ||
      o.id.toLowerCase().includes(searchLower) ||
      o.payment_ref?.toLowerCase().includes(searchLower)
    )
  }

  // Pagination
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const totalPages = Math.ceil(filteredOrders.length / limit)
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-700">Orders Management</h1>
          <p className="text-neutral-500 mt-1">
            {filteredOrders.length} total orders
          </p>
        </div>
        <ExportButton orders={filteredOrders} />
      </div>

      {/* Filters */}
      <OrdersFilters 
        currentFilters={searchParams}
        totalOrders={filteredOrders.length}
      />

      {/* Table */}
      <OrdersTable 
        orders={paginatedOrders}
        currentPage={page}
        totalPages={totalPages}
        totalOrders={filteredOrders.length}
      />
    </div>
  )
}