import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  currency?: string;
  changePercent?: number;
  changeLabel?: string;
  variant?: 'white' | 'gradient' | 'breakdown';
  icon?: React.ReactNode;
  tag?: string;
  onClick?: () => void;
  className?: string;
  breakdown?: {
    profit: string;
    pending: string;
    funded: string;
  };
}

export function StatCard({
  title,
  value,
  currency,
  changePercent,
  changeLabel = 'vs last period',
  variant = 'white',
  icon,
  tag,
  onClick,
  className,
  breakdown,
}: StatCardProps) {
  const isPositive = (changePercent ?? 0) >= 0;

  if (variant === 'gradient') {
    return (
      <div
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={cn(
          'relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 select-none group',
          onClick && 'cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]',
          className
        )}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-blue-100">{title}</span>
            {tag && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white tracking-wider uppercase">
                {tag}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs group-hover:bg-white/30 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono">{value}</span>
            {currency && <span className="text-lg font-bold text-blue-200 font-mono">{currency}</span>}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
          {changePercent !== undefined && (
            <span className="inline-flex items-center font-bold px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px]">
              {isPositive ? '+' : ''}{changePercent}%
            </span>
          )}
          <span className="text-blue-200 text-[11px] truncate">{changeLabel}</span>
        </div>
      </div>
    );
  }

  if (variant === 'breakdown') {
    return (
      <div
        className={cn(
          'rounded-2xl p-6 bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between transition-all select-none',
          className
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-600">{title}</span>
          {tag && (
            <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
              {tag}
            </span>
          )}
        </div>

        <div className="flex items-baseline space-x-2 my-1">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {value}
          </span>
          {currency && <span className="text-lg font-bold text-slate-500 font-mono">{currency}</span>}
        </div>

        {/* Multi-segmented financial progress bar */}
        <div className="mt-4 space-y-2">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
            <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '65%' }} />
            <div className="h-full bg-indigo-300" style={{ width: '25%' }} />
            <div className="h-full bg-emerald-400 rounded-r-full" style={{ width: '10%' }} />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
              Profit
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-300 mr-1.5" />
              Pending
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
              Funded
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Standard clean white fintech card with sparkline-feel
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200/90 shadow-xs transition-all duration-200 select-none flex flex-col justify-between',
        onClick && 'cursor-pointer hover:border-blue-400 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
          {title}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div className="my-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {value}
          </span>
          {currency && <span className="text-lg font-bold text-slate-400 font-mono">{currency}</span>}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {changePercent !== undefined && (
          <span
            className={cn(
              'inline-flex items-center font-bold px-2 py-0.5 rounded-full text-[11px] font-mono',
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            )}
          >
            {isPositive ? '+' : ''}{changePercent}%
          </span>
        )}
        <span className="text-slate-400 text-[11px] truncate">{changeLabel}</span>
      </div>
    </div>
  );
}
