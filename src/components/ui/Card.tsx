import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  raised?: boolean;
}

export function Card({ children, className = '', raised = false }: CardProps) {
  return (
    <div className={`${raised ? 'card-raised' : 'card'} rounded-[var(--radius-lg)] ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5 ${className}`}>
      <h3 className="min-w-0 truncate text-[14.5px] font-medium text-[var(--color-text)]">
        {title}
      </h3>
      {action}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`px-4 pb-4 sm:px-5 sm:pb-5 ${className}`}>{children}</div>;
}
