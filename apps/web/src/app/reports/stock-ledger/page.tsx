'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  Printer,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface StockMovement {
  _id: string;
  movementNo: string;
  currency: string;
  type: string;
  quantity: number;
  unitCostBDT: number;
  totalCostBDT: number;
  resultingBalance: number;
  resultingWAC: number;
  referenceVoucher: string;
  notes?: string;
  createdAt: string;
}

export default function StockLedgerReportPage() {
  const { t, formatNumber } = useI18n();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCurrency, setFilterCurrency] = useState('ALL');

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const query = filterCurrency !== 'ALL' ? `?currency=${filterCurrency}` : '';
      const res = await ApiClient.request(`/currency/stock-ledger${query}`);
      if (res.success && res.data) {
        setMovements(res.data);
      }
    } catch (err) {
      console.error('Error fetching stock ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [filterCurrency]);

  const columns: Column<StockMovement>[] = [
    {
      header: 'Date & Time / তারিখ',
      accessorKey: 'createdAt',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-700">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Movement No / ভাউচার',
      accessorKey: 'movementNo',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{item.movementNo}</span>
          <span className="font-mono text-[10px] text-slate-400 block">{item.referenceVoucher}</span>
        </div>
      ),
    },
    {
      header: 'Currency / কারেন্সি',
      accessorKey: 'currency',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900 text-xs px-2 py-0.5 bg-slate-100 rounded">
          {item.currency}
        </span>
      ),
    },
    {
      header: 'Movement Type / ধরন',
      accessorKey: 'type',
      cell: (item) => {
        const isPositive = item.type.includes('IN') || item.type === 'PURCHASE';
        return (
          <span
            className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {item.type}
          </span>
        );
      },
    },
    {
      header: 'Quantity / পরিমাণ',
      accessorKey: 'quantity',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {formatNumber(Number(item.quantity).toLocaleString())}
        </span>
      ),
    },
    {
      header: 'Rate (BDT) / দর',
      accessorKey: 'unitCostBDT',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-700">
          ৳ {formatNumber(Number(item.unitCostBDT).toFixed(4))}
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
      header: 'Balance / অবশিষ্ট মজুদ',
      accessorKey: 'resultingBalance',
      cell: (item) => (
        <span className="font-mono font-bold text-blue-700 text-xs">
          {formatNumber(Number(item.resultingBalance).toLocaleString())}
        </span>
      ),
    },
    {
      header: 'Resulting WAC / নতুন গড় দর',
      accessorKey: 'resultingWAC',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-emerald-700">
          ৳ {formatNumber(Number(item.resultingWAC).toFixed(4))}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="কারেন্সি স্টক মুভমেন্ট খতিয়ান (Currency Stock Movement Ledger)"
        description="বৈদেশিক মুদ্রা স্টক ইন ও স্টক আউটের প্রতিটি একক ট্রানজেকশনের বিশদ অডিট ট্রেইল এবং রানিং WAC হিস্ট্রি।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchMovements}
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
              <span>প্রিন্ট লেজার</span>
            </button>
          </div>
        }
      />

      <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <Filter className="w-4 h-4 text-slate-400" />
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
        data={movements}
        loading={loading}
        emptyMessage="কোনো স্টক মুভমেন্ট রেকর্ড পাওয়া যায়নি।"
      />
    </div>
  );
}
