// src/components/products/PriceDisplay.tsx

import { getUserCurrencyInfo } from '@/lib/currency'
import { cn } from '@/lib/utils'

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
  size = 'md',
}: PriceDisplayProps) {
  const info =
    await getUserCurrencyInfo(
      amountKES
    )

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl md:text-5xl',
  }

  const kesFormatted =
    new Intl.NumberFormat(
      'en-KE',
      {
        style:
          'currency',
        currency:
          'KES',
        maximumFractionDigits: 0,
      }
    ).format(amountKES)

  return (
    <div
      className={cn(
        'inline-flex flex-col gap-2',
        className
      )}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Price
        </span>

        {info.currency !==
          'KES' && (
          <span className="rounded-full bg-[#0F4C5C]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#0F4C5C]">
            Local Currency
          </span>
        )}
      </div>

      {/* Main Price */}
      <span
        className={cn(
          'font-bold tracking-tight text-[#0F4C5C] leading-none',
          sizeClasses[
            size
          ]
        )}
      >
        {
          info.formatted
        }
      </span>

      {/* Original Price */}
      {showOriginal &&
        info.currency !==
          'KES' && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>
              Base Price:
            </span>

            <span className="font-semibold text-slate-700">
              {
                kesFormatted
              }
            </span>

            {info.isEstimated && (
              <span className="rounded-full bg-[#C88A2B]/12 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8B6A22]">
                Estimated
              </span>
            )}
          </div>
        )}

      {/* Geo Trust Line */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <svg
            className="h-3.5 w-3.5 text-[#1F4E79]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={
                2
              }
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={
                2
              }
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <span>
            {
              info.country
            }
          </span>
        </div>

        <span className="text-slate-300">
          •
        </span>

        <span>
          {
            info.currency
          }
        </span>

        <span className="text-slate-300">
          •
        </span>

        <span>
          Auto-detected
        </span>
      </div>
    </div>
  )
}