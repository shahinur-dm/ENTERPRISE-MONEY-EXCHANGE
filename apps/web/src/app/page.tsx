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
  Target,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Clock,
  ChevronDown,
  Info,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Sparkline } from '@/components/ui/Sparkline';
import {
  TransactionTrackerModal,
  SendRemittanceModal,
  QuickConvertModal,
  ForwardHedgingModal,
  RateAlertModal,
  ExportDataModal,
  TrackerItem,
} from '@/components/modals/DashboardModals';
import { useI18n } from '@/lib/i18n';

export default function DashboardPage() {
  const { t, locale } = useI18n();
  // Navigation pill state
  const [activeNavPill, setActiveNavPill] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'CONVERSIONS'>('TRANSACTIONS');
  const [currencyMode, setCurrencyMode] = useState<'FINTECH' | 'CORRIDOR'>('FINTECH');

  // Modals state
  const [trackedItem, setTrackedItem] = useState<TrackerItem | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Top navigation pills matching reference image
  const navPills = [
    { label: 'Dashboard', href: '/' },
    { label: 'Forward dashboard', href: '#forward-dashboard' },
    { label: 'Invoices', href: '/accounting/journals' },
    { label: 'Payments', href: '/remittance' },
    { label: 'Beneficiaries', href: '/beneficiaries' },
    { label: 'Exchange', href: '/exchange/buy' },
    { label: 'Support', href: 'http://localhost:4000/api/docs' },
  ];

  /* -------------------------------------------------------------------------- */
  /* DATASETS: EXACT FINTECH SCREENSHOT DATA vs OPERATIONAL CORRIDOR DATA      */
  /* -------------------------------------------------------------------------- */

  // 1. FINTECH SCREENSHOT DATA (100% Exact match to FinanceFly reference)
  const fintechAccounts = [
    {
      title: 'Euro account',
      tag: 'Main',
      value: '82,948',
      currency: 'EUR',
      changePercent: 1.2,
      changeLabel: 'Total last month',
      variant: 'gradient' as const,
      accentWave: 'none' as const,
    },
    {
      title: 'Pounds account',
      value: '17,626',
      currency: 'GBR',
      changePercent: -1.2,
      changeLabel: 'Total last month',
      variant: 'white' as const,
      accentWave: 'coral' as const,
    },
    {
      title: 'US dollar account',
      value: '0,00',
      currency: 'USD',
      subText: 'Recent activity: 1 Jun 2024',
      variant: 'white' as const,
      accentWave: 'none' as const,
    },
    {
      title: 'Total balance',
      tag: '+ Create account',
      value: '103,685',
      currency: 'EUR',
      variant: 'breakdown' as const,
      breakdown: {
        profitLabel: 'Profit',
        profitPercent: 65,
        pendingLabel: 'Total pending',
        pendingPercent: 22,
        helpedLabel: 'Total helped',
        helpedPercent: 13,
      },
    },
  ];

  const fintechRecentActivity: TrackerItem[] = [
    {
      id: 'Or-08187884478',
      recipient: 'FinComp A',
      recipientSub: 'IBAN: DE89370400440532013000',
      account: 'Euro account',
      status: 'Finalised',
      amount: '35,820.00 EUR',
      dateSent: '9 Dec, 2024',
      rate: '0.83921 EUR/GBR',
      dateCompleted: '2 Dec, 2024',
    },
    {
      id: 'Or-08187884479',
      recipient: 'Vassan Tech',
      recipientSub: 'IBAN: FR763000600001123456789',
      account: 'Euro account',
      status: 'Finalised',
      amount: '14,000.00 EUR',
      dateSent: '28 Nov, 2024',
      rate: '0.83921 EUR/GBR',
      dateCompleted: '1 Dec, 2024',
    },
    {
      id: 'Or-08187884480',
      recipient: 'CapitalGroup',
      recipientSub: 'IBAN: GB29NWBK60161331926819',
      account: 'Euro account',
      status: 'Finalised',
      amount: '17,230.00 EUR',
      dateSent: '18 Nov, 2024',
      rate: '0.83921 EUR/GBR',
      dateCompleted: '12 Nov, 2024',
    },
    {
      id: 'Or-08187884481',
      recipient: 'InnovPlus C',
      recipientSub: 'IBAN: NL91ABNA0417164300',
      account: 'Euro account',
      status: 'Finalised',
      amount: '8,839.00 EUR',
      dateSent: '8 Nov, 2024',
      rate: '0.83921 EUR/GBR',
      dateCompleted: '10 Nov, 2024',
    },
    {
      id: 'Or-08187884482',
      recipient: 'AuxiTeles',
      recipientSub: 'IBAN: IT60X0542811101000000123456',
      account: 'Euro account',
      status: 'Finalised',
      amount: '27,550.00 EUR',
      dateSent: '8 Nov, 2024',
      rate: '0.83921 EUR/GBR',
      dateCompleted: '10 Nov, 2024',
    },
  ];

  const fintechExchangeRates = [
    {
      pair: 'EUR/USD',
      rate: '1,09',
      change: '↑ 1.02%',
      isUp: true,
      subtitle: 'Comparing to last month',
      sparkline: [1.078, 1.081, 1.08, 1.084, 1.083, 1.087, 1.089, 1.091, 1.09],
    },
    {
      pair: 'EUR/GBR',
      rate: '0,839',
      change: '↓ 0.01%',
      isUp: false,
      subtitle: 'Comparing to last month',
      sparkline: [0.846, 0.844, 0.845, 0.842, 0.841, 0.84, 0.839],
    },
    {
      pair: 'EUR/ISG',
      rate: '1,435',
      change: '↑ 1.02%',
      isUp: true,
      subtitle: 'Comparing to last month',
      sparkline: [1.41, 1.415, 1.419, 1.422, 1.428, 1.431, 1.435],
    },
  ];

  // 2. CORRIDOR OPERATIONAL DATA (Malaysia ⇄ Bangladesh)
  const corridorAccounts = [
    {
      title: 'MYR Account (Operating)',
      tag: 'Main',
      value: '150,000',
      currency: 'MYR',
      changePercent: 2.1,
      changeLabel: 'Total last month',
      variant: 'gradient' as const,
      accentWave: 'none' as const,
    },
    {
      title: 'BDT Account (Settlement)',
      value: '3,550,000',
      currency: 'BDT',
      changePercent: 6.4,
      changeLabel: 'Total last month',
      variant: 'white' as const,
      accentWave: 'coral' as const,
    },
    {
      title: 'US Dollar Reserve',
      value: '25,000',
      currency: 'USD',
      subText: 'Recent activity: Today',
      variant: 'white' as const,
      accentWave: 'none' as const,
    },
    {
      title: 'Consolidated Treasury',
      tag: '+ Create account',
      value: '8,500,000',
      currency: 'BDT',
      variant: 'breakdown' as const,
      breakdown: {
        profitLabel: 'Exchange Margin',
        profitPercent: 58,
        pendingLabel: 'Remittance Clearing',
        pendingPercent: 28,
        helpedLabel: 'Settlement Reserve',
        helpedPercent: 14,
      },
    },
  ];

  const corridorRecentActivity: TrackerItem[] = [
    {
      id: 'Or-08187884478',
      recipient: 'Islami Bank Bangladesh',
      recipientSub: 'Beneficiary: Rokeya Begum (AC: 20501180293)',
      account: 'KUL Treasury Vault',
      status: 'Finalised',
      amount: '87,500.00 BDT',
      sourceAmount: '2,500.00 MYR',
      dateSent: '24 Nov, 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: '24 Nov, 2026',
    },
    {
      id: 'Or-08187884479',
      recipient: 'bKash MFS Wallet',
      recipientSub: 'Beneficiary: Amena Khatun (+8801712345678)',
      account: 'KUL Operating Cash',
      status: 'Finalised',
      amount: '42,000.00 BDT',
      sourceAmount: '1,200.00 MYR',
      dateSent: '24 Nov, 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: '24 Nov, 2026',
    },
    {
      id: 'Or-08187884480',
      recipient: 'Dutch-Bangla Bank',
      recipientSub: 'Beneficiary: Shahidul Alam (AC: 1151039842)',
      account: 'Corporate Settlement',
      status: 'Pending',
      amount: '175,000.00 BDT',
      sourceAmount: '5,000.00 MYR',
      dateSent: '24 Nov, 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: 'Pending',
    },
    {
      id: 'Or-08187884481',
      recipient: 'Metro Forex Wholesale',
      recipientSub: 'Supplier FX Purchase (Batch: PO-9842)',
      account: 'Vault Reserve',
      status: 'Finalised',
      amount: '3,300,000.00 BDT',
      sourceAmount: '100,000.00 MYR',
      dateSent: '24 Nov, 2026',
      rate: '33.00 BDT/MYR',
      dateCompleted: '24 Nov, 2026',
    },
    {
      id: 'Or-08187884482',
      recipient: 'Rahim Trading Corp',
      recipientSub: 'Commercial FX Sale (Invoice: FXS-2026-081)',
      account: 'Commercial Account',
      status: 'Finalised',
      amount: '700,000.00 BDT',
      sourceAmount: '20,000.00 MYR',
      dateSent: '24 Nov, 2026',
      rate: '35.00 BDT/MYR',
      dateCompleted: '24 Nov, 2026',
    },
  ];

  const corridorExchangeRates = [
    {
      pair: 'MYR/BDT',
      rate: '35.00',
      change: '↑ 1.20%',
      isUp: true,
      subtitle: 'Comparing to last month',
      sparkline: [33.8, 34.1, 34.3, 34.2, 34.6, 34.8, 35.0],
    },
    {
      pair: 'USD/BDT',
      rate: '121.20',
      change: '↑ 0.85%',
      isUp: true,
      subtitle: 'Comparing to last month',
      sparkline: [118.5, 119.2, 119.8, 120.1, 120.7, 121.2],
    },
    {
      pair: 'EUR/BDT',
      rate: '132.50',
      change: '↓ 0.40%',
      isUp: false,
      subtitle: 'Comparing to last month',
      sparkline: [133.8, 133.5, 133.2, 132.9, 132.5],
    },
  ];

  const currentAccounts = currencyMode === 'FINTECH' ? fintechAccounts : corridorAccounts;
  const currentActivity = currencyMode === 'FINTECH' ? fintechRecentActivity : corridorRecentActivity;
  const currentRates = currencyMode === 'FINTECH' ? fintechExchangeRates : corridorExchangeRates;

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. TOP PILL NAVIGATION BAR & ACTIONS (Matching Reference Image Header) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200/60">
        {/* Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {navPills.map((pill) => {
            const isActive = activeNavPill === pill.label;
            return (
              <button
                key={pill.label}
                onClick={() => {
                  setActiveNavPill(pill.label);
                  if (pill.href.startsWith('/')) {
                    // Navigate if different page
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Quick Action Buttons (15 Convert & + Send from Reference Image) */}
        <div className="flex items-center space-x-2.5">
          {/* View mode toggle switch */}
          <div className="flex items-center rounded-full bg-slate-200/80 p-0.5 text-[11px] font-bold text-slate-600">
            <button
              onClick={() => setCurrencyMode('FINTECH')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currencyMode === 'FINTECH'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
              title="FinanceFly Screenshot EUR/GBP/USD View"
            >
              FinanceFly View
            </button>
            <button
              onClick={() => setCurrencyMode('CORRIDOR')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currencyMode === 'CORRIDOR'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
              title="DAWAT ERP Malaysia-Bangladesh Corridor View"
            >
              MYR/BDT Corridor
            </button>
          </div>

          {/* 15 Convert Button (matching reference image) */}
          <button
            onClick={() => setIsConvertModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95 transition-all"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>15 Convert</span>
          </button>

          {/* + Send Button (matching reference image) */}
          <button
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Send</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. DASHBOARD TITLE & DATE SELECTOR (Matching Reference Image)          */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {t('dashboard.title', 'Dashboard')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t('dashboard.subtitle', "Here's the current statistics for Finance.")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Date Range Selector Pill */}
          <button
            onClick={() => alert('Financial Period Selector: 1 June 2024 - 15 July 2024')}
            className="flex items-center space-x-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-700 font-semibold shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>1 June 2024 — 15 July 2024</span>
          </button>

          {/* Export Data Pill Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('dashboard.exportData', 'Export data')}</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. FOUR ACCOUNT / BALANCE CARDS (Matching Reference Image Row)         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {currentAccounts.map((card, idx) => (
          <StatCard
            key={idx}
            title={card.title}
            tag={card.tag}
            value={card.value}
            currency={card.currency}
            changePercent={card.changePercent}
            changeLabel={card.changeLabel}
            variant={card.variant}
            accentWave={card.accentWave}
            subText={card.subText}
            breakdown={card.breakdown}
            onClick={() => {
              if (card.tag === '+ Create account') {
                alert('Open Multi-Currency Account creation modal');
              }
            }}
          />
        ))}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. RECENT ACTIVITY CARD (Matching Reference Image Table & Filter)     */}
      {/* ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {t('dashboard.recentActivity', 'Recent activity')}
          </h2>

          {/* Toggle pill buttons (Transactions / Conversions) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'TRANSACTIONS'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{t('dashboard.transactions', 'Transactions')}</span>
            </button>
            <button
              onClick={() => setActiveTab('CONVERSIONS')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'CONVERSIONS'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{t('dashboard.conversions', 'Conversions')}</span>
            </button>
          </div>
        </div>

        {/* Activity Table with exact headers from Reference Image */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ⇅</th>
                <th className="py-3 px-4">Recipient ⇅</th>
                <th className="py-3 px-4">Account ⇅</th>
                <th className="py-3 px-4">Status ⇅</th>
                <th className="py-3 px-4">Amount ⇅</th>
                <th className="py-3 px-4">Date sent ⇅</th>
                <th className="py-3 px-4">Exchange rate ⇅</th>
                <th className="py-3 px-4">Date receipt ⇅</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentActivity.map((row, idx) => (
                <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                  {/* Transaction ID with round icon */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center space-x-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-white shrink-0 ${
                        idx % 2 === 0 ? 'bg-indigo-600' : 'bg-teal-500'
                      }`}
                    >
                      {row.id.substring(3, 5)}
                    </div>
                    <span>{row.id}</span>
                  </td>

                  {/* Recipient with external link icon */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center space-x-1">
                      <span>{row.recipient}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                    {row.recipientSub && (
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                        {row.recipientSub}
                      </div>
                    )}
                  </td>

                  {/* Account with arrow icon */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center space-x-1">
                      <span>{row.account}</span>
                      <span className="text-slate-400 text-[10px]">↙</span>
                    </span>
                  </td>

                  {/* Status Pill Badge */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {row.status}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {row.amount}
                  </td>

                  {/* Date sent */}
                  <td className="py-3.5 px-4 text-slate-500">{row.dateSent}</td>

                  {/* Exchange rate */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">{row.rate}</td>

                  {/* Date receipt / completed */}
                  <td className="py-3.5 px-4 text-slate-500">{row.dateCompleted}</td>

                  {/* Actions (Track button) */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setTrackedItem(row)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 text-[11px] font-semibold transition-all active:scale-95 shadow-2xs"
                    >
                      <Target className="w-3 h-3 text-slate-500" />
                      <span>Track</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 5. BOTTOM SECTION: EXCHANGE RATES & MANAGE FX RISK (Reference Image)  */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left 3 Columns: Exchange Rates Sparkline Cards */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Exchange rates</h2>
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center space-x-1 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              <span>+ Create alert</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentRates.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-5 bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold font-mono">
                    <span className="text-slate-400">{ex.pair}</span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="mt-1 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {ex.rate}
                    </span>
                  </div>
                </div>

                {/* Smooth Bezier SVG Sparkline Wave */}
                <div className="h-10 w-full pt-1">
                  <Sparkline data={ex.sparkline} isUp={ex.isUp} height={40} />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full ${
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

        {/* Right 1 Column: Manage FX Risk Advisory Card (Exact match to Reference) */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-50 via-purple-50/30 to-blue-50/50 border border-indigo-100 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background blur mesh */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t('dashboard.manageFxRisk', 'Manage FX risk')}
            </h3>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {t('dashboard.manageFxRiskDesc', 'Protect your business against currency volatility, with a range of forward contracts.')}
            </p>
          </div>

          <div className="mt-6 pt-4 relative z-10">
            <button
              onClick={() => setIsForwardModalOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('dashboard.newForward', 'New forward')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 6. INTERACTIVE MODALS                                                  */}
      {/* ---------------------------------------------------------------------- */}
      <TransactionTrackerModal
        item={trackedItem}
        onClose={() => setTrackedItem(null)}
      />

      <SendRemittanceModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      />

      <QuickConvertModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
      />

      <ForwardHedgingModal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
      />

      <RateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />

      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
