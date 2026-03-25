import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-surface rounded-2xl border border-white/5 overflow-hidden',
        hover && 'card-hover',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
