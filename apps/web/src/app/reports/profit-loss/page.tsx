'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  RefreshCw,
  Printer,
  Calendar,
  Coins,
  CreditCard,
  Building2,
  PieChart,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface ProfitLossData {
  tradingRevenueBDT: number;
  costOfGoodsSoldBDT: number;
  grossTradingProfitBDT: number;
  operatingExpensesBDT: number;
  netOperatingProfitBDT: number;
  expensesByCategory: Array<{
    category: string;
    totalBDT: number;
  }>;
  currencyBreakdown: Array<{
    currency: string;
    grossProceeds: number;
    costBasis: number;
    realizedProfit: number;
  }>;
}

export default function ProfitLossReportPage() {
  const { t, formatNumber } = useI18n();
  const [reportData, setReportData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('MONTH');

  const fetchProfitLoss = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.request(`/currency/reports/profit-loss?range=${dateRange}`);
      if (res.success && res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Error fetching P&L report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitLoss();
  }, [dateRange]);

  const rev = reportData?.tradingRevenueBDT || 0;
  const cogs = reportData?.costOfGoodsSoldBDT || 0;
  const grossProfit = reportData?.grossTradingProfitBDT || 0;
  const expenses = reportData?.operatingExpensesBDT || 0;
  const netProfit = reportData?.netOperatingProfitBDT || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="লাভ ও ক্ষতি বিবরণী (Profit & Loss Statement)"
        description="বৈদেশিক মুদ্রা ট্রেডিং আয়, WAC ভিত্তিক বিক্রিত পণ্যের ব্যয় (COGS), মোট বাণিজ্যিক লাভ এবং পরিচালন ব্যয় বাদে নিট লাভ।"
        actions={
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-300 p-2 outline-none focus:border-blue-500 bg-white"
            >
              <option value="TODAY">আজকের (Today)</option>
              <option value="WEEK">চলতি সপ্তাহ (This Week)</option>
              <option value="MONTH">চলতি মাস (This Month)</option>
              <option value="ALL">সর্বমোট (All Time)</option>
            </select>
            <button
              onClick={fetchProfitLoss}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>প্রিন্ট রিপোর্ট</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="মুদ্রা বিক্রয় রাজস্ব (Gross Revenue)"
          value={`৳ ${formatNumber(rev.toLocaleString())}`}
          subtitle="গ্রাহক ও ডিলারদের কাছে বিক্রয়"
          icon={Coins}
        />
        <StatCard
          title="বিক্রিত পণ্যের ব্যয় (COGS)"
          value={`৳ ${formatNumber(cogs.toLocaleString())}`}
          subtitle="WAC ক্রয়মূল্যের ভিত্তিতে ব্যয়"
          icon={PieChart}
        />
        <StatCard
          title="গ্রস ট্রেডিং মার্জিন (Gross Margin)"
          value={`৳ ${formatNumber(grossProfit.toLocaleString())}`}
          subtitle="ট্রেডিং থেকে মোট অর্জিত লাভ"
          icon={TrendingUp}
        />
        <StatCard
          title="নিট ব্যবসায়িক লাভ (Net Profit)"
          value={`৳ ${formatNumber(netProfit.toLocaleString())}`}
          subtitle="সকল পরিচালন ব্যয় বাদে মুনাফা"
          icon={Building2}
        />
      </div>

      {/* Formal P&L Statement Structure */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          আর্থিক কর্মক্ষমতা সারাংশ (Financial Performance Statement)
        </h3>

        <div className="space-y-4 text-sm font-mono">
          {/* Revenue Section */}
          <div className="border-b border-slate-100 pb-3">
            <div className="flex justify-between items-center text-slate-900 font-bold">
              <span>১. বৈদেশিক মুদ্রা বিক্রয় থেকে অর্জিত রাজস্ব (Gross Sales Proceeds)</span>
              <span>৳ {formatNumber(rev.toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-xs mt-1 pl-4">
              <span>বাদ: বিক্রিত বৈদেশিক মুদ্রার ক্রয় খরচ (COGS on WAC basis)</span>
              <span className="text-rose-600">
                (৳ {formatNumber(cogs.toLocaleString(undefined, { minimumFractionDigits: 2 }))})
              </span>
            </div>
          </div>

          {/* Gross Profit Section */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 flex justify-between items-center font-bold text-emerald-900">
            <span className="font-sans text-xs uppercase tracking-wider">
              মোট বৈদেশিক মুদ্রা ট্রেডিং লাভ (Gross Trading Profit)
            </span>
            <span className="text-base">
              ৳ {formatNumber(grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
            </span>
          </div>

          {/* Operating Expenses Section */}
          <div className="border-b border-slate-100 pb-3 pt-2">
            <div className="flex justify-between items-center text-slate-900 font-bold">
              <span>২. ব্যবসায়িক পরিচালন ব্যয়সমূহ (Operating Overhead Expenses)</span>
              <span className="text-rose-600">
                (৳ {formatNumber(expenses.toLocaleString(undefined, { minimumFractionDigits: 2 }))})
              </span>
            </div>

            <div className="space-y-1.5 mt-2 pl-4 text-xs text-slate-600">
              {(reportData?.expensesByCategory || []).map((exp) => (
                <div key={exp.category} className="flex justify-between items-center">
                  <span>{exp.category}:</span>
                  <span>৳ {formatNumber(exp.totalBDT.toLocaleString())}</span>
                </div>
              ))}
              {(!reportData?.expensesByCategory || reportData.expensesByCategory.length === 0) && (
                <div className="text-slate-400 italic">এই সময়ের মধ্যে কোনো পরিচালন ব্যয় নথিভুক্ত নেই।</div>
              )}
            </div>
          </div>

          {/* Net Profit Section */}
          <div
            className={`p-4 rounded-xl border flex justify-between items-center font-bold text-base ${
              netProfit >= 0
                ? 'bg-slate-900 text-emerald-400 border-slate-800'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span className="font-sans text-xs uppercase tracking-wider">
              চূড়ান্ত নিট পরিচালন লাভ / (ক্ষতি) [Net Profit / (Loss)]
            </span>
            <span>৳ {formatNumber(netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT</span>
          </div>
        </div>
      </div>

      {/* Currency-wise margin breakdown */}
      {reportData?.currencyBreakdown && reportData.currencyBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            মুদ্রাভিত্তিক অর্জিত লাভের বিভাজন (Profit by Currency)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.currencyBreakdown.map((item) => (
              <div key={item.currency} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs">{item.currency}</span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      item.realizedProfit >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    +৳ {formatNumber(item.realizedProfit.toLocaleString())}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex justify-between pt-1">
                  <span>বিক্রয় আয়:</span>
                  <span>৳ {formatNumber(item.grossProceeds.toLocaleString())}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex justify-between">
                  <span>ক্রয় খরচ (COGS):</span>
                  <span>৳ {formatNumber(item.costBasis.toLocaleString())}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
