'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Send,
  Users,
  UserCheck,
  Building2,
  Landmark,
  Wallet,
  ArrowRightLeft,
  BookOpenCheck,
  Scale,
  FileSpreadsheet,
  PieChart,
  ShieldAlert,
  FileCheck,
  CheckSquare,
  History,
  Truck,
  UserCog,
  Banknote,
  DollarSign,
  FileBarChart2,
  Lock,
  GitBranch,
  Building,
  Sliders,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sparkles,
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'FOREIGN EXCHANGE': true,
    'CROSS-BORDER OPERATIONS': true,
    'FINANCIAL ACCOUNTING': false,
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const navGroups = [
    {
      name: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      name: 'FOREIGN EXCHANGE',
      items: [
        { label: 'Buy Currency', href: '/exchange/buy', icon: ArrowDownLeft },
        { label: 'Sell Currency', href: '/exchange/sell', icon: ArrowUpRight },
        { label: 'Exchange Rates', href: '/exchange/rates', icon: Coins },
        { label: 'Purchase History', href: '/exchange/purchases', icon: Receipt },
        { label: 'Sales History', href: '/exchange/sales', icon: History },
      ],
    },
    {
      name: 'CROSS-BORDER OPERATIONS',
      items: [
        { label: 'Remittances', href: '/remittance', icon: Send },
        { label: 'Beneficiaries', href: '/beneficiaries', icon: UserCheck },
        { label: 'Customers', href: '/customers', icon: Users },
        { label: 'Agents', href: '/agents', icon: UserCog },
      ],
    },
    {
      name: 'TREASURY & ACCOUNTS',
      items: [
        { label: 'Fund Management', href: '/funds', icon: Landmark },
        { label: 'Bank Accounts', href: '/funds/banks', icon: Building2 },
        { label: 'Cash Management', href: '/funds/cash', icon: Wallet },
        { label: 'Internal Transfers', href: '/transfers', icon: ArrowRightLeft },
      ],
    },
    {
      name: 'FINANCIAL ACCOUNTING',
      items: [
        { label: 'Chart of Accounts', href: '/accounting/coa', icon: BookOpenCheck },
        { label: 'Journal Entries', href: '/accounting/journals', icon: Receipt },
        { label: 'General Ledger', href: '/accounting', icon: BookOpenCheck },
        { label: 'Trial Balance', href: '/accounting/trial-balance', icon: Scale },
        { label: 'Profit & Loss', href: '/accounting/profit-loss', icon: TrendingUp },
        { label: 'Balance Sheet', href: '/accounting/balance-sheet', icon: FileSpreadsheet },
      ],
    },
    {
      name: 'RISK & GOVERNANCE',
      items: [
        { label: 'Compliance & AML', href: '/compliance', icon: ShieldAlert },
        { label: 'KYC Management', href: '/compliance/kyc', icon: FileCheck },
        { label: 'Approvals', href: '/approvals', icon: CheckSquare },
        { label: 'Audit Logs', href: '/audit', icon: History },
      ],
    },
    {
      name: 'BUSINESS MANAGEMENT',
      items: [
        { label: 'Suppliers', href: '/suppliers', icon: Truck },
        { label: 'Employees', href: '/hr/employees', icon: Users },
        { label: 'Payroll', href: '/hr/payroll', icon: Banknote },
        { label: 'Expenses', href: '/expenses', icon: DollarSign },
        { label: 'Reports', href: '/reports', icon: FileBarChart2 },
      ],
    },
    {
      name: 'SYSTEM ADMINISTRATION',
      items: [
        { label: 'User Management', href: '/settings/users', icon: Users },
        { label: 'Roles & Permissions', href: '/settings/roles', icon: Lock },
        { label: 'Branch Management', href: '/settings/branches', icon: GitBranch },
        { label: 'Organization Settings', href: '/settings/organization', icon: Building },
        { label: 'System Settings', href: '/settings', icon: Sliders },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-[#111827] text-slate-300 transition-all duration-300 select-none z-40 border-r border-slate-800 shrink-0 h-screen sticky top-0',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80 bg-[#0F172A]">
        {!collapsed ? (
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/30">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white flex items-center space-x-1.5">
                <span>DAWAT ERP</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">PRO</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                Remittance & FX
              </span>
            </div>
          </Link>
        ) : (
          <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/30">
            D
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.name] ?? false;
          return (
            <div key={group.name} className="space-y-1">
              {!collapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span>{group.name}</span>
                  {group.items.length > 1 && (
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 text-slate-500 transition-transform duration-200',
                        !isOpen && '-rotate-90'
                      )}
                    />
                  )}
                </button>
              ) : (
                <div className="w-6 h-0.5 bg-slate-800 mx-auto my-2" />
              )}

              {/* Items List */}
              {(isOpen || collapsed || group.items.length === 1) && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center rounded-lg px-2.5 py-2 text-xs font-semibold transition-all group relative',
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm font-bold'
                              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100',
                            collapsed && 'justify-center px-0'
                          )}
                          title={collapsed ? item.label : undefined}
                        >
                          <Icon
                            className={cn(
                              'w-4 h-4 shrink-0 transition-colors',
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200',
                              !collapsed && 'mr-3'
                            )}
                          />
                          {!collapsed && <span className="truncate">{item.label}</span>}

                          {/* Active Pill Indicator */}
                          {isActive && !collapsed && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile at Bottom of Sidebar */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0F172A]/80">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                AD
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">Chief Executive</span>
                <span className="text-[10px] text-slate-400 truncate font-mono">Master Admin</span>
              </div>
            </div>
            <Link
              href="/login"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link
              href="/login"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
