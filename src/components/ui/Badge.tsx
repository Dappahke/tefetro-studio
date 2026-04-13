// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'error';
  className?: string;
  // Accessibility
  role?: string;
  'aria-label'?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  className,
  role = 'status',
  'aria-label': ariaLabel
}: BadgeProps) {
  const variants = {
    default: 'bg-[#eaf3fb] text-[#1f4e79] border-[#1f4e79]/20',
    primary: 'bg-[#F28C00]/10 text-[#F28C00] border-[#F28C00]/20',
    secondary: 'bg-[#0F4C5C]/10 text-[#0F4C5C] border-[#0F4C5C]/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
}