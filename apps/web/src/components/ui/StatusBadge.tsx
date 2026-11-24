import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const norm = (status || '').toLowerCase();

  let styles = {
    bg: 'bg-slate-50 border-slate-200 text-slate-700',
    dot: 'bg-slate-400',
  };

  if (['completed', 'approved', 'paid', 'active', 'settled', 'clear', 'finalized'].includes(norm)) {
    styles = {
      bg: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-800',
      dot: 'bg-emerald-500',
    };
  } else if (['processing', 'assigned', 'collected', 'partially_paid'].includes(norm)) {
    styles = {
      bg: 'bg-blue-50/90 border-blue-200/80 text-blue-800',
      dot: 'bg-blue-500',
    };
  } else if (['pending_collection', 'compliance_review', 'under_review', 'draft', 'pending'].includes(norm)) {
    styles = {
      bg: 'bg-amber-50/90 border-amber-200/80 text-amber-800',
      dot: 'bg-amber-500',
    };
  } else if (['on_hold', 'hold_enforced', 'suspended', 'locked'].includes(norm)) {
    styles = {
      bg: 'bg-purple-50/90 border-purple-200/80 text-purple-800',
      dot: 'bg-purple-500',
    };
  } else if (['rejected', 'cancelled', 'refunded', 'reversed', 'blocked'].includes(norm)) {
    styles = {
      bg: 'bg-rose-50/90 border-rose-200/80 text-rose-800',
      dot: 'bg-rose-500',
    };
  }

  const label = norm.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border shadow-2xs select-none tracking-tight',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        styles.bg,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 mr-1.5 rounded-full shrink-0', styles.dot)} />
      {label}
    </span>
  );
}
