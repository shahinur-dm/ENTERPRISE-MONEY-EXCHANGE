import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  action,
  badge,
  className,
}: PageHeaderProps) {
  const effectiveActions = actions || action;
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6',
        className
      )}
    >
      <div>
        <div className="flex items-center space-x-2.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-slate-500 mt-1 font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {effectiveActions && <div className="flex items-center space-x-2.5 shrink-0">{effectiveActions}</div>}
    </div>
  );
}
