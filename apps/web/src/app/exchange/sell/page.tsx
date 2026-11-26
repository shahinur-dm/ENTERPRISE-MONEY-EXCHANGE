'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  CreditCard,
  FileText,
  Boxes,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';
import { DecimalMath } from '@erp/shared';

interface PartyOption {
  _id: string;
  partyNo: string;
  name: string;
  phone: string;
  currentBalanceBDT: string;
}

interface AccountOption {
  _id: string;
  accountNo: string;
  accountName: string;
  accountType: string;
  balanceBDT: string;
}

interface StockItem {
  code: string;
  name: string;
  stockQuantity: string;
  averageCostRateBDT: string;
  totalValuationBDT: string;
}

export default function CurrencySalePage() {
  const { formatNumber } = useI18n();
  const [parties, setParties] = useState<PartyOption[]>([]);
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [stocks, setStocks] = useState<Record<string, StockItem>>({});

  const [selectedPartyId, setSelectedPartyId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('MYR');
  const [quantity, setQuantity] = useState<string>('500');
  const [sellRate, setSellRate] = useState<string>('35.00');
  const [receiptAccountId, setReceiptAccountId] = useState<string>('');
  const [receivedAmount, setReceivedAmount] = useState<string>('17500');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  useEffect(() => {
    // Read query parameter for initial currency
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('currency');
      if (c) setCurrency(c.toUpperCase());
    }

    // Fetch Parties
    ApiClient.request('/currency/parties').then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setParties(res.data);
        if (res.data.length > 0) {
          setSelectedPartyId(res.data[0]._id);
          setCustomerName(res.data[0].name);
        }
      }
    });

    // Fetch Accounts
    ApiClient.request('/currency/accounts').then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setAccounts(res.data);
        if (res.data.length > 0) {
          setReceiptAccountId(res.data[0]._id);
        }
      }
    });

    // Fetch Stock Summary
    ApiClient.request('/currency/stock').then((res) => {
      if (res.success && Array.isArray(res.data)) {
        const map: Record<string, StockItem> = {};
        res.data.forEach((item: StockItem) => {
          map[item.code] = item;
        });
        setStocks(map);
      }
    });
  }, []);

  const currentStock = stocks[currency] || {
    code: currency,
    name: currency,
    stockQuantity: '0.00',
    averageCostRateBDT: '0.0000',
    totalValuationBDT: '0.00',
  };

  const availableStockQty = parseFloat(currentStock.stockQuantity || '0');
  const currentWAC = currentStock.averageCostRateBDT || '0.0000';

  // Gross Proceeds, COGS, Realized FX Gain, and Due Amount
  const grossProceeds = quantity && sellRate ? DecimalMath.multiply(quantity, sellRate).toFixed(2) : '0.00';
  const totalCostBasis = quantity && currentWAC ? DecimalMath.multiply(quantity, currentWAC).toFixed(2) : '0.00';
  const realizedProfit = DecimalMath.subtract(grossProceeds, totalCostBasis).toFixed(2);
  const dueAmount = grossProceeds && receivedAmount ? DecimalMath.subtract(grossProceeds, receivedAmount).toFixed(2) : '0.00';

  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    const newGross = val && sellRate ? DecimalMath.multiply(val, sellRate).toFixed(2) : '0.00';
    setReceivedAmount(newGross);
  };

  const handleSellRateChange = (val: string) => {
    setSellRate(val);
    const newGross = quantity && val ? DecimalMath.multiply(quantity, val).toFixed(2) : '0.00';
    setReceivedAmount(newGross);
  };

  const handlePartySelect = (id: string) => {
    setSelectedPartyId(id);
    const p = parties.find((item) => item._id === id);
    if (p) setCustomerName(p.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const reqQty = parseFloat(quantity || '0');
    if (reqQty <= 0) {
      setError('বিক্রয়ের পরিমাণ অবশ্যই ০-এর বেশি হতে হবে।');
      return;
    }

    if (reqQty > availableStockQty) {
      setError(
        `পর্যাপ্ত স্টক নেই! বর্তমান মজুদ: ${availableStockQty.toLocaleString()} ${currency}, কিন্তু বিক্রয় অনুরোধ: ${reqQty.toLocaleString()} ${currency}`
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        partyId: selectedPartyId || undefined,
        customerName: customerName || 'Counter Buyer',
        soldCurrency: currency,
        quantity,
        sellingRate: sellRate,
        receivedAmount,
        receiptAccountId: receiptAccountId || undefined,
        notes,
      };

      const res = await ApiClient.request('/currency/sale', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSuccessResult(res.data);
      } else {
        setError(res.message || 'বিক্রয় সংরক্ষণ করতে সমস্যা হয়েছে (Failed to record sale)');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="বৈদেশিক মুদ্রা বিক্রয় (FX Currency Sale)"
        description="পাইকারি ডিলার বা গ্রাহকের কাছে বৈদেশিক মুদ্রা বিক্রয় করুন। তাৎক্ষণিক গ্রস ট্রেডিং লাভ (Realized FX Margin) এবং মজুদ সমন্বিত হয়।"
        actions={
          <div className="flex items-center space-x-2">
            <Link
              href="/exchange/stock"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <Boxes className="w-3.5 h-3.5 text-blue-600" />
              <span>কারেন্সি স্টক দেখুন</span>
            </Link>
            <Link
              href="/exchange/sales"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>বিক্রয় রেজিস্টার</span>
            </Link>
          </div>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successResult ? (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">মুদ্রা বিক্রয় ও লাভ সফলভাবে নথিভুক্ত হয়েছে!</h2>
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-left font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">ভাউচার নম্বর:</span>
              <span className="font-bold text-slate-900">{successResult.saleNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ক্রেতা/ডিলার:</span>
              <span className="font-bold text-slate-900">{successResult.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">বিক্রিত মুদ্রা:</span>
              <span className="font-bold text-purple-700">
                {formatNumber(parseFloat(successResult.quantity?.$numberDecimal || successResult.quantity || '0').toLocaleString())}{' '}
                {successResult.soldCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">বিক্রয় দর (BDT):</span>
              <span className="font-bold text-slate-900">
                ৳ {formatNumber(parseFloat(successResult.sellingRate?.$numberDecimal || successResult.sellingRate || '0').toFixed(4))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">মোট বিক্রয় মূল্য:</span>
              <span className="font-bold text-slate-900">
                ৳ {formatNumber(parseFloat(successResult.grossProceedsBDT?.$numberDecimal || successResult.grossProceedsBDT || '0').toLocaleString())} BDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">WAC ক্রয় খরচ (COGS):</span>
              <span className="font-mono text-slate-600">
                ৳ {formatNumber(parseFloat(successResult.costBasisBDT?.$numberDecimal || successResult.costBasisBDT || '0').toLocaleString())} BDT
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1 text-sm">
              <span>অর্জিত গ্রস প্রফিট (Realized FX Gain):</span>
              <span>+৳ {formatNumber(parseFloat(successResult.realizedFxGainBDT?.$numberDecimal || successResult.realizedFxGainBDT || '0').toLocaleString())} BDT</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>প্রাপ্ত নগদ/ব্যাংক:</span>
              <span>৳ {formatNumber(parseFloat(successResult.receivedAmountBDT?.$numberDecimal || successResult.receivedAmountBDT || '0').toLocaleString())} BDT</span>
            </div>
            {parseFloat(successResult.dueAmountBDT?.$numberDecimal || successResult.dueAmountBDT || '0') > 0 && (
              <div className="flex justify-between text-rose-600 font-bold border-t border-slate-200 pt-1">
                <span>গ্রাহকের কাছে বাকি (Receivable Due):</span>
                <span>৳ {formatNumber(parseFloat(successResult.dueAmountBDT?.$numberDecimal || successResult.dueAmountBDT || '0').toLocaleString())} BDT</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setSuccessResult(null);
                setQuantity('500');
                setReceivedAmount(DecimalMath.multiply('500', sellRate).toFixed(2));
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              আরও বিক্রয় রেকর্ড করুন
            </button>
            <Link
              href="/exchange/sales"
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              বিক্রয় হিস্ট্রি দেখুন
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Sale Details */}
          <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>মুদ্রা বিক্রয়ের বিবরণী (Sale Transaction Details)</span>
              </h3>
              <div className="text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-mono">
                <span className="text-slate-500 mr-2">মজুদ:</span>
                <span className={`font-bold ${availableStockQty > 0 ? 'text-blue-700' : 'text-rose-600'}`}>
                  {formatNumber(availableStockQty.toLocaleString())} {currency}
                </span>
                <span className="text-slate-400 mx-2">|</span>
                <span className="text-slate-500 mr-1">WAC:</span>
                <span className="font-bold text-slate-700">৳{parseFloat(currentWAC).toFixed(4)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  পার্টি / ক্রেতা (Party / Customer / Dealer)
                </label>
                <select
                  value={selectedPartyId}
                  onChange={(e) => handlePartySelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">-- কাউন্টার ক্রেতা (Counter Buyer) --</option>
                  {parties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.partyNo}) - {p.phone}
                    </option>
                  ))}
                </select>
                {!selectedPartyId && (
                  <input
                    type="text"
                    placeholder="কাউন্টার ক্রেতার নাম লিখুন..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  মুদ্রা নির্বাচন করুন (Sold Currency)
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  <option value="MYR">🇲🇾 MYR - Malaysian Ringgit</option>
                  <option value="USD">🇺🇸 USD - US Dollar</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                  <option value="SAR">🇸🇦 SAR - Saudi Riyal</option>
                  <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
                  <option value="GBP">🇬🇧 GBP - British Pound</option>
                  <option value="AED">🇦🇪 AED - UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  বিক্রয়ের পরিমাণ (Units)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  max={availableStockQty > 0 ? availableStockQty : undefined}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-sm font-mono font-bold outline-none ${
                    parseFloat(quantity || '0') > availableStockQty
                      ? 'border-rose-500 text-rose-700 bg-rose-50'
                      : 'border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
                {parseFloat(quantity || '0') > availableStockQty && (
                  <span className="text-[10px] text-rose-600 block mt-1 font-bold">
                    সতর্কতা: মজুদের চেয়ে বেশি বিক্রয় করা যাবে না!
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  বিক্রয় দর (Selling Rate BDT)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  min="0.0001"
                  value={sellRate}
                  onChange={(e) => handleSellRateChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  বর্তমান WAC গড় খরচ: ৳{parseFloat(currentWAC).toFixed(4)}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  জমা গ্রহণের তহবিল হিসাব (Receipt Account)
                </label>
                <select
                  value={receiptAccountId}
                  onChange={(e) => setReceiptAccountId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">-- অ্যাকাউন্ট নির্বাচন করুন --</option>
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.accountName} ({a.accountType}) - স্থিতি: ৳{parseFloat(a.balanceBDT || '0').toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  প্রাপ্ত নগদ টাকা (Received Amount BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  সম্পূর্ণ বা আংশিক গ্রহণ করা যাবে। বাকি টাকা ক্রেতার দেনা (Receivable) হিসেবে থাকবে।
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                মন্তব্য বা নোট (Notes / Remarks)
              </label>
              <input
                type="text"
                placeholder="চালান রেফারেন্স, পাসপোর্ট বা কাউন্টার নোট..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Profit & Settlement Summary Card */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <h4 className="font-bold text-sm tracking-wide flex items-center space-x-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>বিক্রয় ও মুনাফা হিসাব সারসংক্ষেপ</span>
              </h4>

              <div className="space-y-3 font-mono text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">বিক্রয়ের পরিমাণ:</span>
                  <span className="font-bold">{formatNumber(quantity)} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">বিক্রয় দর:</span>
                  <span className="font-bold">৳ {formatNumber(sellRate)} BDT</span>
                </div>
                <div className="flex justify-between text-base border-t border-slate-800 pt-2 text-white">
                  <span className="font-sans font-bold">মোট বিক্রয় মূল্য:</span>
                  <span className="font-bold">৳ {formatNumber(Number(grossProceeds).toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>WAC ক্রয় খরচ (COGS):</span>
                  <span>৳ {formatNumber(Number(totalCostBasis).toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold text-sm bg-slate-800/80 p-2 rounded-lg">
                  <span>প্রত্যাশিত গ্রস প্রফিট:</span>
                  <span>+৳ {formatNumber(Number(realizedProfit).toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT</span>
                </div>
                <div className="flex justify-between text-blue-300">
                  <span>প্রাপ্ত টাকা:</span>
                  <span>৳ {formatNumber(Number(receivedAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-bold border-t border-slate-800 pt-2">
                  <span>গ্রাহকের দেনা (Due):</span>
                  <span>৳ {formatNumber(Number(dueAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>তাত্ক্ষণিক লাভ বুকিং</span>
                </div>
                <p>বিক্রয় সফল হলে লাভ তাৎক্ষণিকভাবে অর্জিত লাভ হিসেবে লাভ-ক্ষতি বিবরণীতে লিপিবদ্ধ হবে।</p>
              </div>

              <button
                type="submit"
                disabled={loading || parseFloat(quantity || '0') > availableStockQty || availableStockQty <= 0}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{loading ? 'প্রক্রিয়াকরণ হচ্ছে...' : 'বিক্রয় নিশ্চিত ও পোস্ট করুন'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
