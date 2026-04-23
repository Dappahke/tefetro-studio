// src/types/checkout.ts

export type AddonType =
  | 'drawing'
  | 'service'
  | 'digital'

export interface CheckoutAddon {
  id: string
  name: string
  price: number
  type: AddonType
  description: string | null
  badge?: string | null
  featured?: boolean | null
  sort_order?: number | null
  icon?: string | null
  active?: boolean | null
  requires_pdf?: boolean | null
  short_pitch?: string | null
}

export interface CheckoutProduct {
  id: string
  slug?: string | null
  title: string
  description: string | null
  price: number
  category: string | null
  file_path: string | null
  elevation_images?: string[] | null
  bedrooms?: number | null
  bathrooms?: number | null
  floors?: number | null
  plinth_area?: number | null
}