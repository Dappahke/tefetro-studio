import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { ActivityTable } from '@/components/admin/ActivityTable'
import { ActivityFilters } from '@/components/admin/ActivityFilters'

interface ActivityPageProps {
  searchParams: { 
    event?: string
    userId?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }
}

export default async function ActivityLogPage({ searchParams }: ActivityPageProps) {
  const session = await verifyAdmin()

  // Only admin can access activity log
  if (session.role !== 'admin') {
    notFound()
  }

  const page = parseInt(searchParams.page || '1')
  const limit = 50
  const offset = (page - 1) * limit

  // Build query
  let query = adminClient
    .from('audit_logs')
    .select(`
      *,
      admin:profiles(id, email, role)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Apply filters
  if (searchParams.event) {
    query = query.eq('event', searchParams.event)
  }

  if (searchParams.userId) {
    query = query.eq('user_id', searchParams.userId)
  }

  if (searchParams.dateFrom && searchParams.dateTo) {
    query = query
      .gte('created_at', searchParams.dateFrom)
      .lte('created_at', searchParams.dateTo)
  }

  const { data: logs, error, count } = await query

  if (error) throw new Error(`Failed to fetch activity logs: ${error.message}`)

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-deep-700">Activity Log</h1>
        <p className="text-sm text-neutral-500">
          {count} recorded events • System audit trail
        </p>
      </div>

      {/* Filters */}
      <ActivityFilters />

      {/* Activity Table */}
      <ActivityTable 
        logs={logs || []} 
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}