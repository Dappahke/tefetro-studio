// src/components/ui/Button.tsx
'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className,
    disabled,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...props
  }, ref) {
    const variants = {
      primary: 'bg-[#F28C00] text-white hover:bg-[#e66b00] shadow-lg shadow-[#F28C00]/25',
      secondary: 'bg-[#0F4C5C] text-white hover:bg-[#1f4e79]',
      ghost: 'bg-transparent text-[#1E1E1E] hover:bg-[#F28C00]/10 hover:text-[#F28C00]',
      outline: 'bg-transparent border-2 border-[#E5E7EB] text-[#1E1E1E] hover:border-[#F28C00] hover:text-[#F28C00]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold',
          'transition-all duration-300 transform active:scale-[0.98]',
          'focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:ring-offset-2',
          variants[variant],
          sizes[size],
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2 
            className="w-4 h-4 animate-spin" 
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';