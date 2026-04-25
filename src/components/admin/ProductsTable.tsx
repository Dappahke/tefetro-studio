// src/components/admin/ProductsTable.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PriceDisplayCompact } from '../checkout/PriceDisplayCompact'
import { Edit, Package, Image as ImageIcon, MoreVertical, Eye, Copy, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Product {
  slug: string
  id: string
  title: string
  description: string | null
  price: number
  category: string | null
  file_path: string | null
  elevation_images?: string[] | null
  created_at: string
  addon_count?: number
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900">No products found</h3>
        <p className="text-neutral-500 mt-1">Add your first architectural plan to get started</p>
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blueprint-600 text-white rounded-xl font-semibold hover:bg-blueprint-700 transition-all"
        >
          Add Product
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">Product</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">Category</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">Price</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">Add-ons</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">Status</th>
            <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-neutral-50 transition-colors group">
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.elevation_images?.[0] ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/drawings${product.elevation_images[0].startsWith('/') ? '' : '/'}${product.elevation_images[0]}`}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div>
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="font-semibold text-neutral-900 hover:text-blueprint-600 transition-colors"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-xs text-neutral-400 font-mono">
                        ID: {product.id.slice(-8)}
                      </code>
                      {product.addon_count && product.addon_count > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          +{product.addon_count} add-ons
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blueprint-50 text-blueprint-700 capitalize">
                  {product.category || 'Uncategorized'}
                </span>
              </td>
              
              <td className="py-4 px-6">
                <PriceDisplayCompact amountKES={product.price} className="font-semibold text-neutral-900" />
              </td>
              
              <td className="py-4 px-6">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-neutral-600">
                    {product.addon_count || 0} linked
                  </span>
                  {product.addon_count && product.addon_count > 0 && (
                    <div className="flex -space-x-1">
                      {[...Array(Math.min(product.addon_count, 3))].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-blueprint-100 border-2 border-white flex items-center justify-center">
                          <span className="text-[10px] text-blueprint-700">📄</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              
              <td className="py-4 px-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </td>
              
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link 
                    href={`/admin/products/${product.id}`}
                    className="p-2 text-neutral-500 hover:text-blueprint-600 hover:bg-blueprint-50 rounded-lg transition-colors"
                    title="Edit product"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/products/${product.slug || product.id}`}
                    target="_blank"
                    className="p-2 text-neutral-500 hover:text-blueprint-600 hover:bg-blueprint-50 rounded-lg transition-colors"
                    title="View on site"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}