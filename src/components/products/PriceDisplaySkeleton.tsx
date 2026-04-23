// src/components/products/PriceDisplaySkeleton.tsx

import { cn } from '@/lib/utils'

interface PriceDisplaySkeletonProps {
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplaySkeleton({
  size = 'md',
}: PriceDisplaySkeletonProps) {
  const sizeClasses = {
    sm: {
      main: 'h-7 w-24',
      line: 'h-3 w-20',
      badge: 'h-5 w-14',
    },
    md: {
      main: 'h-9 w-32',
      line: 'h-3.5 w-24',
      badge: 'h-5 w-16',
    },
    lg: {
      main: 'h-12 w-44',
      line: 'h-4 w-28',
      badge: 'h-6 w-20',
    },
  }

  const active =
    sizeClasses[size]

  return (
    <div className="inline-flex flex-col gap-3">
      {/* Top label row */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-14 rounded-full bg-slate-200 animate-pulse" />

        <div
          className={cn(
            'rounded-full bg-[#0F4C5C]/8 animate-pulse',
            active.badge
          )}
        />
      </div>

      {/* Main price */}
      <div
        className={cn(
          'rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse',
          active.main
        )}
      />

      {/* Secondary info */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'rounded-full bg-slate-200 animate-pulse',
            active.line
          )}
        />

        <div className="h-5 w-20 rounded-full bg-[#C88A2B]/10 animate-pulse" />
      </div>

      {/* Geo row */}
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-3.5 rounded-full bg-[#1F4E79]/20 animate-pulse" />

        <div className="h-3 w-16 rounded-full bg-slate-200 animate-pulse" />

        <div className="h-3 w-10 rounded-full bg-slate-200 animate-pulse" />
      </div>
    </div>
  )
}