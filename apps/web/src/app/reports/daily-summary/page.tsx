'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  RefreshCw,
  Printer,
  Calendar,
  Coins,
  TrendingUp,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface DailySummaryData {
  date: string;
  isClosed: boolean;
  totalPurchasesBDT: number;
  totalSalesBDT: number;
  grossProfitBDT: number;
  totalExpensesBDT: number;
  netProfitBDT: number;
  totalCashReceiptsBDT: number;
  totalCashDisbursementsBDT: number;
  currencySummaries: Array<{
    currency: string;
    purchasedUnits: number;
    purchasedCostBDT: number;
    soldUnits: number;
    salesProceedsBDT: number;
    realizedProfitBDT: number;
    closingStockUnits: number;
    closingWACRate: number;
  }>;
}

export default function DailySummaryReportPage() {
  const { t, formatNumber } = useI18n();
  const [summaryData, setSummaryData] = useState<DailySummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDailySummary = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.request(`/currency/daily-closing/status?date=${selectedDate}`);
      if (res.success && res.data) {
        const preview = res.data.preview || {};
        setSummaryData({
          date: res.data.date || selectedDate,
          isClosed: res.data.isClosed || false,
          totalPurchasesBDT: preview.totalPurchasesBDT || 0,
          totalSalesBDT: preview.totalSalesBDT || 0,
          grossProfitBDT: preview.grossProfitBDT || 0,
          totalExpensesBDT: preview.totalExpensesBDT || 0,
          netProfitBDT: preview.netProfitBDT || 0,
          totalCashReceiptsBDT: preview.totalSalesBDT || 0,
          totalCashDisbursementsBDT: (preview.totalPurchasesBDT || 0) + (preview.totalExpensesBDT || 0),
          currencySummaries: (preview.currencyStocks || []).map((s: any) => ({
            currency: s.code,
            purchasedUnits: 0,
            purchasedCostBDT: 0,
            soldUnits: 0,
            salesProceedsBDT: 0,
            realizedProfitBDT: 0,
            closingStockUnits: s.expectedQuantity || 0,
            closingWACRate: s.wacRate || 0,
          })),
        });
      }
    } catch (err) {
      console.error('Error fetching daily summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySummary();
  }, [selectedDate]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="দৈনিক ব্যবসায়িক সারসংক্ষেপ (Daily Business Summary Report)"
        description="প্রতিদিনের বৈদেশিক মুদ্রা ক্রয়, বিক্রয়, মোট লাভ, পরিচালন ব্যয় এবং নগদ প্রবাহের পূর্ণাঙ্গ ওয়ান-পেজ অডিট স্ন্যাপশট।"
        actions={
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-300 p-2 outline-none focus:border-blue-500 bg-white"
            />
            <button
              onClick={fetchDailySummary}
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
              <span>প্রিন্ট সামারি</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="আজকের মুদ্রা ক্রয় (Purchases)"
          value={`৳ ${formatNumber(Number(summaryData?.totalPurchasesBDT || 0).toLocaleString())}`}
          subtitle="মুদ্রা ক্রয় ব্যয়"
          icon={Coins}
        />
        <StatCard
          title="আজকের মুদ্রা বিক্রয় (Sales)"
          value={`৳ ${formatNumber(Number(summaryData?.totalSalesBDT || 0).toLocaleString())}`}
          subtitle="বিক্রয় রাজস্ব"
          icon={TrendingUp}
        />
        <StatCard
          title="অর্জিত গ্রস প্রফিট (Gross Profit)"
          value={`৳ ${formatNumber(Number(summaryData?.grossProfitBDT || 0).toLocaleString())}`}
          subtitle="ট্রেডিং স্প্রেড মার্জিন"
          icon={ShieldCheck}
        />
        <StatCard
          title="চূড়ান্ত নিট প্রফিট (Net Profit)"
          value={`৳ ${formatNumber(Number(summaryData?.netProfitBDT || 0).toLocaleString())}`}
          subtitle="ব্যয় কর্তন পরবর্তী লাভ"
          icon={Wallet}
        />
      </div>

      {/* Day Status Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              summaryData?.isClosed ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {summaryData?.isClosed ? <Lock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              তারিখ: {selectedDate} —{' '}
              {summaryData?.isClosed ? 'ব্যবসায়িক হিসাব লক করা হয়েছে (Day Locked)' : 'লেনদেন চলমান (Open)'}
            </h3>
            <p className="text-xs text-slate-500">
              সকল লেনদেন মেকার-চেকার পলিসি ও রিয়েল-টাইম WAC ইনভেন্টরি নীতির অধীনে নথিভুক্ত।
            </p>
          </div>
        </div>
      </div>

      {/* Currency Inventory Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          দিনের সমাপ্তি কারেন্সি স্টক ও মূল্যায়ন (Closing Currency Stock & Valuation)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">কারেন্সি (Currency)</th>
                <th className="p-3">সমাপ্তি মজুদ (Closing Stock)</th>
                <th className="p-3">গড় খরচ WAC (BDT)</th>
                <th className="p-3">মোট মূল্যায়ন (Inventory Value BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {(summaryData?.currencySummaries || []).map((s) => {
                const val = (s.closingStockUnits || 0) * (s.closingWACRate || 0);
                return (
                  <tr key={s.currency} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{s.currency}</td>
                    <td className="p-3 font-bold text-blue-700">
                      {formatNumber(Number(s.closingStockUnits).toLocaleString())} {s.currency}
                    </td>
                    <td className="p-3 text-slate-700">
                      ৳ {formatNumber(Number(s.closingWACRate).toFixed(4))}
                    </td>
                    <td className="p-3 font-bold text-emerald-700">
                      ৳ {formatNumber(Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
