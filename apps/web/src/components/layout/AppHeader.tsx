'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  Menu,
  Building2,
  Globe2,
  Bell,
  Search,
  HelpCircle,
  Clock,
  ChevronRight,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface AppHeaderProps {
  currentBranch?: string;
  onBranchChange?: (branch: string) => void;
  onMenuToggle?: () => void;
}

export function AppHeader({
  currentBranch = 'Kuala Lumpur Central (KUL-01)',
  onBranchChange,
  onMenuToggle,
}: AppHeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<'MYS' | 'BGD'>('MYS');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* 1. Left: Mobile Hamburger & Desktop Breadcrumbs */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile Hamburger Toggle Button (min 44px tap target) */}
        <button
          onClick={onMenuToggle}
          aria-label="Open mobile navigation"
          className="flex lg:hidden h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Compact Brand Title */}
        <div className="flex lg:hidden items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
            D
          </div>
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">DAWAT ERP</span>
        </div>

        {/* Desktop Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-500">
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

        {/* Desktop Global Search Bar with Shortcut */}
        <div className="relative hidden xl:block">
          <label htmlFor="global-search" className="sr-only">
            Search transactions, customers, or ledger
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="global-search"
            type="text"
            placeholder="Search orders, parties, or ledger..."
            className="w-60 2xl:w-72 pl-9 pr-12 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
          <kbd className="absolute right-2.5 top-2 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 border border-slate-300">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* 2. Right: Selectors, Live Corridor Ticker, Notifications, User Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Language Switcher: EN | বাংলা */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
          <button
            onClick={() => setLocale('en')}
            className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              locale === 'en'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLocale('bn')}
            className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              locale === 'bn'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            বাংলা
          </button>
        </div>

        {/* Live Corridor Rates Ticker (Desktop only) */}
        <div className="hidden 2xl:flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs text-emerald-800 font-mono shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">MYR ⇄ BDT</span>
          <span className="text-emerald-400">•</span>
          <span>Buy: 33.00</span>
          <span className="text-emerald-400">•</span>
          <span>Sell: 35.00</span>
        </div>

        {/* Country Selector (Tablet / Desktop) */}
        <div className="hidden md:flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
          <select
            aria-label="Country Corridor"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as any)}
            className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-xs"
          >
            <option value="MYS">🇲🇾 Malaysia (MYR)</option>
            <option value="BGD">🇧🇩 Bangladesh (BDT)</option>
          </select>
        </div>

        {/* Branch Selector (Tablet / Desktop) */}
        <div className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <select
            aria-label="Operating Branch"
            value={currentBranch}
            onChange={(e) => onBranchChange?.(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer max-w-[140px] md:max-w-[160px] truncate text-xs"
          >
            <option value="Kuala Lumpur Central (KUL-01)">Kuala Lumpur HQ</option>
            <option value="Dhaka Motijheel Principal (DHK-01)">Dhaka Motijheel HQ</option>
            <option value="Chittagong Agrabad (CTG-01)">Chittagong Branch</option>
          </select>
        </div>

        {/* Live Date / Time (Large displays only) */}
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
          className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors hidden sm:block"
          title="Open API & Swagger Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </a>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-4 shadow-xl border border-slate-200 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs py-1">
                <div className="py-2.5 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">MYR ⇄ BDT Corridor Rate Approved</div>
                    <div className="text-[10px] text-slate-400">Maker-Checker authorization complete</div>
                  </div>
                </div>
                <div className="py-2.5 flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">Sanctions Screening Alert</div>
                    <div className="text-[10px] text-slate-400">Potential name match on remittance REM-081</div>
                  </div>
                </div>
                <div className="py-2.5 flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">General Ledger Balanced</div>
                    <div className="text-[10px] text-slate-400">Sum(Debit) == Sum(Credit) verified</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-label="User account menu"
            className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-blue-100 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
              AD
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">Chief Executive Admin</div>
                <div className="text-[11px] text-slate-400 font-mono truncate">admin@moneyexchange.com</div>
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/admin/users"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>User Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>System Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('refresh_token');
                      window.location.href = '/login';
                    }
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
