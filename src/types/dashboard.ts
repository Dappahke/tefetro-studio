// src/types/dashboard.ts

export interface Order {
  id: string;
  productName: string;
  category: string;
  price: number;
  purchaseDate: string;
  status: 'completed' | 'pending' | 'failed';
  expiresAt: string | null;
  downloadUrl?: string;
  addons?: any[];
  hasBOQ: boolean;
  hasInteriors: boolean;
  hasLandscape: boolean;
}

export interface FileItem {
  name: string;
  type: 'pdf' | 'dwg' | 'image';
  size: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  startDate: string;
  expectedHandover: string;
  currentPhase: string;
  progress: number;
  lastUpdate: string;
}