import { getUserCurrencyInfo } from '@/lib/currency'

interface PriceDisplayProps {
  amountKES: number
  className?: string
  showOriginal?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export async function PriceDisplay({ 
  amountKES, 
  className = '',
  showOriginal = true,
  size = 'md'
}: PriceDisplayProps) {
  const info = await getUserCurrencyInfo(amountKES)

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {/* Main Price */}
      <span className={`font-bold text-tefetra tracking-tight ${sizeClasses[size]}`}>
        {info.formatted}
      </span>
      
      {/* Original KES + Exchange Info */}
      {showOriginal && info.currency !== 'KES' && (
        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
          <span>
            ≈ {new Intl.NumberFormat('en-KE', {
              style: 'currency',
              currency: 'KES',
              maximumFractionDigits: 0,
            }).format(amountKES)}
          </span>
          {info.isEstimated && (
            <span className="px-1.5 py-0.5 bg-mist/50 rounded text-[10px]">
              estimated
            </span>
          )}
        </div>
      )}
      
      {/* Location Badge */}
      <span className="text-[10px] text-sage mt-0.5 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {info.country} • {info.currency}
      </span>
    </div>
  )
}