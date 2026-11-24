import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface KPIStatCardProps {
  title: string;
  value: string;
  currencySymbol?: string;
  changePercent?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  highlight?: boolean;
}

export function KPIStatCard({
  title,
  value,
  currencySymbol,
  changePercent,
  subtitle,
  icon,
  onClick,
  className,
  highlight = false,
}: KPIStatCardProps) {
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group relative flex flex-col justify-between p-4 rounded-xl border bg-white transition-all duration-200 select-none text-left',
        onClick && 'cursor-pointer hover:shadow-md hover:border-blue-400 active:scale-[0.99]',
        highlight
          ? 'border-blue-300 ring-2 ring-blue-500/10 bg-gradient-to-br from-white to-blue-50/30'
          : 'border-slate-200/80 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5 my-1">
        {currencySymbol && (
          <span className="text-base font-bold text-slate-400 font-mono">
            {currencySymbol}
          </span>
        )}
        <span className="text-xl font-extrabold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="truncate">{subtitle || 'Verified Ledger Balance'}</span>
        {changePercent !== undefined && (
          <span
            className={cn(
              'inline-flex items-center font-medium font-mono text-[11px] px-1.5 py-0.5 rounded',
              isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(changePercent)}%
          </span>
        )}
      </div>
    </div>
  );
}
