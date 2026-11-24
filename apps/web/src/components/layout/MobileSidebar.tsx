'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, ChevronRight, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
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

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'FOREIGN EXCHANGE': true,
    'CROSS-BORDER OPERATIONS': true,
    'TREASURY & ACCOUNTS': false,
    'FINANCIAL ACCOUNTING': false,
    'RISK & GOVERNANCE': false,
    'BUSINESS MANAGEMENT': false,
    'SYSTEM ADMINISTRATION': false,
  });

  // Close when pathname changes (user navigated to a new page)
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleGroup = (groupName: string) => {
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
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[320px] max-w-[85vw] bg-[#111827] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5 shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/30">
              D
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">DAWAT ERP</span>
              <span className="block text-[9px] uppercase tracking-widest text-blue-400 font-semibold font-mono">
                Institutional FX
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
          {NAVIGATION_GROUPS.map((group) => {
            const isOpen = openGroups[group.name] ?? false;
            const isOverview = group.name === 'OVERVIEW';

            return (
              <div key={group.name} className="space-y-1">
                {!isOverview && (
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="flex w-full items-center justify-between px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors rounded-lg"
                  >
                    <span>{t(GROUP_I18N[group.name] || '', group.name)}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                )}

                {(isOverview || isOpen) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isRouteActive(item.href, item.exact);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                active ? 'text-white' : 'text-slate-400'
                              }`}
                            />
                            <span className="truncate">{t(ITEM_I18N[item.label] || '', item.label)}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                              }`}
                            >
                              {item.badge}
                            </span>
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

        {/* User Profile Footer */}
        <div className="border-t border-slate-800 p-4 shrink-0 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs ring-2 ring-blue-400/40">
                AD
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Master Admin</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">admin@moneyexchange.com</div>
              </div>
            </div>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  window.location.href = '/login';
                }
              }}
              title="Sign Out"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
