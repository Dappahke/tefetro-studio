// ============================================================
// TEFETRO STUDIOS - SUPABASE PORTFOLIO SERVICE
// Data fetching functions for portfolio
// ============================================================

import { createClient } from '@/lib/supabase/client';
import { PortfolioProject, PortfolioCategory } from '@/types/portfolio';

const supabase = createClient();

// Define the raw project type from Supabase
interface RawPortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: PortfolioCategory;
  plot_fit: string | null;
  images: string[] | null;
  featured: boolean | null;
  featured_order: number | null;
  display_order: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAllProjects(): Promise<PortfolioProject[]> {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return ((data || []) as RawPortfolioProject[]).map((project: RawPortfolioProject) => ({
    ...project,
    images: project.images || [],
  })) as PortfolioProject[];
}

export async function getFeaturedProjects(limit = 6): Promise<PortfolioProject[]> {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('featured', true)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('featured_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return ((data || []) as RawPortfolioProject[]).map((project: RawPortfolioProject) => ({
    ...project,
    images: project.images || [],
  })) as PortfolioProject[];
}

export async function getProjectsByCategory(
  category: PortfolioCategory
): Promise<PortfolioProject[]> {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('category', category)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching category projects:', error);
    return [];
  }

  return ((data || []) as RawPortfolioProject[]).map((project: RawPortfolioProject) => ({
    ...project,
    images: project.images || [],
  })) as PortfolioProject[];
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  if (!data) return null;

  const rawData = data as RawPortfolioProject;
  return {
    ...rawData,
    images: rawData.images || [],
  } as PortfolioProject;
}

export async function getProjectsByPlotSize(plotSize: string): Promise<PortfolioProject[]> {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('plot_fit', plotSize)
    .not('published_at', 'is', null)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects by plot size:', error);
    return [];
  }

  return ((data || []) as RawPortfolioProject[]).map((project: RawPortfolioProject) => ({
    ...project,
    images: project.images || [],
  })) as PortfolioProject[];
}

export async function getRelatedProjects(
  currentSlug: string,
  category: PortfolioCategory,
  limit = 3
): Promise<PortfolioProject[]> {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('category', category)
    .neq('slug', currentSlug)
    .not('published_at', 'is', null)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching related projects:', error);
    return [];
  }

  return ((data || []) as RawPortfolioProject[]).map((project: RawPortfolioProject) => ({
    ...project,
    images: project.images || [],
  })) as PortfolioProject[];
}