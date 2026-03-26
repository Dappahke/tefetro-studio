import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { UsersTable } from '@/components/admin/UsersTable'
import { UsersSearch } from '@/components/admin/UsersSearch'

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const session = await verifyAdmin()

  // Only admin can access user management
  if (session.role !== 'admin') {
    notFound()
  }

  // Fetch users with order counts
  const { data: users, error, count } = await adminClient
    .from('profiles')
    .select(`
      *,
      order_count:orders(count)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch users: ${error.message}`)

  // Server-side filtering
  let filteredUsers = users || []
  
  if (searchParams.q) {
    const query = String(searchParams.q).toLowerCase()
    filteredUsers = filteredUsers.filter((u: any) => 
      u.email?.toLowerCase().includes(query)
    )
  }

  if (searchParams.role) {
    filteredUsers = filteredUsers.filter((u: any) => u.role === searchParams.role)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-700">User Management</h1>
          <p className="text-sm text-neutral-500">{count} registered users</p>
        </div>
      </div>

      {/* Search & Filters */}
      <UsersSearch />

      {/* Users Table */}
      <UsersTable 
        users={filteredUsers.map((u: any) => ({
          ...u,
          order_count: u.order_count?.[0]?.count || 0
        }))} 
      />
    </div>
  )
}