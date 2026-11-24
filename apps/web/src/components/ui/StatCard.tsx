import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: any;
  currency?: string;
  changePercent?: number;
  changeLabel?: string;
  variant?: 'white' | 'gradient' | 'breakdown';
  accentWave?: 'none' | 'coral' | 'blue';
  tag?: string;
  subText?: string;
  onClick?: () => void;
  className?: string;
  breakdown?: {
    profitLabel?: string;
    profitPercent?: number;
    pendingLabel?: string;
    pendingPercent?: number;
    helpedLabel?: string;
    helpedPercent?: number;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  currency,
  changePercent,
  changeLabel = 'Total last month',
  variant = 'white',
  accentWave = 'none',
  tag,
  subText,
  onClick,
  className,
  breakdown = {
    profitLabel: 'Profit',
    profitPercent: 65,
    pendingLabel: 'Total pending',
    pendingPercent: 22,
    helpedLabel: 'Total helped',
    helpedPercent: 13,
  },
}: StatCardProps) {
  const isPositive = (changePercent ?? 0) >= 0;
  const effectiveSubText = subText || subtitle;

  // 1. Euro Account Style: Gradient Blue with soft lighting and top-right arrow circle
  if (variant === 'gradient') {
    return (
      <div
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={cn(
          'relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-lg shadow-blue-500/15 transition-all duration-200 select-none group',
          onClick && 'cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]',
          className
        )}
      >
        {/* Soft decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-blue-400/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-blue-100">{title}</span>
            {tag && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white tracking-wider uppercase">
                {tag}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white backdrop-blur-xs group-hover:bg-white/25 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono">{value}</span>
            {currency && <span className="text-lg font-bold text-blue-200 font-mono">{currency}</span>}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
          {changePercent !== undefined && (
            <span className="inline-flex items-center font-bold px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono">
              {isPositive ? '+' : ''}{changePercent}%
            </span>
          )}
          <span className="text-blue-100/80 text-[11px] truncate">{changeLabel}</span>
        </div>
      </div>
    );
  }

  // 2. Total Balance Style: Multi-segmented progress bar with legend
  if (variant === 'breakdown') {
    return (
      <div
        className={cn(
          'rounded-2xl p-6 bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between transition-all select-none',
          className
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700">{title}</span>
          {tag && (
            <span
              onClick={onClick}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>{tag}</span>
            </span>
          )}
        </div>

        <div className="flex items-baseline space-x-2 my-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {value}
          </span>
          {currency && <span className="text-lg font-bold text-slate-500 font-mono">{currency}</span>}
        </div>

        {/* Multi-segmented financial progress bar */}
        <div className="mt-4 space-y-2">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className="h-full bg-blue-500 rounded-l-full"
              style={{ width: `${breakdown.profitPercent}%` }}
              title={`${breakdown.profitLabel}: ${breakdown.profitPercent}%`}
            />
            <div
              className="h-full bg-sky-300"
              style={{ width: `${breakdown.pendingPercent}%` }}
              title={`${breakdown.pendingLabel}: ${breakdown.pendingPercent}%`}
            />
            <div
              className="h-full bg-indigo-300 rounded-r-full"
              style={{ width: `${breakdown.helpedPercent}%` }}
              title={`${breakdown.helpedLabel}: ${breakdown.helpedPercent}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
              {breakdown.profitLabel}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-sky-300 mr-1.5" />
              {breakdown.pendingLabel}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-300 mr-1.5" />
              {breakdown.helpedLabel}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Pounds & US Dollar Accounts: Clean White Card with optional soft coral curve
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200/90 shadow-2xs transition-all duration-200 select-none flex flex-col justify-between',
        onClick && 'cursor-pointer hover:border-blue-400 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
    >
      {/* Soft coral accent wave in bottom right (like Pounds account in screenshot) */}
      {accentWave === 'coral' && (
        <svg
          className="absolute right-0 bottom-0 w-36 h-28 pointer-events-none opacity-40 transition-opacity group-hover:opacity-60"
          viewBox="0 0 160 120"
          fill="none"
        >
          <path
            d="M 160 30 C 120 40, 80 80, 60 120 L 160 120 Z"
            fill="url(#coral-grad)"
          />
          <defs>
            <linearGradient id="coral-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FB7185" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      )}

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
          {title}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
          {IconComponent ? <IconComponent className="w-4 h-4 text-blue-600" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
      </div>

      <div className="my-2 relative z-10">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {value}
          </span>
          {currency && <span className="text-lg font-bold text-slate-400 font-mono">{currency}</span>}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
        {changePercent !== undefined ? (
          <span
            className={cn(
              'inline-flex items-center font-bold px-2 py-0.5 rounded-full text-[11px] font-mono',
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
            )}
          >
            {isPositive ? '+' : ''}{changePercent}%
          </span>
        ) : effectiveSubText ? (
          <span className="text-slate-400 text-[11px] font-medium">{effectiveSubText}</span>
        ) : null}
        {changePercent !== undefined && <span className="text-slate-400 text-[11px] truncate">{changeLabel}</span>}
      </div>
    </div>
  );
}
