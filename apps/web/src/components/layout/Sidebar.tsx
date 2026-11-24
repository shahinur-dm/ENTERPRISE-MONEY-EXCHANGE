'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Coins,
  Send,
  Users,
  Building,
  Landmark,
  BookOpenCheck,
  ShieldAlert,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Foreign Exchange',
      items: [
        { label: 'Buy Currency', href: '/exchange/buy', icon: ArrowDownToLine },
        { label: 'Sell Currency', href: '/exchange/sell', icon: ArrowUpFromLine },
        { label: 'Exchange Rates', href: '/exchange/rates', icon: Coins },
      ],
    },
    {
      group: 'Cross-Border Operations',
      items: [
        { label: 'Remittances', href: '/remittance', icon: Send },
        { label: 'Beneficiaries', href: '/beneficiaries', icon: Users },
        { label: 'Customers', href: '/customers', icon: Users },
      ],
    },
    {
      group: 'Treasury & Accounts',
      items: [
        { label: 'Fund Management', href: '/funds', icon: Landmark },
        { label: 'Internal Transfers', href: '/transfers', icon: ArrowDownToLine },
      ],
    },
    {
      group: 'Financial Accounting',
      items: [
        { label: 'General Ledger', href: '/accounting', icon: BookOpenCheck },
        { label: 'Trial Balance', href: '/accounting/trial-balance', icon: Scale },
      ],
    },
    {
      group: 'Risk & Governance',
      items: [
        { label: 'Compliance & AML', href: '/compliance', icon: ShieldAlert },
        { label: 'Audit Trail', href: '/audit', icon: Receipt },
      ],
    },
    {
      group: 'Administration',
      items: [
        { label: 'System Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 select-none z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        {!collapsed ? (
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">
                DAWAT ERP
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                Remittance & FX
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            D
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navItems.map((sec, idx) => (
          <div key={idx}>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {sec.group}
              </div>
            )}
            <ul className="space-y-1">
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center rounded-lg px-3 py-2 text-xs font-semibold transition-all group',
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                        collapsed && 'justify-center px-0'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700',
                          !collapsed && 'mr-3'
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Footer Information */}
      <div className="border-t border-slate-200 p-3 text-center text-[10px] text-slate-400">
        {!collapsed ? (
          <div>
            <div className="font-semibold text-slate-500">DAWAT Financial ERP v1.0</div>
            <div>Institutional Banking Grade</div>
          </div>
        ) : (
          <div className="font-mono text-slate-500">v1.0</div>
        )}
      </div>
    </aside>
  );
}
