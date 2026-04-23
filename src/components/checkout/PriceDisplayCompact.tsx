// src/components/checkout/PriceDisplayCompact.tsx

interface PriceDisplayCompactProps {
  amountKES: number
  className?: string
}

export function PriceDisplayCompact({
  amountKES,
  className = '',
}: PriceDisplayCompactProps) {
  return (
    <span
      className={`font-semibold text-[#0F4C5C] ${className}`}
    >
      KES {Number(amountKES).toLocaleString()}
    </span>
  )
}