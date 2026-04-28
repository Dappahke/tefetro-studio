// src/types/dashboard.ts
export interface Order {
  id: string;
  productName: string;
  category: string;
  price: number;
  purchaseDate: string;
  status: 'pending' | 'completed' | 'paid' | 'cancelled' | 'expired';
  expiresAt: string | null;
  downloadUrl: string | null;
  addons: Addon[];
  hasBOQ: boolean;
  hasInteriors: boolean;
  hasLandscape: boolean;
}

export interface Addon {
  id?: string;
  name: string;
  price: number;
  description?: string;
  downloadUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}