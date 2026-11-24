import React from 'react';
import { cn } from '@/lib/utils';

export interface CurrencyBadgeProps {
  code: string;
  symbol?: string;
  className?: string;
}

export function CurrencyBadge({ code, symbol, className }: CurrencyBadgeProps) {
  const flags: Record<string, string> = {
    MYR: '🇲🇾',
    BDT: '🇧🇩',
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    SAR: '🇸🇦',
    AED: '🇦🇪',
    SGD: '🇸🇬',
  };

  const flag = flags[code.toUpperCase()] || '🌐';

  return (
    <span
      className={cn(
        'inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-slate-100/80 border border-slate-200/80 text-xs font-semibold text-slate-800',
        className
      )}
    >
      <span className="text-sm leading-none">{flag}</span>
      <span className="font-mono tracking-tight">{code}</span>
      {symbol && <span className="text-slate-400 font-normal">({symbol})</span>}
    </span>
  );
}
