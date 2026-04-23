import Link from 'next/link'
import Image from 'next/image'
import { PriceDisplayCompact } from '@/components/checkout/PriceDisplayCompact'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  category: string | null
  file_path: string | null
  created_at: string
  addon_count?: number
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-mist/30">
        <div className="w-16 h-16 bg-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-deep-700">No products found</h3>
        <p className="text-neutral-600 mt-2">Add your first architectural plan to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-mist/30 overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-canvas border-b border-mist/30">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Product</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Category</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Price</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Addons</th>
              <th className="text-left py-4 px-6 font-semibold text-deep-700">Status</th>
              <th className="text-right py-4 px-6 font-semibold text-deep-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/30">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-canvas/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.file_path ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings/${product.file_path}`}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-deep-700">{product.title}</h4>
                      <code className="text-xs text-sage font-mono">
                        TSB{product.category?.[0]?.toUpperCase() || 'X'}{product.id.slice(-4)}
                      </code>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sage/10 text-sage capitalize">
                    {product.category || 'Uncategorized'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <PriceDisplayCompact amountKES={product.price} />
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-neutral-600">
                    {product.addon_count || 0} linked
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sage/10 text-sage">
                    Active
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="p-2 text-neutral-400 hover:text-deep-700 hover:bg-canvas rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <Link 
                      href={`/admin/products/${product.id}/addons`}
                      className="p-2 text-neutral-400 hover:text-tefetro hover:bg-canvas rounded-lg transition-colors"
                      title="Manage Addons"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}