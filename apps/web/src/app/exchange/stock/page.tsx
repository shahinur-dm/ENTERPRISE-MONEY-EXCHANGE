'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Boxes,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Coins,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface CurrencyStockItem {
  code: string;
  name: string;
  symbol: string;
  stockQuantity: string;
  averageCostRateBDT: string;
  totalValuationBDT: string;
  todayPurchased: string;
  todaySold: string;
}

interface StockMovementItem {
  _id: string;
  movementNo: string;
  movementType: string;
  currencyCode: string;
  openingQuantity: string;
  inflowQuantity: string;
  outflowQuantity: string;
  closingQuantity: string;
  unitCostRate: string;
  bdtValuation: string;
  reference: string;
  timestamp: string;
}

export default function CurrencyStockPage() {
  const { formatNumber } = useI18n();
  const [stocks, setStocks] = useState<CurrencyStockItem[]>([]);
  const [movements, setMovements] = useState<StockMovementItem[]>([]);
  const [totalValuationBDT, setTotalValuationBDT] = useState<string>('0.00');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'STOCK' | 'LEDGER'>('STOCK');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.request('/currency/stock');
      if (res.success && Array.isArray(res.data)) {
        setStocks(res.data);
        const total = res.data.reduce((acc: number, curr: CurrencyStockItem) => {
          return acc + parseFloat(curr.totalValuationBDT || '0');
        }, 0);
        setTotalValuationBDT(total.toFixed(2));
      }
    } catch (err) {
      console.error('Error fetching stock summary:', err);
    }

    try {
      const query = selectedCurrency !== 'ALL' ? `?currency=${selectedCurrency}` : '';
      const movRes = await ApiClient.request(`/currency/stock/ledger${query}`);
      if (movRes.success && Array.isArray(movRes.data)) {
        setMovements(movRes.data);
      }
    } catch (err) {
      console.error('Error fetching movements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [selectedCurrency]);

  const getCurrencyFlag = (code: string) => {
    switch (code) {
      case 'MYR': return '🇲🇾';
      case 'USD': return '🇺🇸';
      case 'EUR': return '🇪🇺';
      case 'SAR': return '🇸🇦';
      case 'SGD': return '🇸🇬';
      case 'GBP': return '🇬🇧';
      case 'AED': return '🇦🇪';
      default: return '💱';
    }
  };

  const stockColumns: Column<CurrencyStockItem>[] = [
    {
      header: 'Currency / কারেন্সি',
      accessorKey: 'code',
      cell: (item) => (
        <div className="flex items-center space-x-2.5">
          <span className="text-xl">{getCurrencyFlag(item.code)}</span>
          <div>
            <span className="font-mono font-bold text-slate-900">{item.code}</span>
            <span className="block text-[11px] text-slate-500">{item.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Available Stock / মোট মজুদ',
      accessorKey: 'stockQuantity',
      cell: (item) => {
        const qty = parseFloat(item.stockQuantity || '0');
        return (
          <div>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatNumber(qty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}{' '}
              {item.code}
            </span>
            {qty <= 0 && (
              <span className="block text-[10px] text-rose-500 font-semibold">শূন্য মজুদ (Out of stock)</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Weighted Avg Cost (WAC) / গড় ক্রয়মূল্য',
      accessorKey: 'averageCostRateBDT',
      cell: (item) => (
        <div className="font-mono">
          <span className="font-bold text-blue-700">
            ৳ {formatNumber(parseFloat(item.averageCostRateBDT || '0').toFixed(4))} BDT
          </span>
          <span className="block text-[10px] text-slate-400">প্রতি একক খরচ</span>
        </div>
      ),
    },
    {
      header: 'Inventory Valuation / মোট মজুদ মূল্য',
      accessorKey: 'totalValuationBDT',
      cell: (item) => (
        <div className="font-mono">
          <span className="font-bold text-emerald-700 text-sm">
            ৳ {formatNumber(parseFloat(item.totalValuationBDT || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} BDT
          </span>
          <span className="block text-[10px] text-slate-400">মজুদ × গড় খরচ</span>
        </div>
      ),
    },
    {
      header: "Today's Inflow (Buy) / আজকের ক্রয়",
      accessorKey: 'todayPurchased',
      cell: (item) => (
        <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          +{formatNumber(parseFloat(item.todayPurchased || '0').toLocaleString())} {item.code}
        </span>
      ),
    },
    {
      header: "Today's Outflow (Sell) / আজকের বিক্রয়",
      accessorKey: 'todaySold',
      cell: (item) => (
        <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          -{formatNumber(parseFloat(item.todaySold || '0').toLocaleString())} {item.code}
        </span>
      ),
    },
    {
      header: 'Actions / পদক্ষেপ',
      accessorKey: 'code',
      cell: (item) => (
        <div className="flex items-center space-x-1.5">
          <Link
            href={`/exchange/buy?currency=${item.code}`}
            className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center space-x-1 shadow-xs"
          >
            <ArrowDownLeft className="w-3 h-3" />
            <span>ক্রয় (Buy)</span>
          </Link>
          <Link
            href={`/exchange/sell?currency=${item.code}`}
            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1 shadow-xs"
          >
            <ArrowUpRight className="w-3 h-3" />
            <span>বিক্রয় (Sell)</span>
          </Link>
        </div>
      ),
    },
  ];

  const movementColumns: Column<StockMovementItem>[] = [
    {
      header: 'Date & Time / তারিখ',
      accessorKey: 'timestamp',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-600">
          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Movement No / ভাউচার',
      accessorKey: 'movementNo',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{item.movementNo}</span>
          <span className="block text-[10px] text-slate-400 font-mono">{item.reference}</span>
        </div>
      ),
    },
    {
      header: 'Currency / মুদ্রা',
      accessorKey: 'currencyCode',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-800 text-xs px-2 py-0.5 bg-slate-100 rounded">
          {item.currencyCode}
        </span>
      ),
    },
    {
      header: 'Movement Type / ধরন',
      accessorKey: 'movementType',
      cell: (item) => {
        const isPositive = item.movementType.includes('IN') || item.movementType === 'PURCHASE';
        return (
          <span
            className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
              isPositive
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
      accessorKey: 'inflowQuantity',
      cell: (item) => {
        const inQty = parseFloat(item.inflowQuantity || '0');
        const outQty = parseFloat(item.outflowQuantity || '0');
        const displayQty = inQty > 0 ? inQty : outQty;
        return (
          <span className="font-mono font-bold text-slate-900 text-xs">
            {formatNumber(displayQty.toLocaleString())}
          </span>
        );
      },
    },
    {
      header: 'Unit Rate (BDT) / দর',
      accessorKey: 'unitCostRate',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-700">
          ৳ {formatNumber(parseFloat(item.unitCostRate || '0').toFixed(4))}
        </span>
      ),
    },
    {
      header: 'Closing Stock / অবশিষ্ট মজুদ',
      accessorKey: 'closingQuantity',
      cell: (item) => (
        <span className="font-mono font-semibold text-slate-900 text-xs">
          {formatNumber(parseFloat(item.closingQuantity || '0').toLocaleString())}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="মুদ্রা স্টক ও ইনভেন্টরি মূল্যায়ন (Currency Stock Inventory)"
        description="রিয়েল-টাইম ওয়েটেড এভারেজ কস্ট (WAC) ভিত্তিক বহুমাত্রিক বৈদেশিক মুদ্রার মজুদ ট্র্যাকিং ও অডিট লেজার।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchStockData}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ করুন</span>
            </button>
            <Link
              href="/exchange/buy"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>নতুন মুদ্রা ক্রয়</span>
            </Link>
            <Link
              href="/exchange/sell"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>নতুন মুদ্রা বিক্রয়</span>
            </Link>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="মোট ইনভেন্টরি মূল্যায়ন (BDT)"
          value={`৳ ${formatNumber(parseFloat(totalValuationBDT).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`}
          subtitle="বর্তমান WAC দরে মোট পোর্টফোলিও মূল্য"
          icon={TrendingUp}
        />
        <StatCard
          title="সক্রিয় কারেন্সি সংখ্যা"
          value={formatNumber(stocks.length)}
          subtitle="MYR, USD, SAR, SGD, EUR ইত্যাদি"
          icon={Coins}
        />
        <StatCard
          title="ইনভেন্টরি কস্টিং পদ্ধতি"
          value="Weighted Avg Cost"
          subtitle="স্বয়ংক্রিয় WAC রিক্যালকুলেশন"
          icon={ShieldCheck}
        />
        <StatCard
          title="ঋণাত্মক স্টক প্রতিরোধ"
          value="Strict Protected"
          subtitle="মজুদের চেয়ে বেশি বিক্রয় সম্পূর্ণ নিষিদ্ধ"
          icon={AlertCircle}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('STOCK')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'STOCK'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>কারেন্সি স্টক পজিশন (Current Stock)</span>
        </button>
        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'LEDGER'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>স্টক মুভমেন্ট অডিট লেজার (Stock Movement Log)</span>
        </button>
      </div>

      {activeTab === 'STOCK' ? (
        <DataTable
          columns={stockColumns}
          data={stocks}
          loading={loading}
          emptyMessage="কোনো সক্রিয় কারেন্সি স্টক পাওয়া যায়নি।"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-600">কারেন্সি ফিল্টার:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="text-xs font-semibold rounded-lg border border-slate-300 p-2 outline-none focus:border-blue-500 bg-white"
            >
              <option value="ALL">সকল কারেন্সি (All Currencies)</option>
              {stocks.map((s) => (
                <option key={s.code} value={s.code}>
                  {getCurrencyFlag(s.code)} {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>
          <DataTable
            columns={movementColumns}
            data={movements}
            loading={loading}
            emptyMessage="কোনো স্টক মুভমেন্ট রেকর্ড পাওয়া যায়নি।"
          />
        </div>
      )}
    </div>
  );
}
