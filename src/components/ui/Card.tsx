// src/components/ui/Card.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  // Accessibility
  role?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  tabIndex?: number;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card({ 
    children, 
    className, 
    hover = true, 
    onClick,
    role = 'region',
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    tabIndex
  }, ref) {
    const isClickable = !!onClick;

    return (
      <div
        ref={ref}
        onClick={onClick}
        role={isClickable ? 'button' : role}
        aria-label={ariaLabel}
        aria-pressed={isClickable ? ariaPressed : undefined}
        tabIndex={isClickable ? (tabIndex ?? 0) : tabIndex}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        } : undefined}
        className={cn(
          'bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden',
          hover && 'transition-all duration-300 hover:shadow-xl hover:shadow-[#0f2a44]/5 hover:-translate-y-1',
          isClickable && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:ring-offset-2',
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';