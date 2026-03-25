export function PriceDisplaySkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-20',
    md: 'h-8 w-28',
    lg: 'h-10 w-36'
  }

  return (
    <div className="inline-flex flex-col space-y-2">
      <div className={`bg-mist/50 rounded animate-pulse ${sizeClasses[size]}`} />
      <div className="h-3 w-24 bg-mist/30 rounded animate-pulse" />
    </div>
  )
}