'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Lock,
  RefreshCw,
  Coins,
  TrendingUp,
  CreditCard,
  Building2,
  Wallet,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface AccountClosingPreview {
  accountId: string;
  accountNo: string;
  accountName: string;
  expectedBalance: any;
  countedBalance?: string;
  discrepancy?: number;
}

interface CurrencyClosingPreview {
  currency: string;
  expectedQuantity: any;
  weightedAverageCost: any;
  countedQuantity?: string;
  discrepancy?: number;
}

interface ClosingPreviewData {
  closingDate: string;
  isClosed: boolean;
  closingRecord?: any;
  totalPurchasesBDT: any;
  totalSalesBDT: any;
  grossProfitBDT: any;
  totalExpensesBDT: any;
  netProfitBDT: any;
  cashAccounts: AccountClosingPreview[];
  currencyStocks: CurrencyClosingPreview[];
}

export default function DailyClosingPage() {
  const { formatNumber } = useI18n();
  const [data, setData] = useState<ClosingPreviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form input states
  const [countedCash, setCountedCash] = useState<Record<string, string>>({});
  const [countedStocks, setCountedStocks] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.request('/currency/daily-closing/status');
      if (res.success && res.data) {
        setData(res.data);
        // Initialize inputs with expected values
        const cashInit: Record<string, string> = {};
        res.data.cashAccounts?.forEach((a: AccountClosingPreview) => {
          cashInit[a.accountId] = String(getDecVal(a.expectedBalance));
        });
        setCountedCash(cashInit);

        const stockInit: Record<string, string> = {};
        res.data.currencyStocks?.forEach((s: CurrencyClosingPreview) => {
          stockInit[s.currency] = String(getDecVal(s.expectedQuantity));
        });
        setCountedStocks(stockInit);
      }
    } catch (err) {
      console.error('Error fetching daily closing status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const handleExecuteClosing = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cashReconciliation = data?.cashAccounts?.map((a) => {
      const exp = getDecVal(a.expectedBalance);
      const counted = parseFloat(countedCash[a.accountId] || '0');
      return {
        accountId: a.accountId,
        accountName: a.accountName,
        expectedBalance: exp,
        countedBalance: counted,
        discrepancy: counted - exp,
      };
    }) || [];

    const currencyReconciliation = data?.currencyStocks?.map((s) => {
      const exp = getDecVal(s.expectedQuantity);
      const counted = parseFloat(countedStocks[s.currency] || '0');
      return {
        currency: s.currency,
        expectedQuantity: exp,
        countedQuantity: counted,
        discrepancy: counted - exp,
      };
    }) || [];

    setSubmitting(true);
    try {
      const res = await ApiClient.request('/currency/daily-closing', {
        method: 'POST',
        body: JSON.stringify({
          notes,
          cashReconciliation,
          currencyReconciliation,
        }),
      });

      if (res.success) {
        setSuccessMsg('দৈনিক হিসাব সফলভাবে সমাপ্ত ও লক করা হয়েছে।');
        fetchStatus();
      } else {
        setErrorMsg(res.message || 'দৈনিক সমাপ্তি সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPurchases = getDecVal(data?.totalPurchasesBDT);
  const totalSales = getDecVal(data?.totalSalesBDT);
  const grossProfit = getDecVal(data?.grossProfitBDT);
  const totalExpenses = getDecVal(data?.totalExpensesBDT);
  const netProfit = getDecVal(data?.netProfitBDT);

  return (
    <div className="space-y-6">
      <PageHeader
        title="দৈনিক হিসাব সমাপ্তি ও ডে লক (Daily Business Closing & Reconciliation)"
        description="প্রতিদিনের ব্যবসায়িক লেনদেন যাচাই, ক্যাশ ড্রয়ার ও ভল্ট ফিজিক্যাল ক্যাশ কাউন্ট রিকনসিলিয়েশন এবং ডে লক।"
        actions={
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        }
      />

      {data?.isClosed ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-emerald-900">
            <Lock className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-bold text-base">আজকের ব্যবসায়িক হিসাব সফলভাবে সমাপ্ত ও লক করা হয়েছে</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                সমাপ্তির তারিখ:{' '}
                <span className="font-mono font-bold">
                  {data.closingRecord?.closingDate
                    ? new Date(data.closingRecord.closingDate).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </span>
                {' | '}ভাউচার: <span className="font-mono font-bold">{data.closingRecord?.closingNo}</span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs">
            DAY LOCKED (লকড)
          </span>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-blue-900">
            <CalendarCheck className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <h4 className="font-bold text-xs">আজকের ব্যবসায়িক দিন খোলা রয়েছে (Active Business Day)</h4>
              <p className="text-[11px] text-blue-700">
                দিন শেষে সমস্ত কাউন্টার ও ভল্ট ক্যাশ গণনা করে নিচে ফর্মটি পূরণ করে ডে লক করুন।
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">
            OPEN (খোলা)
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Stats of the Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="আজকের মুদ্রা ক্রয় (BDT)"
          value={`৳ ${formatNumber(totalPurchases.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="মোট ক্রয় খরচ"
          icon={Coins}
        />
        <StatCard
          title="আজকের মুদ্রা বিক্রয় (BDT)"
          value={`৳ ${formatNumber(totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="মোট বিক্রয় আয়"
          icon={Coins}
        />
        <StatCard
          title="গ্রস ট্রেডিং লাভ (Gross Profit)"
          value={`৳ ${formatNumber(grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="বিক্রয় আয় - WAC খরচ"
          icon={TrendingUp}
        />
        <StatCard
          title="আজকের পরিচালন ব্যয় (Expenses)"
          value={`৳ ${formatNumber(totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="মোট অফিস ও অন্যান্য খরচ"
          icon={CreditCard}
        />
        <StatCard
          title="নিট ব্যবসায়িক লাভ (Net Profit)"
          value={`৳ ${formatNumber(netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="গ্রস লাভ - পরিচালন ব্যয়"
          icon={Calculator}
        />
      </div>

      {!data?.isClosed && (
        <form onSubmit={handleExecuteClosing} className="space-y-6">
          {/* Section 1: Cash Drawer & Bank Reconciliation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>১. ক্যাশ ড্রয়ার ও ব্যাংক অ্যাকাউন্ট গণনা (Cash & Bank Reconciliation)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                    <th className="pb-2">অ্যাকাউন্টের নাম</th>
                    <th className="pb-2">সিস্টেম প্রত্যাশিত স্থিতি (Expected BDT)</th>
                    <th className="pb-2">প্রকৃত গণনাকৃত ক্যাশ (Counted BDT) *</th>
                    <th className="pb-2">পার্থক্য / ঘাটতি (Discrepancy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.cashAccounts?.map((acc) => {
                    const exp = getDecVal(acc.expectedBalance);
                    const counted = parseFloat(countedCash[acc.accountId] || '0');
                    const diff = counted - exp;
                    return (
                      <tr key={acc.accountId} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-bold text-slate-900">{acc.accountName}</td>
                        <td className="py-2.5 font-mono text-slate-700">
                          ৳ {formatNumber(exp.toLocaleString(undefined, { minimumFractionDigits: 2 }))}
                        </td>
                        <td className="py-2.5">
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={countedCash[acc.accountId] ?? ''}
                            onChange={(e) =>
                              setCountedCash((prev) => ({
                                ...prev,
                                [acc.accountId]: e.target.value,
                              }))
                            }
                            className="w-44 rounded-xl border border-slate-300 p-2 font-mono font-bold text-xs outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2.5 font-mono">
                          {diff === 0 ? (
                            <span className="text-emerald-600 font-bold">✓ হুবহু মিলেছে (৳0.00)</span>
                          ) : diff > 0 ? (
                            <span className="text-blue-600 font-bold">
                              +৳ {formatNumber(diff.toLocaleString(undefined, { minimumFractionDigits: 2 }))} (অতিরিক্ত)
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold">
                              -৳ {formatNumber(Math.abs(diff).toLocaleString(undefined, { minimumFractionDigits: 2 }))} (ঘাটতি/Shortage)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Physical Foreign Currency Notes Count */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Coins className="w-4 h-4 text-blue-600" />
              <span>২. ফিজিক্যাল বৈদেশিক মুদ্রা নোট গণনা (Physical Currency Stock Count)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                    <th className="pb-2">কারেন্সি কোড</th>
                    <th className="pb-2">বর্তমান গড় ক্রয়মূল্য (WAC)</th>
                    <th className="pb-2">সিস্টেম প্রত্যাশিত মজুদ (Expected Stock)</th>
                    <th className="pb-2">ভল্ট গণনাকৃত নোটের পরিমাণ (Counted Notes) *</th>
                    <th className="pb-2">মজুদ পার্থক্য (Discrepancy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.currencyStocks?.map((stk) => {
                    const exp = getDecVal(stk.expectedQuantity);
                    const wac = getDecVal(stk.weightedAverageCost);
                    const counted = parseFloat(countedStocks[stk.currency] || '0');
                    const diff = counted - exp;
                    return (
                      <tr key={stk.currency} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-bold text-slate-900 font-mono">{stk.currency}</td>
                        <td className="py-2.5 font-mono text-slate-700">৳ {formatNumber(wac.toFixed(4))}</td>
                        <td className="py-2.5 font-mono font-bold text-slate-900">
                          {formatNumber(exp.toLocaleString())} {stk.currency}
                        </td>
                        <td className="py-2.5">
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={countedStocks[stk.currency] ?? ''}
                            onChange={(e) =>
                              setCountedStocks((prev) => ({
                                ...prev,
                                [stk.currency]: e.target.value,
                              }))
                            }
                            className="w-44 rounded-xl border border-slate-300 p-2 font-mono font-bold text-xs outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2.5 font-mono">
                          {diff === 0 ? (
                            <span className="text-emerald-600 font-bold">✓ মজুদ মিলেছে</span>
                          ) : (
                            <span className={diff > 0 ? 'text-blue-600 font-bold' : 'text-rose-600 font-bold'}>
                              {diff > 0 ? '+' : ''}
                              {formatNumber(diff.toLocaleString())} {stk.currency}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Notes & Confirm Button */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                সমাপ্তি পর্যবেক্ষণ ও পার্থক্যের কারণ (Closing Observations / Discrepancy Reason)
              </label>
              <textarea
                rows={3}
                placeholder="কোনো ঘাটতি বা অতিরিক্ত ক্যাশ থাকলে তার কারণ বা দিনের বিশেষ নোট লিখুন..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                সতর্কতা: দৈনিক সমাপ্তির পর আজকের লেনদেন আর পরিবর্তন বা ডিলিট করা যাবে না।
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-lg shadow-slate-900/20 active:scale-[0.99] transition-all flex items-center space-x-2"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>{submitting ? 'লক প্রক্রিয়াধীন...' : 'দৈনিক সমাপ্তি ও ডে লক সম্পন্ন করুন (Lock Day)'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
