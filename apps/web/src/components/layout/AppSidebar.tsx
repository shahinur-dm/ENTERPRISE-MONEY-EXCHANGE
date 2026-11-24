'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { NAVIGATION_GROUPS } from '@/config/navigation';
import { useI18n } from '@/lib/i18n';

const GROUP_I18N: Record<string, string> = {
  'OVERVIEW': 'nav.overview',
  'FOREIGN EXCHANGE': 'nav.foreignExchange',
  'CROSS-BORDER OPERATIONS': 'nav.crossBorder',
  'TREASURY & ACCOUNTS': 'nav.treasury',
  'FINANCIAL ACCOUNTING': 'nav.accounting',
  'RISK & GOVERNANCE': 'nav.risk',
  'BUSINESS MANAGEMENT': 'nav.business',
  'SYSTEM ADMINISTRATION': 'nav.admin',
};

const ITEM_I18N: Record<string, string> = {
  'Dashboard': 'nav.dashboard',
  'Buy Currency': 'nav.buyCurrency',
  'Sell Currency': 'nav.sellCurrency',
  'Exchange Rates': 'nav.exchangeRates',
  'Purchase History': 'nav.purchaseHistory',
  'Sales History': 'nav.salesHistory',
  'Remittances': 'nav.remittances',
  'Beneficiaries': 'nav.beneficiaries',
  'Customers': 'nav.customers',
  'Agents': 'nav.agents',
  'Fund Management': 'nav.fundManagement',
  'Bank Accounts': 'nav.bankAccounts',
  'Cash Management': 'nav.cashManagement',
  'Internal Transfers': 'nav.internalTransfers',
  'Chart of Accounts': 'nav.chartOfAccounts',
  'Journal Entries': 'nav.journalEntries',
  'General Ledger': 'nav.generalLedger',
  'Trial Balance': 'nav.trialBalance',
  'Profit & Loss': 'nav.profitLoss',
  'Balance Sheet': 'nav.balanceSheet',
  'Compliance & AML': 'nav.complianceAml',
  'KYC Management': 'nav.kycManagement',
  'Approvals': 'nav.approvals',
  'Audit Logs': 'nav.auditLogs',
  'Suppliers': 'nav.suppliers',
  'Employees': 'nav.employees',
  'Payroll': 'nav.payroll',
  'Expenses': 'nav.expenses',
  'Reports': 'nav.reports',
  'User Management': 'nav.userManagement',
  'Roles & Permissions': 'nav.rolesPermissions',
  'Branch Management': 'nav.branchManagement',
  'Organization Settings': 'nav.organizationSettings',
  'System Settings': 'nav.systemSettings',
};

export interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'FOREIGN EXCHANGE': true,
    'CROSS-BORDER OPERATIONS': true,
    'TREASURY & ACCOUNTS': false,
    'FINANCIAL ACCOUNTING': false,
    'RISK & GOVERNANCE': false,
    'BUSINESS MANAGEMENT': false,
    'SYSTEM ADMINISTRATION': false,
  });

  // Load collapsed preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dawat_sidebar_collapsed');
      if (saved !== null) {
        setCollapsed(saved === 'true');
      }
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dawat_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const toggleGroup = (groupName: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroups((prev) => ({ ...prev, [groupName]: true }));
      return;
    }
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const isRouteActive = (href: string, exact?: boolean) => {
    if (exact || href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      aria-label="Desktop Main Navigation"
      className={cn(
        'hidden lg:flex flex-col shrink-0 min-h-screen bg-[#111827] text-white transition-all duration-300 ease-in-out border-r border-slate-800/80 sticky top-0 h-screen select-none z-40',
        collapsed ? 'w-[76px]' : 'w-[260px]',
        className
      )}
    >
      {/* 1. Header with Logo & Collapse Toggle */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
        <Link href="/" className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/25 shrink-0">
            D
          </div>
          {!collapsed && (
            <div className="leading-tight truncate">
              <span className="text-base font-extrabold tracking-tight text-white block">
                DAWAT ERP
              </span>
              <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold font-mono">
                Institutional FX
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar (260px)' : 'Collapse sidebar (76px)'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {NAVIGATION_GROUPS.map((group) => {
          const isOpen = openGroups[group.name] ?? false;
          const isOverview = group.name === 'OVERVIEW';

          return (
            <div key={group.name} className="space-y-1">
              {/* Group Header (Only visible when expanded and not Overview) */}
              {!collapsed && !isOverview && (
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="flex w-full items-center justify-between px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors rounded-lg group"
                >
                  <span className="truncate">{t(GROUP_I18N[group.name] || '', group.name)}</span>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                  )}
                </button>
              )}

              {/* Group Items */}
              {(collapsed || isOverview || isOpen) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isRouteActive(item.href, item.exact);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center rounded-xl text-xs font-semibold transition-all group relative',
                          collapsed
                            ? 'justify-center p-3 text-slate-300 hover:bg-slate-800 hover:text-white'
                            : 'justify-between px-3.5 py-2.5',
                          active
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        )}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <Icon
                            className={cn(
                              'w-4 h-4 shrink-0 transition-colors',
                              active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                            )}
                          />
                          {!collapsed && <span className="truncate">{t(ITEM_I18N[item.label] || '', item.label)}</span>}
                        </div>

                        {!collapsed && item.badge && (
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                              active
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Collapsed Active Indicator Pill */}
                        {collapsed && active && (
                          <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-white" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 3. User Profile Footer */}
      <div className="border-t border-slate-800/80 p-3 shrink-0 bg-slate-950/40">
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 ring-2 ring-blue-500/30">
              AD
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Master Admin</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">admin@moneyexchange.com</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  window.location.href = '/login';
                }
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
