'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileDiff,
  RefreshCw,
  Boxes,
  ShieldCheck,
  Plus,
  AlertCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface StockMovement {
  _id: string;
  movementNo: string;
  currency: string;
  movementType: string;
  quantity: any;
  rateBDT: any;
  totalCostBDT: any;
  previousBalance: any;
  newBalance: any;
  previousWAC: any;
  newWAC: any;
  voucherNo: string;
  notes?: string;
  createdAt: string;
}

export default function StockAdjustmentsPage() {
  const { formatNumber } = useI18n();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.request('/currency/stock-ledger');
      if (res.success && Array.isArray(res.data)) {
        // Filter adjustments or all movements
        setMovements(res.data);
      }
    } catch (err) {
      console.error('Error fetching stock ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const columns: Column<StockMovement>[] = [
    {
      header: 'Movement No / ভাউচার',
      accessorKey: 'movementNo',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{item.movementNo}</span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Currency / কারেন্সি',
      accessorKey: 'currency',
      cell: (item) => <span className="font-mono font-bold text-xs text-blue-700">{item.currency}</span>,
    },
    {
      header: 'Movement Type / ধরন',
      accessorKey: 'movementType',
      cell: (item) => {
        const isAddition =
          item.movementType === 'PURCHASE' ||
          item.movementType === 'REVERSAL_IN' ||
          item.movementType === 'ADJUSTMENT_IN' ||
          item.movementType === 'OPENING';
        return (
          <span
            className={`font-semibold text-xs px-2 py-0.5 rounded ${
              isAddition
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {item.movementType}
          </span>
        );
      },
    },
    {
      header: 'Quantity / পরিমাণ',
      accessorKey: 'quantity',
      cell: (item) => (
        <span className="font-mono font-bold text-xs text-slate-900">
          {formatNumber(getDecVal(item.quantity).toLocaleString())} {item.currency}
        </span>
      ),
    },
    {
      header: 'Rate (BDT) / দর',
      accessorKey: 'rateBDT',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-800">
          ৳ {formatNumber(getDecVal(item.rateBDT).toFixed(4))}
        </span>
      ),
    },
    {
      header: 'New Balance / নতুন মজুদ',
      accessorKey: 'newBalance',
      cell: (item) => (
        <span className="font-mono font-bold text-xs text-slate-900">
          {formatNumber(getDecVal(item.newBalance).toLocaleString())} {item.currency}
        </span>
      ),
    },
    {
      header: 'Updated WAC / নতুন গড় দর',
      accessorKey: 'newWAC',
      cell: (item) => (
        <span className="font-mono text-xs text-blue-700 font-semibold">
          ৳ {formatNumber(getDecVal(item.newWAC).toFixed(4))} BDT
        </span>
      ),
    },
    {
      header: 'Voucher Ref / রেফারেন্স',
      accessorKey: 'voucherNo',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
          {item.voucherNo || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="মুদ্রা স্টক মুভমেন্ট ও সমন্বয় (Stock Movements & Adjustments)"
        description="বৈদেশিক মুদ্রার প্রতিটি ইন ও আউট মুভমেন্ট, ভৌত স্টক সমন্বয় এবং স্বয়ংক্রিয় ডব্লিউএসি অডিট ট্রেইল।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAdjustments}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <Link
              href="/exchange/stock"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Boxes className="w-4 h-4" />
              <span>কারেন্সি স্টক পজিশন দেখুন</span>
            </Link>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={movements}
        loading={loading}
        emptyMessage="কোনো স্টক মুভমেন্ট রেকর্ড পাওয়া যায়নি।"
      />
    </div>
  );
}
