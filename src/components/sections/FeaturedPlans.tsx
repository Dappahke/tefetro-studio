// src/components/sections/FeaturedPlans.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { ArrowUpRight, Bed, Bath, Square, ChevronLeft, ChevronRight, FileImage } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  price: number | null;
  file_path: string | null;
  elevation_images: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  plinth_area: number | null;
  category: string | null;
}

function formatPrice(price: number | null): string {
  if (!price) return "Price on request";
  return `KES ${price.toLocaleString()}`;
}

function formatArea(area: number | null): string {
  if (!area) return "N/A";
  return `${area} m²`;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

function isImage(path: string | null | undefined): boolean {
  if (!path) return false;
  const lower = path.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}

function getStorageUrl(fileName: string | null | undefined): string | null {
  if (!fileName) return null;

  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName;
  }

  let cleanFileName = fileName.startsWith('/') ? fileName.slice(1) : fileName;
  
  if (cleanFileName.includes('/')) {
    const { data } = supabase.storage.from('drawings').getPublicUrl(cleanFileName);
    return data?.publicUrl || null;
  }
  
  const fullPath = `elevations/${cleanFileName}`;
  const { data } = supabase.storage.from('drawings').getPublicUrl(fullPath);
  return data?.publicUrl || null;
}

function getFirstImage(plan: Product): string | null {
  if (plan.elevation_images && plan.elevation_images.length > 0) {
    const validImages = plan.elevation_images.filter(img => img && img.trim() !== '');
    
    for (const img of validImages) {
      if (isImage(img)) {
        const fileName = img.split('/').pop() || img;
        const url = getStorageUrl(fileName);
        if (url) {
          return url;
        }
      }
    }
  }

  if (plan.file_path && isImage(plan.file_path)) {
    const fileName = plan.file_path.split('/').pop() || plan.file_path;
    const url = getStorageUrl(fileName);
    if (url) {
      return url;
    }
  }

  return null;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function useCarousel(itemCount: number, itemsPerView: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, itemCount - itemsPerView);
  
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;
  
  const next = useCallback(() => setCurrentIndex(i => Math.min(i + 1, maxIndex)), [maxIndex]);
  const prev = useCallback(() => setCurrentIndex(i => Math.max(i - 1, 0)), []);
  const goTo = useCallback((index: number) => setCurrentIndex(Math.max(0, Math.min(index, maxIndex))), [maxIndex]);
  
  return { currentIndex, next, prev, goTo, canGoNext, canGoPrev, maxIndex };
}

function PlanCard({ plan }: { plan: Product }) {
  const imageSrc = getFirstImage(plan);
  const [imgError, setImgError] = useState(false);

  return (
    <article 
      className="group relative bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#1E1E1E]/8 hover:-translate-y-2 hover:border-[#1F4E79]/20 h-full flex flex-col"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#eaf3fb] to-[#d4e6f7]">
        {imageSrc && !imgError ? (
          <Image
            src={imageSrc}
            alt={`${plan.title} - Architectural house plan Kenya`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              console.error(`Failed to load image: ${imageSrc}`);
              setImgError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1F4E79]/40">
            <FileImage className="w-12 h-12 mb-2" />
            <span className="text-sm font-medium">No Preview Available</span>
          </div>
        )}

        {plan.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[#1F4E79] text-xs font-bold rounded-full shadow-sm border border-[#1F4E79]/10">
              {plan.category}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-bold text-lg">{formatPrice(plan.price)}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#1E1E1E] group-hover:text-[#1F4E79] transition-colors line-clamp-1 mb-2">
          {plan.title}
        </h3>
        <p className="text-sm text-[#555] mb-4 line-clamp-2 flex-1">
          {plan.description || "Complete architectural drawings with floor plans and elevations."}
        </p>

        <div className="flex items-center gap-3 sm:gap-4 text-sm text-[#555] mb-5 flex-wrap">
          {plan.bedrooms !== null && plan.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0F4C5C]/5 px-2.5 py-1 rounded-lg">
              <Bed className="w-3.5 h-3.5 text-[#0F4C5C]" aria-hidden="true" />
              <span className="font-medium">{plan.bedrooms}</span>
            </div>
          )}
          {plan.bathrooms !== null && plan.bathrooms > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0F4C5C]/5 px-2.5 py-1 rounded-lg">
              <Bath className="w-3.5 h-3.5 text-[#0F4C5C]" aria-hidden="true" />
              <span className="font-medium">{plan.bathrooms}</span>
            </div>
          )}
          {plan.plinth_area !== null && plan.plinth_area > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0F4C5C]/5 px-2.5 py-1 rounded-lg">
              <Square className="w-3.5 h-3.5 text-[#0F4C5C]" aria-hidden="true" />
              <span className="font-medium">{formatArea(plan.plinth_area)}</span>
            </div>
          )}
        </div>

        <Link 
          href={`/products/${plan.slug || plan.id}`}
          className="w-full group/btn flex items-center justify-center gap-2 py-3 px-4 bg-[#FAF9F6] hover:bg-[#1F4E79] text-[#1E1E1E] hover:text-white rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2 border border-[#e8e8e8] hover:border-[#1F4E79]"
        >
          <span>View Plan Details</span>
          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F28C00] to-[#ff9f2e] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </article>
  );
}

