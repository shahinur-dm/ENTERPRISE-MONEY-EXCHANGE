import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['completed', 'approved', 'paid', 'active', 'settled', 'clear'].includes(norm)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['processing', 'assigned', 'collected', 'partially_paid'].includes(norm)) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (['pending_collection', 'compliance_review', 'under_review', 'draft'].includes(norm)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['on_hold', 'hold_enforced', 'suspended', 'locked'].includes(norm)) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (['rejected', 'cancelled', 'refunded', 'reversed', 'blocked'].includes(norm)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  // Format label text: snake_case to Title Case
  const label = norm.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase',
        colorClasses,
        className
      )}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}
