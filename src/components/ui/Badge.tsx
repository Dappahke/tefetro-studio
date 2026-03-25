import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'badge-default',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-error/20 text-error border-error/30',
  };

  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}
