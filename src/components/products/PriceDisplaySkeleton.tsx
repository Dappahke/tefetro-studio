import { cn } from '@/lib/utils'

interface PriceDisplaySkeletonProps {
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplaySkeleton({ size = 'md' }: PriceDisplaySkeletonProps) {
  const sizeClasses = {
    sm: 'h-6 w-20',
    md: 'h-8 w-28',
    lg: 'h-10 w-36'
  }

  return (
    <div className="inline-flex flex-col space-y-2">
      {/* Main price skeleton - using Deep Teal opacity for brand consistency */}
      <div className={cn(
        'bg-[#0F4C5C]/10 rounded animate-pulse',
        sizeClasses[size]
      )} />
      {/* Secondary line skeleton */}
      <div className="h-3 w-24 bg-[#0F4C5C]/5 rounded animate-pulse" />
    </div>
  )
}