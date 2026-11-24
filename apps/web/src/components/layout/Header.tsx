'use client';

import React, { useState } from 'react';
import {
  Building2,
  Globe2,
  Bell,
  ArrowRightLeft,
  UserCheck,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export interface HeaderProps {
  currentBranch?: string;
  onBranchChange?: (branch: string) => void;
  userRole?: string;
  userName?: string;
}

export function Header({
  currentBranch = 'Kuala Lumpur Central (KUL-01)',
  onBranchChange,
  userRole = 'MASTER_ADMIN',
  userName = 'Executive Admin',
}: HeaderProps) {
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');

  const branches = [
    { code: 'KUL-01', name: 'Kuala Lumpur Central (KUL-01)', country: 'Malaysia', flag: '🇲🇾' },
    { code: 'DHK-01', name: 'Dhaka Motijheel Principal (DHK-01)', country: 'Bangladesh', flag: '🇧🇩' },
    { code: 'CTG-01', name: 'Chittagong Agrabad (CTG-01)', country: 'Bangladesh', flag: '🇧🇩' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Left: Active Branch Selector & Live Corridor Banner */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <label htmlFor="branch-select" className="sr-only">Operational Branch</label>
          <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
            <Building2 className="w-4 h-4 text-blue-600" />
            <select
              id="branch-select"
              aria-label="Select Operational Branch"
              value={currentBranch}
              onChange={(e) => onBranchChange?.(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.flag} {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Corridor Status Indicator */}
        <div className="hidden lg:flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs text-emerald-800 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">MYR / BDT</span>
          <span className="text-emerald-500">•</span>
          <span>Buy: 33.00</span>
          <span className="text-emerald-500">•</span>
          <span>Sell: 35.00</span>
        </div>
      </div>

      {/* Right: Quick Action CTAs, Language Toggle, Notifications, Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick action buttons */}
        <div className="hidden sm:flex items-center space-x-2 mr-2">
          <Link
            href="/remittance"
            className="flex items-center space-x-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{lang === 'EN' ? 'New Remittance' : 'নতুন রেমিট্যান্স'}</span>
          </Link>
          <Link
            href="/exchange/buy"
            className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span>{lang === 'EN' ? 'Buy FX' : 'মুদ্রা ক্রয়'}</span>
          </Link>
          <Link
            href="/exchange/sell"
            className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span>{lang === 'EN' ? 'Sell FX' : 'মুদ্রা বিক্রয়'}</span>
          </Link>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
          className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          title="Switch Language"
        >
          <Globe2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold">{lang}</span>
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs uppercase shadow-sm">
            {userName.slice(0, 2)}
          </div>
          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-slate-800">{userName}</span>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
              {userRole.replace('_', ' ')}
            </span>
          </div>
          <Link
            href="/login"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
