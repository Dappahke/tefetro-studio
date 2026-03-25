import { verifyAdmin } from '@/lib/dal'
import { fetchAllOrders } from '@/lib/dal'
import Link from 'next/link'
import { StatsCard } from '@/components/admin/StatsCard'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { RevenueChart } from '@/components/admin/RevenueChart'

export default async function AdminDashboardPage() {
  const session = await verifyAdmin()
  const orders = await fetchAllOrders()

  // Calculate stats
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0)
  const todayOrders = orders.filter((o: any) => {
    const orderDate = new Date(o.created_at)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })
  const pendingProjects = orders.filter((o: any) => 
    o.addons?.some((a: any) => a.type === 'service' && o.project_status === 'pending')
  ).length

  // Get low stock (if you track downloads)
  const expiringSoon = orders.filter((o: any) => {
    if (!o.expires_at) return false
    const hoursLeft = (new Date(o.expires_at).getTime() - Date.now()) / (1000 * 60 * 60)
    return hoursLeft > 0 && hoursLeft < 24
  }).length

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={`KES ${(totalRevenue / 1000).toFixed(1)}K`}
          trend="+12%"
          trendUp={true}
          icon="💰"
        />
        <StatsCard
          title="Today's Orders"
          value={todayOrders.length.toString()}
          trend="+3"
          trendUp={true}
          icon="📦"
        />
        <StatsCard
          title="Pending Projects"
          value={pendingProjects.toString()}
          trend="Action needed"
          trendUp={false}
          alert={pendingProjects > 0}
          icon="🏗️"
        />
        <StatsCard
          title="Expiring Links"
          value={expiringSoon.toString()}
          trend="24h"
          trendUp={false}
          alert={expiringSoon > 5}
          icon="⏰"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-deep-700">Revenue Overview</h2>
            <select className="text-sm border border-mist rounded-lg px-3 py-1.5 bg-canvas">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This year</option>
            </select>
          </div>
          <RevenueChart orders={orders} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
            <h3 className="font-semibold text-deep-700 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/products/new" className="btn-primary w-full justify-center">
                + Add Product
              </Link>
              <Link href="/admin/orders?status=pending" className="btn-ghost w-full justify-center">
                View Pending Orders
              </Link>
              <Link href="/admin/projects" className="btn-ghost w-full justify-center">
                Manage Projects
              </Link>
            </div>
          </div>

          <div className="bg-tefetra/10 rounded-2xl p-6 border border-tefetra/20">
            <h3 className="font-semibold text-tefetra-700 mb-2">Admin Access</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Full system access enabled
            </p>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-white rounded text-deep-700">Orders: {orders.length}</span>
              <span className="px-2 py-1 bg-white rounded text-deep-700">Users: --</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-soft border border-mist/30 overflow-hidden">
        <div className="p-6 border-b border-mist/30 flex items-center justify-between">
          <h2 className="text-lg font-bold text-deep-700">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-tefetra hover:underline">
            View All
          </Link>
        </div>
        <RecentOrders orders={orders.slice(0, 5)} />
      </div>
    </div>
  )
}