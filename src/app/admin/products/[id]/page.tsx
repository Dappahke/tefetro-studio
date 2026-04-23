import { verifyAdmin } from '@/lib/dal'
import { adminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form/ProductForm'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await verifyAdmin()
  const { id } = params

  // Fetch product
  const { data: product } = await adminClient
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch linked addons with price overrides and documents
  const { data: linkedAddons } = await adminClient
    .from('product_addons')
    .select('addon_id, price_override, document_path')
    .eq('product_id', id)

  // Fetch all addons
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
          <h1 className="text-2xl font-bold text-deep-700">Edit Product</h1>
          <p className="text-sm text-neutral-500">Update architectural plan details</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm 
        mode="edit" 
        product={product}
        addons={addons || []}
        linkedAddons={linkedAddons || []}
      />
    </div>
  )
}