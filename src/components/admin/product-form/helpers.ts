// src/components/admin/product-form/helpers.ts

import { ProductFormState } from './types'

export function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatCurrency(value: number | string): string {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function toNumber(value: string): number | null {
  if (!value || value.trim() === '') return null

  const parsed = Number(value)

  return Number.isNaN(parsed) ? null : parsed
}

export function validateProductForm(form: ProductFormState) {
  const errors: Record<string, string> = {}

  if (!form.title.trim()) errors.title = 'Product title is required'
  if (!form.slug.trim()) errors.slug = 'Slug is required'
  if (!form.price.trim()) errors.price = 'Price is required'
  if (!form.description.trim()) {
    errors.description = 'Description is required'
  }

  if (form.metaTitle.length > 70) {
    errors.metaTitle = 'Meta title should be under 70 characters'
  }

  if (form.metaDescription.length > 160) {
    errors.metaDescription =
      'Meta description should be under 160 characters'
  }

  return errors
}

export function buildInitialState(product?: any): ProductFormState {
  return {
    title: product?.title || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price ? String(product.price) : '',

    category: product?.category || 'Residential',
    subcategory: product?.subcategory || 'Bungalow',

    bedrooms: product?.bedrooms ? String(product.bedrooms) : '',
    bathrooms: product?.bathrooms ? String(product.bathrooms) : '',
    floors: product?.floors ? String(product.floors) : '1',
    plinth_area: product?.plinth_area
      ? String(product.plinth_area)
      : '',
    length: product?.length ? String(product.length) : '',
    width: product?.width ? String(product.width) : '',

    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',

    featured: product?.featured || false,
  }
}

export function buildPayload(form: ProductFormState) {
  return {
    title: form.title,
    slug: form.slug,
    description: form.description,
    price: Number(form.price),

    category: form.category,
    subcategory: form.subcategory,

    bedrooms: toNumber(form.bedrooms),
    bathrooms: toNumber(form.bathrooms),
    floors: toNumber(form.floors),
    plinth_area: toNumber(form.plinth_area),
    length: toNumber(form.length),
    width: toNumber(form.width),

    meta_title: form.metaTitle,
    meta_description: form.metaDescription,

    featured: form.featured,
  }
}