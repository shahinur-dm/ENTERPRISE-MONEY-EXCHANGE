'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  TrendingUp,
  RotateCcw,
  RefreshCw,
  Plus,
  Coins,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface SaleTransaction {
  _id: string;
  saleNo: string;
  customerName: string;
  soldCurrency: string;
  quantity: any;
  sellingRate: any;
  grossProceedsBDT: any;
  costBasisBDT: any;
  realizedFxGainBDT: any;
  receivedAmountBDT: any;
  dueAmountBDT: any;
  isReversed: boolean;
  reversalReason?: string;
  createdAt: string;
}

export default function SalesHistoryPage() {
  const { formatNumber } = useI18n();
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCurrency, setFilterCurrency] = useState('ALL');

  // Reversal Modal
  const [reversalTarget, setReversalTarget] = useState<SaleTransaction | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [reversing, setReversing] = useState(false);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const query = filterCurrency !== 'ALL' ? `?currency=${filterCurrency}` : '';
      const res = await ApiClient.request(`/currency/sales${query}`);
      if (res.success && Array.isArray(res.data)) {
        setSales(res.data);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [filterCurrency]);

  const handleReverse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalTarget) return;

    try {
      setReversing(true);
      const res = await ApiClient.request(`/currency/sale/${reversalTarget._id}/reverse`, {
        method: 'POST',
        body: JSON.stringify({ reason: reversalReason }),
      });

      if (res.success) {
        alert('মুদ্রা বিক্রয় ট্রানজেকশন সফলভাবে রিভার্স/বাতিল করা হয়েছে। ইনভেন্টরি ও তহবিল পুনরুদ্ধার করা হয়েছে।');
        setReversalTarget(null);
        setReversalReason('');
        fetchSales();
      } else {
        alert(res.message || 'রিভার্স প্রক্রিয়া সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      alert(err.message || 'Error executing reversal');
    } finally {
      setReversing(false);
    }
  };

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const totalGrossBDT = sales
    .filter((s) => !s.isReversed)
    .reduce((sum, s) => sum + getDecVal(s.grossProceedsBDT), 0);

  const totalProfitBDT = sales
    .filter((s) => !s.isReversed)
    .reduce((sum, s) => sum + getDecVal(s.realizedFxGainBDT), 0);

  const totalReceivedBDT = sales
    .filter((s) => !s.isReversed)
    .reduce((sum, s) => sum + getDecVal(s.receivedAmountBDT), 0);

  const totalDueBDT = sales
    .filter((s) => !s.isReversed)
    .reduce((sum, s) => sum + getDecVal(s.dueAmountBDT), 0);

  const columns: Column<SaleTransaction>[] = [
    {
      header: 'Sale No / ইনভয়েস',
      accessorKey: 'saleNo',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{item.saleNo}</span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer / ক্রেতা',
      accessorKey: 'customerName',
      cell: (item) => <span className="font-semibold text-slate-800 text-xs">{item.customerName}</span>,
    },
    {
      header: 'Sold / কারেন্সি',
      accessorKey: 'soldCurrency',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {formatNumber(getDecVal(item.quantity).toLocaleString())} {item.soldCurrency}
        </span>
      ),
    },
    {
      header: 'Sell Rate / দর (BDT)',
      accessorKey: 'sellingRate',
      cell: (item) => (
        <span className="font-mono font-bold text-blue-700 text-xs">
          ৳ {formatNumber(getDecVal(item.sellingRate).toFixed(4))}
        </span>
      ),
    },
    {
      header: 'Gross Proceeds / মোট বিক্রয়',
      accessorKey: 'grossProceedsBDT',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          ৳ {formatNumber(getDecVal(item.grossProceedsBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))}
        </span>
      ),
    },
    {
      header: 'Realized Margin / অর্জিত লাভ',
      accessorKey: 'realizedFxGainBDT',
      cell: (item) => {
        const p = getDecVal(item.realizedFxGainBDT);
        return (
          <span className={`font-mono text-xs font-bold ${p >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {p >= 0 ? '+' : ''}৳ {formatNumber(p.toLocaleString(undefined, { minimumFractionDigits: 2 }))}
          </span>
        );
      },
    },
    {
      header: 'Received / প্রাপ্তি',
      accessorKey: 'receivedAmountBDT',
      cell: (item) => (
        <span className="font-mono text-slate-700 text-xs">
          ৳ {formatNumber(getDecVal(item.receivedAmountBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))}
        </span>
      ),
    },
    {
      header: 'Due / বাকি',
      accessorKey: 'dueAmountBDT',
      cell: (item) => {
        const due = getDecVal(item.dueAmountBDT);
        return (
          <span className={`font-mono text-xs font-semibold ${due > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            ৳ {formatNumber(due.toLocaleString(undefined, { minimumFractionDigits: 2 }))}
          </span>
        );
      },
    },
    {
      header: 'Status / স্থিতি',
      accessorKey: 'isReversed',
      cell: (item) =>
        item.isReversed ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
            বাতিলকৃত (Reversed)
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            সম্পন্ন (Active)
          </span>
        ),
    },
    {
      header: 'Actions / পদক্ষেপ',
      accessorKey: '_id',
      cell: (item) => (
        <div>
          {!item.isReversed && (
            <button
              onClick={() => {
                setReversalTarget(item);
                setReversalReason('');
              }}
              title="ভাউচার বাতিল ও রিভার্স করুন"
              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>রিভার্স</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="বৈদেশিক মুদ্রা বিক্রয় হিস্ট্রি (Currency Sales History)"
        description="সকল পাইকারি ডিলার ও কাউন্টার বৈদেশিক মুদ্রা বিক্রয়ের বিবরণী, গ্রস মার্জিন লাভ-ক্ষতি ও রিভার্সাল।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchSales}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <Link
              href="/exchange/sell"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন মুদ্রা বিক্রয়</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="মোট বিক্রয় ভাউচার"
          value={formatNumber(sales.length)}
          subtitle="সর্বমোট বিক্রয় এন্ট্রি"
          icon={History}
        />
        <StatCard
          title="মোট বিক্রয় মূল্য (BDT)"
          value={`৳ ${formatNumber(totalGrossBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="গ্রস ট্রানজেকশন ভলিউম"
          icon={Coins}
        />
        <StatCard
          title="মোট অর্জিত লাভ (Realized FX)"
          value={`৳ ${formatNumber(totalProfitBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="ট্রেডিং গ্রস প্রফিট মার্জিন"
          icon={TrendingUp}
        />
        <StatCard
          title="গ্রাহকদের দেনা (Receivable Due)"
          value={`৳ ${formatNumber(totalDueBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="বকেয়া প্রাপ্য টাকা"
          icon={AlertTriangle}
        />
      </div>

      <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-600">কারেন্সি ফিল্টার:</span>
        <select
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
          className="text-xs font-semibold rounded-lg border border-slate-300 p-2 outline-none focus:border-blue-500 bg-white"
        >
          <option value="ALL">সকল কারেন্সি (All Currencies)</option>
          <option value="MYR">🇲🇾 MYR</option>
          <option value="USD">🇺🇸 USD</option>
          <option value="SAR">🇸🇦 SAR</option>
          <option value="SGD">🇸🇬 SGD</option>
          <option value="EUR">🇪🇺 EUR</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={sales}
        loading={loading}
        emptyMessage="কোনো মুদ্রা বিক্রয় রেকর্ড পাওয়া যায়নি।"
      />

      {/* Reversal Confirmation Modal */}
      {reversalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-2 text-rose-600">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">বিক্রয় ভাউচার রিভার্স ও বাতিল</h3>
            </div>
            <p className="text-xs text-slate-600">
              আপনি কি নিশ্চিতভাবে বিক্রয় ইনভয়েস <strong>{reversalTarget.saleNo}</strong> বাতিল করতে চান? এর ফলে{' '}
              <strong>
                {getDecVal(reversalTarget.quantity)} {reversalTarget.soldCurrency}
              </strong>{' '}
              পুনরায় স্টকে যোগ হবে এবং অর্জিত লাভ ৳ {getDecVal(reversalTarget.realizedFxGainBDT).toLocaleString()} BDT বাতিল হবে।
            </p>

            <form onSubmit={handleReverse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  বাতিলের কারণ (Reversal Reason) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ভুল দর এন্ট্রি, অর্ডার ক্যানসেলেশন"
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReversalTarget(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  disabled={reversing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20"
                >
                  {reversing ? 'বাতিল হচ্ছে...' : 'নিশ্চিত বাতিল করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
