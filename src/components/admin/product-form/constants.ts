// src/components/admin/product-form/constants.ts

import { ProductCategory } from './types'

export const CATEGORY_MAP: Record<ProductCategory, string[]> = {
  Residential: [
    'Bungalow',
    'Maisonette',
    'Apartment Block',
    'Duplex',
    'Villa',
    'Townhouse',
    'Bedsitter Block',
    'Tiny Home',
  ],

  Commercial: [
    'Office Block',
    'Retail Shop',
    'Restaurant',
    'Hotel',
    'Salon',
    'Mixed Use Plaza',
    'Showroom',
    'Mall Unit',
  ],

  Industrial: [
    'Warehouse',
    'Workshop',
    'Factory',
    'Cold Room',
    'Processing Plant',
    'Garage',
    'Distribution Hub',
  ],

  Institutional: [
    'School',
    'Church',
    'Mosque',
    'Hospital',
    'Clinic',
    'Community Hall',
    'NGO Office',
    'Government Office',
  ],
}

export const BRAND_COLORS = {
  teal: '#0F4C5C',
  blueprint: '#1E3A5F',
  slate: '#64748B',
  ivory: '#F8F7F3',
  graphite: '#1E1E1E',
  gold: '#C8942C',
  red: '#C73B32',
}

export const MAX_ELEVATION_IMAGES = 5

export const ACCEPTED_DRAWING_TYPES = {
  'application/pdf': ['.pdf'],
}

export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
}

export const PRICE_PRESETS = [
  15000,
  25000,
  50000,
  75000,
  100000,
  150000,
]