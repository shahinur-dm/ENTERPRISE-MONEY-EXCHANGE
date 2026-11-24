'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe2,
  Bell,
  Search,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ArrowRightLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface AppHeaderProps {
  currentBranch?: string;
  onBranchChange?: (branch: string) => void;
}

export function AppHeader({
  currentBranch = 'Kuala Lumpur Central (KUL-01)',
  onBranchChange,
}: AppHeaderProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<'MYS' | 'BGD'>('MYS');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'DAWAT ERP', href: '/' },
    ...pathSegments.map((seg, idx) => ({
      label: seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      href: '/' + pathSegments.slice(0, idx + 1).join('/'),
    })),
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-6 backdrop-blur-md">
      {/* Left: Breadcrumbs & Global Search */}
      <div className="flex items-center space-x-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500">
          {breadcrumbs.map((bc, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={bc.href}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                {isLast ? (
                  <span className="font-bold text-slate-900">{bc.label}</span>
                ) : (
                  <Link href={bc.href} className="hover:text-blue-600 transition-colors">
                    {bc.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Global Search Bar with Shortcut */}
        <div className="relative hidden md:block">
          <label htmlFor="global-search" className="sr-only">Search transactions, customers, or ledger</label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="global-search"
            type="text"
            placeholder="Search orders, parties, or ledger..."
            className="w-64 lg:w-72 pl-9 pr-12 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
          <kbd className="absolute right-2.5 top-2 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 border border-slate-300">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Branch Selector, Live Rates, Time, User Controls */}
      <div className="flex items-center space-x-3.5">
        {/* Live Corridor Rates Ticker */}
        <div className="hidden xl:flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs text-emerald-800 font-mono shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">MYR ⇄ BDT</span>
          <span className="text-emerald-400">•</span>
          <span>Buy: 33.00</span>
          <span className="text-emerald-400">•</span>
          <span>Sell: 35.00</span>
        </div>

        {/* Country Selector */}
        <div className="hidden lg:flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
          <select
            aria-label="Country Corridor"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as any)}
            className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
          >
            <option value="MYS">🇲🇾 Malaysia (MYR)</option>
            <option value="BGD">🇧🇩 Bangladesh (BDT)</option>
          </select>
        </div>

        {/* Branch Selector */}
        <div className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <select
            aria-label="Operating Branch"
            value={currentBranch}
            onChange={(e) => onBranchChange?.(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer max-w-[160px] truncate"
          >
            <option value="Kuala Lumpur Central (KUL-01)">Kuala Lumpur HQ</option>
            <option value="Dhaka Motijheel Principal (DHK-01)">Dhaka Motijheel HQ</option>
            <option value="Chittagong Agrabad (CTG-01)">Chittagong Branch</option>
          </select>
        </div>

        {/* Live Date / Time */}
        {currentTime && (
          <div className="hidden 2xl:flex items-center space-x-1 text-xs text-slate-400 font-mono pl-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime}</span>
          </div>
        )}

        {/* API Docs Button */}
        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Open API & Swagger Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </a>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Compliance & Audit Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              AD
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
