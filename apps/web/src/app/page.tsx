'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Coins,
  Send,
  Calendar,
  Download,
  Plus,
  ExternalLink,
  MapPin,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Search,
  Filter,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'CONVERSIONS'>('TRANSACTIONS');

  // Primary Top Balances inspired directly by reference image (FinanceFly layout)
  const topAccounts = [
    {
      title: 'MYR Account (Operating)',
      tag: 'Main',
      value: '150,000',
      currency: 'MYR',
      changePercent: 2.1,
      changeLabel: 'Total last month',
      variant: 'gradient' as const,
      route: '/funds?currency=MYR',
    },
    {
      title: 'BDT Account (Settlement)',
      value: '3,550,000',
      currency: 'BDT',
      changePercent: 6.4,
      changeLabel: 'Total last month',
      variant: 'white' as const,
      route: '/funds?currency=BDT',
    },
    {
      title: 'US Dollar Reserve',
      value: '25,000',
      currency: 'USD',
      changePercent: 1.5,
      changeLabel: 'Recent activity: Today',
      variant: 'white' as const,
      route: '/funds?currency=USD',
    },
    {
      title: 'Total Consolidated Balance',
      tag: '+ Create account',
      value: '8,500,000',
      currency: 'BDT',
      variant: 'breakdown' as const,
      route: '/funds',
    },
  ];

  // Secondary Institutional KPIs (Purchase, Sales, Profit, Pending)
  const operationalKPIs = [
    {
      title: "Today's Currency Purchase",
      value: '850,000',
      currency: 'BDT',
      changePercent: -1.2,
      changeLabel: 'Wholesale suppliers',
      route: '/exchange/buy',
    },
    {
      title: "Today's Currency Sales",
      value: '1,250,000',
      currency: 'BDT',
      changePercent: 12.5,
      changeLabel: 'Corporate & Retail FX',
      route: '/exchange/sell',
    },
    {
      title: "Today's Net Profit",
      value: '42,500',
      currency: 'BDT',
      changePercent: 8.9,
      changeLabel: 'Realized FX & service fees',
      route: '/accounting/profit-loss',
    },
    {
      title: 'Pending Remittance Payouts',
      value: '18',
      currency: 'Orders',
      changePercent: -5.0,
      changeLabel: 'Awaiting destination agent',
      route: '/remittance?status=pending',
    },
  ];

  // Recent Transactions matching reference image table columns
  const recentActivity = [
    {
      id: 'Or-08187884478',
      recipient: 'Islami Bank Bangladesh',
      recipientSub: 'Beneficiary: Rokeya Begum',
      account: 'Bank Account',
      status: 'finalized',
      amount: '87,500.00 BDT',
      sourceAmount: '2,500.00 MYR',
      dateSent: '24 Nov 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: '24 Nov 2026',
    },
    {
      id: 'Or-08187884479',
      recipient: 'bKash MFS Wallet',
      recipientSub: 'Beneficiary: Amena Khatun',
      account: 'Authorized MFS',
      status: 'finalized',
      amount: '42,000.00 BDT',
      sourceAmount: '1,200.00 MYR',
      dateSent: '24 Nov 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: '24 Nov 2026',
    },
    {
      id: 'Or-08187884480',
      recipient: 'Dutch-Bangla Bank',
      recipientSub: 'Beneficiary: Shahidul Alam',
      account: 'Bank Account',
      status: 'processing',
      amount: '175,000.00 BDT',
      sourceAmount: '5,000.00 MYR',
      dateSent: '24 Nov 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: 'Pending',
    },
    {
      id: 'Or-08187884481',
      recipient: 'Metro Forex Wholesale',
      recipientSub: 'Supplier Purchase FX',
      account: 'Corporate Treasury',
      status: 'finalized',
      amount: '3,300,000.00 BDT',
      sourceAmount: '100,000.00 MYR',
      dateSent: '24 Nov 2026',
      rate: '33.00 BDT/MYR',
      dateCompleted: '24 Nov 2026',
    },
    {
      id: 'Or-08187884482',
      recipient: 'Rahim Trading Corp',
      recipientSub: 'Wholesale FX Sale',
      account: 'Commercial Account',
      status: 'finalized',
      amount: '700,000.00 BDT',
      sourceAmount: '20,000.00 MYR',
      dateSent: '24 Nov 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: '24 Nov 2026',
    },
  ];

  // Live Exchange Rates Sparkline cards (Reference image bottom section)
  const exchangeRates = [
    { pair: 'MYR/BDT', rate: '35.00', change: '+1.20%', isUp: true, subtitle: 'Comparing to last month' },
    { pair: 'USD/BDT', rate: '121.20', change: '+0.85%', isUp: true, subtitle: 'Comparing to last month' },
    { pair: 'EUR/BDT', rate: '132.50', change: '-0.40%', isUp: false, subtitle: 'Comparing to last month' },
  ];

  return (
    <div className="space-y-7">
      {/* Top Welcome Heading & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Good morning, Admin
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Verified Corridor
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Here is your financial overview across Malaysia and Bangladesh legal entities.
          </p>
        </div>

        {/* Action Buttons & Date Range Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector Pill */}
          <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>1 Nov 2026 — 24 Nov 2026</span>
          </div>

          {/* Export Data */}
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Data</span>
          </button>

          {/* New Exchange Button */}
          <Link
            href="/exchange/buy"
            className="flex items-center space-x-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs active:scale-95 transition-all"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>New Exchange</span>
          </Link>

          {/* New Remittance Primary CTA */}
          <Link
            href="/remittance"
            className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Remittance</span>
          </Link>
        </div>
      </div>

      {/* TOP BALANCES GRID (Fintech 4-Card Row matching reference image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {topAccounts.map((card, idx) => (
          <StatCard
            key={idx}
            title={card.title}
            tag={card.tag}
            value={card.value}
            currency={card.currency}
            changePercent={card.changePercent}
            changeLabel={card.changeLabel}
            variant={card.variant}
            onClick={() => {
              window.location.href = card.route;
            }}
          />
        ))}
      </div>

      {/* SECONDARY OPERATIONAL KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {operationalKPIs.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            currency={kpi.currency}
            changePercent={kpi.changePercent}
            changeLabel={kpi.changeLabel}
            variant="white"
            onClick={() => {
              window.location.href = kpi.route;
            }}
          />
        ))}
      </div>

      {/* RECENT ACTIVITY SECTION (Matching Reference Image Table & Filter Pills) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live settlement log for currency transactions and cross-border remittance orders.
            </p>
          </div>

          {/* Filter Pills matching reference image */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'TRANSACTIONS'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transactions</span>
            </button>
            <button
              onClick={() => setActiveTab('CONVERSIONS')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'CONVERSIONS'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Conversions</span>
            </button>
          </div>
        </div>

        {/* Activity Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date sent</th>
                <th className="py-3 px-4">Exchange rate</th>
                <th className="py-3 px-4">Date completed</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {recentActivity.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                      TX
                    </div>
                    <span>{row.id}</span>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-slate-900 flex items-center space-x-1">
                      <span>{row.recipient}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{row.recipientSub}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-600">{row.account}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.amount}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-500">{row.dateSent}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.rate}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-500">{row.dateCompleted}</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => alert(`Tracking transaction: ${row.id}`)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 text-[11px] font-semibold transition-all"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Tracker</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM SECTION: Live Exchange Rate Cards & Manage FX Risk Widget (matching reference image) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Exchange Rate Sparkline Cards */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Exchange rates</h2>
            <button
              onClick={() => alert('Rate Alert Subscription Modal')}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              <span>Create alert</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {exchangeRates.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-5 bg-white border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold font-mono">
                  <span>{ex.pair}</span>
                  <Coins className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">{ex.rate}</span>
                </div>
                {/* Micro visual sparkline bar */}
                <div className="h-6 w-full flex items-end space-x-1 pt-1">
                  {[40, 55, 45, 60, 75, 65, 80, 95].map((h, i) => (
                    <div
                      key={i}
                      className={`w-full rounded-xs transition-all ${
                        ex.isUp ? 'bg-emerald-400/60' : 'bg-rose-400/60'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                      ex.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                    }`}
                  >
                    {ex.change}
                  </span>
                  <span className="text-slate-400 truncate">{ex.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Manage FX Risk Advisory Card (matching reference image) */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/60 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-700 mb-2 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Treasury & Hedging</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Manage FX risk
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Protect your business against cross-border currency volatility with a suite of locking forward contracts and spot rate freezes.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-200/50">
            <button
              onClick={() => alert('Forward FX Hedge Quote modal opened')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New forward contract</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Legal & Demo Watermark */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white/60 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
        <span>
          <strong>DAWAT ERP v1.0 Enterprise Edition</strong> • Operating under Bank Negara Malaysia & Bangladesh Bank regulatory framework.
        </span>
      </div>
    </div>
  );
}
