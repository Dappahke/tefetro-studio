// src/components/admin/product-form/types.ts

export type ProductFormMode =
  | 'create'
  | 'edit'

export type ProductCategory =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Institutional'

export interface Addon {
  id: string
  name: string
  description?: string | null
  price: number
  type: 'drawing' | 'service'

  badge?: string | null
  featured?: boolean
  sort_order?: number
  icon?: string | null
  active?: boolean
  requires_pdf?: boolean
  short_pitch?: string | null
}

export interface LinkedAddon {
  addon_id: string
  price_override?: number | null
  document_path?: string | null
}

export interface ExistingProduct {
  id: string
  title: string
  slug?: string | null
  description?: string | null
  price: number

  category?: string | null
  subcategory?: string | null

  file_path?: string | null

  bathrooms?: number | null
  bedrooms?: number | null
  floors?: number | null
  plinth_area?: number | null
  length?: number | null
  width?: number | null

  elevation_images?: string[]

  metaTitle?: string | null
  metaDescription?: string | null

  featured?: boolean
}

export interface ProductFormProps {
  mode: ProductFormMode
  product?: ExistingProduct | null
  addons: Addon[]
  linkedAddons?: LinkedAddon[]
}

export interface ProductFormState {
  title: string
  slug: string
  description: string
  price: string

  category: ProductCategory
  subcategory: string

  bedrooms: string
  bathrooms: string
  floors: string
  plinth_area: string
  length: string
  width: string

  metaTitle: string
  metaDescription: string

  featured: boolean
}