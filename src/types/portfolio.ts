// ============================================================
// TEFETRO STUDIOS - PORTFOLIO TYPES
// TypeScript interfaces for portfolio data
// ============================================================

export type PortfolioCategory = 
  | 'residential' 
  | 'rental_units' 
  | 'apartments' 
  | 'interiors' 
  | 'landscaping' 
  | 'technical_planning';

export type ProjectStatus = 
  | 'concept' 
  | 'design' 
  | 'proposal' 
  | 'plan' 
  | 'visualization' 
  | 'completed';

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: PortfolioCategory;

  // Media
  image: string;
  images: string[];
  floor_plan_image?: string;
  elevation_image?: string;

  // Descriptions
  description: string;
  short_description?: string;

  // Technical Specs
  size?: string;
  plot_fit?: string;
  plot_fit_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  parking_spaces?: number;

  // Kenyan Market Metadata
  location_context?: string;
  investor_friendly: boolean;
  ready_to_build: boolean;
  estimated_cost_range?: string;

  // Product Integration (COMPATIBLE WITH TEXT ID)
  is_for_sale: boolean;
  product_id?: string;        // TEXT type to match your products table
  product_slug?: string;      // Direct link: /products/[product_slug]

  // Status & Labels
  status: ProjectStatus;
  featured: boolean;
  featured_order: number;

  // SEO
  meta_title?: string;
  meta_description?: string;

  // Content Flags
  never_imply_built: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;

  // Display
  display_order: number;
}

export interface PortfolioFilters {
  category: PortfolioCategory | 'all';
  plotSize?: string;
  bedrooms?: number;
  investorFriendly?: boolean;
  readyToBuild?: boolean;
  searchQuery?: string;
}

export interface CategoryConfig {
  id: PortfolioCategory | 'all';
  label: string;
  count?: number;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'all', label: 'All Work' },
  { id: 'residential', label: 'Residential' },
  { id: 'rental_units', label: 'Rental Units' },
  { id: 'apartments', label: 'Apartments' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'landscaping', label: 'Landscaping' },
  { id: 'technical_planning', label: 'Technical Planning' },
];

// Kenyan Land Parcel Sizes (Research-Based)
export const KENYAN_PLOT_SIZES = [
  { label: '40x80 (0.073 acres)', value: '40x80', sqm: 297.3, description: 'Compact plots, affordable housing' },
  { label: '50x100 (0.115 acres)', value: '50x100', sqm: 464.5, description: 'Standard residential plot' },
  { label: '100x100 (0.23 acres)', value: '100x100', sqm: 929.0, description: 'Quarter acre, family homes' },
  { label: '100x200 (0.46 acres)', value: '100x200', sqm: 1858.0, description: 'Half acre, large compounds' },
  { label: '1 Acre (4047 sqm)', value: '1 acre', sqm: 4047.0, description: 'Farm, villa, subdivision' },
] as const;

// Status Labels (UX Rule: Never imply built)
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  concept: 'Concept',
  design: 'Design',
  proposal: 'Proposal',
  plan: 'Plan',
  visualization: 'Visualization',
  completed: 'Completed',
};

export interface ProjectCardProps {
  project: PortfolioProject;
  index?: number;
}

export interface FeaturedCaseStudyProps {
  project: PortfolioProject;
}

export interface WorkHeroProps {
  featuredProjects: PortfolioProject[];
}