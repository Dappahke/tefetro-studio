import { verifyAdmin } from '@/lib/dal'
import { fetchProducts } from '@/lib/dal'
import Link from 'next/link'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { ProductsSearch } from '@/components/admin/ProductsSearch'

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const session = await verifyAdmin()
  const { products, total } = await fetchProducts(searchParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-700">Products</h1>
          <p className="text-sm text-neutral-500">{total} architectural plans</p>
        </div>
        
        <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Search */}
      <ProductsSearch />

      {/* Table */}
      <ProductsTable products={products} />
    </div>
  )
}