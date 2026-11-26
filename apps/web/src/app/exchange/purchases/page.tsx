'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Coins,
  ShieldCheck,
  RefreshCw,
  Plus,
  RotateCcw,
  AlertTriangle,
  ArrowDownLeft,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface PurchaseTransaction {
  _id: string;
  voucherNo: string;
  partyName: string;
  currency: string;
  quantity: number;
  rate: number;
  totalCostBDT: number;
  paidAmount: number;
  dueAmount: number;
  paymentAccountName?: string;
  isReversed: boolean;
  reversalReason?: string;
  createdAt: string;
}

export default function PurchasesPage() {
  const { t, formatNumber } = useI18n();
  const [purchases, setPurchases] = useState<PurchaseTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCurrency, setFilterCurrency] = useState('ALL');

  // Reversal Modal
  const [reversalTarget, setReversalTarget] = useState<PurchaseTransaction | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [reversing, setReversing] = useState(false);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const query = filterCurrency !== 'ALL' ? `?currency=${filterCurrency}` : '';
      const res = await ApiClient.request(`/currency/purchases${query}`);
      if (res.success && res.data) {
        setPurchases(res.data);
      }
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [filterCurrency]);

  const handleReverse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalTarget) return;

    try {
      setReversing(true);
      const res = await ApiClient.request(`/currency/purchase/${reversalTarget._id}/reverse`, {
        method: 'POST',
        body: JSON.stringify({ reason: reversalReason }),
      });

      if (res.success) {
        alert('মুদ্রা ক্রয় ট্রানজেকশন সফলভাবে রিভার্স/বাতিল করা হয়েছে। ইনভেন্টরি ও আর্থিক স্থিতি পুনরুদ্ধার করা হয়েছে।');
        setReversalTarget(null);
        setReversalReason('');
        fetchPurchases();
      } else {
        alert(res.message || 'রিভার্স প্রক্রিয়া সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      alert(err.message || 'Error executing reversal');
    } finally {
      setReversing(false);
    }
  };

  const totalVolumeBDT = purchases
    .filter((p) => !p.isReversed)
    .reduce((sum, p) => sum + (p.totalCostBDT || 0), 0);

  const totalPaidBDT = purchases
    .filter((p) => !p.isReversed)
    .reduce((sum, p) => sum + (p.paidAmount || 0), 0);

  const totalDueBDT = purchases
    .filter((p) => !p.isReversed)
    .reduce((sum, p) => sum + (p.dueAmount || 0), 0);

  const columns: Column<PurchaseTransaction>[] = [
    {
      header: 'Voucher No / ভাউচার',
      accessorKey: 'voucherNo',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{item.voucherNo}</span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {new Date(item.createdAt).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Supplier / সরবরাহকারী',
      accessorKey: 'partyName',
      cell: (item) => <span className="font-semibold text-slate-800 text-xs">{item.partyName}</span>,
    },
    {
      header: 'Purchased / কারেন্সি',
      accessorKey: 'quantity',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {formatNumber(Number(item.quantity).toLocaleString())} {item.currency}
        </span>
      ),
    },
    {
      header: 'Buy Rate / দর (BDT)',
      accessorKey: 'rate',
      cell: (item) => (
        <span className="font-mono font-bold text-blue-700 text-xs">
          ৳ {formatNumber(Number(item.rate).toFixed(4))}
        </span>
      ),
    },
    {
      header: 'Total Cost / মোট BDT',
      accessorKey: 'totalCostBDT',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          ৳ {formatNumber(Number(item.totalCostBDT).toLocaleString())}
        </span>
      ),
    },
    {
      header: 'Paid / পরিশোধ',
      accessorKey: 'paidAmount',
      cell: (item) => (
        <span className="font-mono text-emerald-700 text-xs font-semibold">
          ৳ {formatNumber(Number(item.paidAmount).toLocaleString())}
        </span>
      ),
    },
    {
      header: 'Due / বাকি',
      accessorKey: 'dueAmount',
      cell: (item) => (
        <span className={`font-mono text-xs font-semibold ${item.dueAmount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
          ৳ {formatNumber(Number(item.dueAmount).toLocaleString())}
        </span>
      ),
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
            সক্রিয় (Active)
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
        title="বৈদেশিক মুদ্রা ক্রয় রেজিস্টার (Currency Purchases Register)"
        description="সকল পাইকারি ও কাউন্টার বৈদেশিক মুদ্রা ক্রয়ের ঐতিহাসিক বিবরণী, পেমেন্ট স্থিতি এবং সুরক্ষিত লেনদেন রিভার্সাল।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchPurchases}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <Link
              href="/exchange/buy"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন মুদ্রা ক্রয়</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="মোট ক্রয় ভাউচার"
          value={formatNumber(purchases.length)}
          subtitle="সর্বমোট ক্রয় এন্ট্রি"
          icon={Receipt}
        />
        <StatCard
          title="মোট ক্রয় মূল্য (BDT)"
          value={`৳ ${formatNumber(Number(totalVolumeBDT).toLocaleString())}`}
          subtitle="সক্রিয় ক্রয়ের সর্বমোট ব্যয়"
          icon={Coins}
        />
        <StatCard
          title="পরিশোধিত নগদ/ব্যাংক"
          value={`৳ ${formatNumber(Number(totalPaidBDT).toLocaleString())}`}
          subtitle="হিসাব থেকে বিতরণকৃত তহবিল"
          icon={ShieldCheck}
        />
        <StatCard
          title="মোট বকেয়া পাওনা (Due)"
          value={`৳ ${formatNumber(Number(totalDueBDT).toLocaleString())}`}
          subtitle="সরবরাহকারীদের প্রদেয় হিসাব"
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
        data={purchases}
        loading={loading}
        emptyMessage="কোনো মুদ্রা ক্রয় রেকর্ড পাওয়া যায়নি।"
      />

      {/* Reversal Confirmation Modal */}
      {reversalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-2 text-rose-600">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">ক্রয় ভাউচার রিভার্স ও বাতিল</h3>
            </div>
            <p className="text-xs text-slate-600">
              আপনি কি নিশ্চিতভাবে ভাউচার <strong>{reversalTarget.voucherNo}</strong> বাতিল করতে চান? এর ফলে{' '}
              <strong>
                {reversalTarget.quantity} {reversalTarget.currency}
              </strong>{' '}
              স্টক থেকে কমে যাবে এবং পরিশোধিত ৳ {reversalTarget.paidAmount.toLocaleString()} BDT সংশ্লিষ্ট অ্যাকাউন্টে ফেরত যাবে।
            </p>

            <form onSubmit={handleReverse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  বাতিলের কারণ (Reversal Reason) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ভুল এন্ট্রি, গ্রাহকের অনুরোধে বাতিল"
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
