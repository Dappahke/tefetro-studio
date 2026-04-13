// src/components/ui/Input.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[#1E1E1E] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white',
              'text-[#1E1E1E] placeholder:text-[#9CA3AF]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#F28C00]/50 focus:border-[#F28C00]',
              icon && 'pl-12',
              error 
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
                : 'border-[#E5E7EB] hover:border-[#D1D5DB]',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            {...props}
          />
        </div>
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-[#6B7280]">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';