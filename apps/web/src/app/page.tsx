'use client';

import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Landmark,
  Coins,
  ShieldAlert,
  ArrowRight,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import { KPIStatCard } from '@/components/ui/KPIStatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Link from 'next/link';

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState('TODAY');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Six primary KPIs strictly from PRD Section 3 (Dashboard & UI)
  const primaryKPIs = [
    {
      id: 'GLOBAL_FUND',
      title: 'Global Fund',
      value: '8,500,000',
      currencySymbol: '৳',
      subtitle: 'BDT Equivalent (All Entities)',
      changePercent: 4.8,
      icon: <GlobeIcon />,
      highlight: true,
      route: '/funds',
    },
    {
      id: 'MYR_BALANCE',
      title: 'MYR Balance',
      value: '150,000',
      currencySymbol: 'RM',
      subtitle: 'Malaysia Bank & Cash',
      changePercent: 2.1,
      icon: <Coins className="w-4 h-4" />,
      route: '/funds?currency=MYR',
    },
    {
      id: 'BDT_BALANCE',
      title: 'BDT Balance',
      value: '3,550,000',
      currencySymbol: '৳',
      subtitle: 'Bangladesh Vault & Banks',
      changePercent: 6.4,
      icon: <Landmark className="w-4 h-4" />,
      route: '/funds?currency=BDT',
    },
    {
      id: 'TODAY_PURCHASE',
      title: "Today's Purchase",
      value: '850,000',
      currencySymbol: '৳',
      subtitle: 'Suppliers & Interbank FX',
      changePercent: -1.2,
      icon: <ArrowDownLeft className="w-4 h-4" />,
      route: '/exchange/buy',
    },
    {
      id: 'TODAY_SALES',
      title: "Today's Sales",
      value: '1,250,000',
      currencySymbol: '৳',
      subtitle: 'Wholesale & Retail FX',
      changePercent: 12.5,
      icon: <ArrowUpRight className="w-4 h-4" />,
      route: '/exchange/sell',
    },
    {
      id: 'TODAY_NET_PROFIT',
      title: "Today's Net Profit",
      value: '42,500',
      currencySymbol: '৳',
      subtitle: 'Realized FX & Fees',
      changePercent: 8.9,
      icon: <TrendingUp className="w-4 h-4" />,
      highlight: true,
      route: '/accounting/reports',
    },
  ];

  const currencyHoldings = [
    { currency: 'MYR', name: 'Malaysian Ringgit', quantity: '150,000.00', wacRate: '33.3333 BDT', carryingValue: '5,000,000.00 BDT', marketRate: '35.00 BDT', unrealizedProfit: '+250,000.00 BDT' },
    { currency: 'BDT', name: 'Bangladeshi Taka', quantity: '3,550,000.00', wacRate: '1.0000 BDT', carryingValue: '3,550,000.00 BDT', marketRate: '1.00 BDT', unrealizedProfit: '0.00 BDT' },
    { currency: 'USD', name: 'US Dollar', quantity: '25,000.00', wacRate: '118.5000 BDT', carryingValue: '2,962,500.00 BDT', marketRate: '121.20 BDT', unrealizedProfit: '+67,500.00 BDT' },
    { currency: 'SAR', name: 'Saudi Riyal', quantity: '40,000.00', wacRate: '31.6000 BDT', carryingValue: '1,264,000.00 BDT', marketRate: '32.10 BDT', unrealizedProfit: '+20,000.00 BDT' },
  ];

  const recentTransactions = [
    {
      id: 'REM-202611-001092',
      type: 'Remittance Payout',
      sender: 'Mohammad Faruk Hossain',
      beneficiary: 'Rokeya Begum (Islami Bank BD)',
      sourceAmount: 'RM 2,500.00',
      destinationAmount: '৳ 87,500.00',
      rate: '35.00',
      status: 'processing',
      time: '12 mins ago',
    },
    {
      id: 'PUR-202611-000482',
      type: 'Currency Purchase',
      sender: 'Metro Forex Wholesale Ltd',
      beneficiary: 'Kuala Lumpur Central Vault',
      sourceAmount: 'RM 50,000.00',
      destinationAmount: '৳ 1,650,000.00',
      rate: '33.00',
      status: 'settled',
      time: '45 mins ago',
    },
    {
      id: 'SAL-202611-000882',
      type: 'Currency Sale',
      sender: 'Rahim Trading Corp',
      beneficiary: 'Cash Collection Desk',
      sourceAmount: 'RM 10,000.00',
      destinationAmount: '৳ 350,000.00',
      rate: '35.00',
      status: 'settled',
      time: '1 hour ago',
    },
    {
      id: 'REM-202611-001089',
      type: 'Remittance Collection',
      sender: 'Abdul Mannan',
      beneficiary: 'Amena Khatun (bKash MFS)',
      sourceAmount: 'RM 1,200.00',
      destinationAmount: '৳ 42,000.00',
      rate: '35.00',
      status: 'collected',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Executive Financial Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Centralized multi-entity fund valuation, real-time FX inventory, and cross-border settlement.
          </p>
        </div>

        {/* Filter Toolbar matching PRD */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 text-xs shadow-sm">
            {['TODAY', 'YESTERDAY', '7 DAYS', 'MONTH', 'YEAR'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedFilter(period)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedFilter === period
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveModal('FILTER')}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Branch Filter</span>
          </button>
        </div>
      </div>

      {/* SIX PRIMARY KPIS IN ONE ROW ON DESKTOP - PRD MANDATORY REQUIREMENT */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Executive Financial Positions
          </span>
          <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
            <span>
              Pending Transfers: <strong className="text-blue-600">18</strong>
            </span>
            <span>•</span>
            <span>
              Active Branches / Agents: <strong className="text-emerald-600">6 / 24</strong>
            </span>
          </div>
        </div>

        {/* Grid: 1 col on mobile, 2 col on tablet, 6 columns in one single row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {primaryKPIs.map((kpi) => (
            <KPIStatCard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              currencySymbol={kpi.currencySymbol}
              subtitle={kpi.subtitle}
              changePercent={kpi.changePercent}
              icon={kpi.icon}
              highlight={kpi.highlight}
              onClick={() => {
                window.location.href = kpi.route;
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Operational Split Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time FX Inventory & Holdings */}
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Currency Holdings & Weighted Average Cost (WAC) Position
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inventory valued according to institutional WAC carrying ledger.
                </p>
              </div>
              <Link
                href="/exchange/rates"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View Rate Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Currency</th>
                    <th className="py-2.5 px-3">Holding Quantity</th>
                    <th className="py-2.5 px-3">WAC Cost Basis</th>
                    <th className="py-2.5 px-3">Carrying Valuation</th>
                    <th className="py-2.5 px-3">Market Quote</th>
                    <th className="py-2.5 px-3 text-right">Unrealized Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {currencyHoldings.map((row) => (
                    <tr key={row.currency} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-sans font-bold text-slate-900 flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {row.currency}
                        </span>
                        <span>{row.name}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{row.quantity}</td>
                      <td className="py-3 px-3 text-slate-600">{row.wacRate}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{row.carryingValue}</td>
                      <td className="py-3 px-3 text-slate-600">{row.marketRate}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">
                        {row.unrealizedProfit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Operations Table */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Recent Operational Transactions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live transaction stream across authorized corridors and branches.
                </p>
              </div>
              <Link
                href="/remittance"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Transaction ID</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Parties</th>
                    <th className="py-2.5 px-3">Source Amount</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors font-mono">
                      <td className="py-3 px-3 font-bold text-blue-600">
                        <Link href={`/remittance?id=${tx.id}`} className="hover:underline">
                          {tx.id}
                        </Link>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-700">{tx.type}</td>
                      <td className="py-3 px-3 font-sans">
                        <div className="font-semibold text-slate-900">{tx.sender}</div>
                        <div className="text-[11px] text-slate-500">{tx.beneficiary}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{tx.sourceAmount}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{tx.destinationAmount}</td>
                      <td className="py-3 px-3 font-sans">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-3 px-3 font-sans text-right text-slate-400 text-[11px]">
                        {tx.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Compliance, Sanctions Alerts & Quick Execution */}
        <div className="space-y-6">
          {/* Compliance & AML Watchlist Card */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-5 shadow-sm">
            <div className="flex items-center space-x-2.5 text-rose-700 mb-3">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-sm font-bold tracking-tight">Compliance & Screening Alerts</h2>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Automated sanctions monitoring, high-value transaction thresholds, and document verification holds.
            </p>

            <div className="space-y-3">
              <div className="rounded-lg border border-rose-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-rose-700">Threshold Limit Alert</span>
                  <StatusBadge status="under_review" />
                </div>
                <p className="text-xs text-slate-600">
                  Transaction <strong>REM-1092</strong> exceeds RM 50,000 threshold. Source of funds documentation required before release.
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Kuala Lumpur Branch</span>
                  <Link href="/compliance" className="font-semibold text-rose-600 hover:underline">
                    Review Case →
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-purple-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-purple-700">PEP / Watchlist Check</span>
                  <StatusBadge status="on_hold" />
                </div>
                <p className="text-xs text-slate-600">
                  Beneficiary name matched partial pattern on Central Bank Watchlist. Payout disbursement frozen.
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Dhaka Motijheel HQ</span>
                  <Link href="/compliance" className="font-semibold text-purple-600 hover:underline">
                    Investigate →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Integrity Checklist Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Accounting Ledger Health</h2>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">Trial Balance Equilibrium</span>
                <span className="font-mono font-bold text-emerald-600">BALANCED (0.00)</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">Customer Funds Segregation</span>
                <span className="font-mono font-bold text-emerald-600">100% COMPLIANT</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">Active Accounting Period</span>
                <span className="font-mono font-bold text-blue-600">NOVEMBER 2026</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">Maker-Checker Policy</span>
                <span className="font-mono font-bold text-slate-800">ENFORCED (STRICT)</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/accounting"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Open General Ledger
              </Link>
              <Link
                href="/accounting/trial-balance"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
              >
                Trial Balance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  );
}
