// app/admin/products/page.tsx
import { verifyAdmin } from '@/lib/dal'
import { fetchProducts } from '@/lib/dal'
import Link from 'next/link'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { ProductsSearch } from '@/components/admin/ProductsSearch'
import { Plus, Package, TrendingUp, DollarSign, Grid3x3 } from 'lucide-react'

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const session = await verifyAdmin()
  const { products, total } = await fetchProducts(searchParams)

  // Calculate stats
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0)
  const categories = new Set(products.map(p => p.category).filter(Boolean))
  const activeProducts = products.length

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-blueprint-900">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your architectural plans and designs</p>
        </div>
        
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blueprint-600 text-white rounded-xl font-semibold hover:bg-blueprint-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Package}
          label="Total Products"
          value={activeProducts}
          trend={`${categories.size} categories`}
          color="blue"
        />
        <StatCard 
          icon={DollarSign}
          label="Portfolio Value"
          value={`KES ${totalValue.toLocaleString()}`}
          trend="Total catalog value"
          color="green"
        />
        <StatCard 
          icon={TrendingUp}
          label="Avg. Price"
          value={`KES ${Math.round(totalValue / (activeProducts || 1)).toLocaleString()}`}
          trend="Per product"
          color="purple"
        />
        <StatCard 
          icon={Grid3x3}
          label="Active Listings"
          value={activeProducts}
          trend={`${categories.size} unique categories`}
          color="orange"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
        <ProductsSearch />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <ProductsTable products={products} />
      </div>
    </div>
  )
}

type StatCardColor = 'blue' | 'green' | 'purple' | 'orange'

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  trend: string
  color: StatCardColor
}

function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  const colorClasses: Record<StatCardColor, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          <p className="text-xs text-neutral-400 mt-1">{trend}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-10`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}