export default function FeaturedPlans() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const { currentIndex, next, prev, goTo, canGoNext, canGoPrev } = useCarousel(products.length, itemsPerView);

  useEffect(() => {
    async function fetchRandomProducts() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('id, title, slug, description, price, file_path, elevation_images, bedrooms, bathrooms, plinth_area, category')
          .not('slug', 'is', null);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Type assertion to let TypeScript know the shape of data matches Product
          const typedData = data as Product[];
          const shuffled = shuffleArray(typedData);
          setProducts(shuffled.slice(0, 5));
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err?.message || 'Failed to load featured plans.');
      } finally {
        setLoading(false);
      }
    }

    fetchRandomProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  if (loading) {
    return (
      <section className="relative py-20 sm:py-28 overflow-hidden bg-[#FAF9F6]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-[#f5f7fa] to-[#FAF9F6]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-[#1F4E79] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 sm:py-28 overflow-hidden bg-[#FAF9F6]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="relative py-20 sm:py-28 overflow-hidden bg-[#FAF9F6]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555]">No plans available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#FAF9F6]" aria-labelledby="featured-plans-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-[#f5f7fa] to-[#FAF9F6]" />
      
      <div className="absolute -top-20 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[120px]" style={{ background: "radial-gradient(circle, #0F4C5C 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[100px]" style={{ background: "radial-gradient(circle, #F28C00 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F4E79]/5 border border-[#1F4E79]/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C00]" />
            <p className="text-[#1F4E79] font-semibold text-xs tracking-widest uppercase">Featured Collection</p>
          </div>
          <h2 id="featured-plans-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1E1E] mb-4 tracking-tight">
            Popular House Plans
          </h2>
          <p className="text-[#555] max-w-2xl mx-auto text-lg">
            Explore affordable and modern house designs tailored for Kenyan plots.
          </p>
        </header>

        <div className="relative">
          <button onClick={prev} disabled={!canGoPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-20 w-12 h-12 rounded-full bg-white shadow-lg shadow-[#1E1E1E]/10 border border-[#e8e8e8] flex items-center justify-center text-[#1E1E1E] hover:bg-[#1F4E79] hover:text-white hover:border-[#1F4E79] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} disabled={!canGoNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-20 w-12 h-12 rounded-full bg-white shadow-lg shadow-[#1E1E1E]/10 border border-[#e8e8e8] flex items-center justify-center text-[#1E1E1E] hover:bg-[#1F4E79] hover:text-white hover:border-[#1F4E79] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div ref={containerRef} className="overflow-hidden cursor-grab active:cursor-grabbing px-2" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="flex gap-6 transition-transform duration-500 ease-out will-change-transform" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`, width: `${(products.length / itemsPerView) * 100}%` }}>
              {products.map((plan) => (
                <div key={plan.id} className="flex-shrink-0 px-1" style={{ width: `${100 / products.length}%` }}>
                  <PlanCard plan={plan} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.max(1, products.length - itemsPerView + 1) }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2 ${i === currentIndex ? "w-8 bg-[#1F4E79]" : "w-2 bg-[#1F4E79]/20 hover:bg-[#1F4E79]/40"}`} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-[#1F4E79] font-semibold hover:text-[#F28C00] transition-colors text-lg">
            View All Plans
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}