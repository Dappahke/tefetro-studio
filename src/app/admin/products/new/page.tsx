import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { ProductForm } from '@/components/admin/product-form/ProductForm'

export default async function NewProductPage() {
  await verifyAdmin()

  // Fetch addons for linking
  const { data: addons } = await adminClient
    .from('addons')
    .select('*')
    .order('type', { ascending: false })
    .order('name')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-2 text-neutral-600 hover:text-deep-700 hover:bg-canvas rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-deep-700">Add New Product</h1>
          <p className="text-sm text-neutral-500">Create a new architectural plan</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm 
        mode="create" 
        addons={addons || []}
        linkedAddons={[]}
      />
    </div>
  )
}