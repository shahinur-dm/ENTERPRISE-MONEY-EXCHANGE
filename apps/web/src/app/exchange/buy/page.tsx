'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowDownLeft,
  Building2,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  User,
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

export default function CurrencyPurchasePage() {
  const { formatNumber } = useI18n();
  const [parties, setParties] = useState<PartyOption[]>([]);
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('MYR');
  const [quantity, setQuantity] = useState<string>('1000');
  const [rate, setRate] = useState<string>('33.00');
  const [paymentAccountId, setPaymentAccountId] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<string>('33000');
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
          setSupplierName(res.data[0].name);
        }
      }
    });

    // Fetch Accounts
    ApiClient.request('/currency/accounts').then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setAccounts(res.data);
        if (res.data.length > 0) {
          setPaymentAccountId(res.data[0]._id);
        }
      }
    });
  }, []);

  // Compute Total Settlement and Due
  const totalValue = quantity && rate ? DecimalMath.multiply(quantity, rate).toFixed(2) : '0.00';
  const dueAmount = totalValue && paidAmount ? DecimalMath.subtract(totalValue, paidAmount).toFixed(2) : '0.00';

  // Sync paid amount when total value changes if user hasn't explicitly changed it
  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    const newTotal = val && rate ? DecimalMath.multiply(val, rate).toFixed(2) : '0.00';
    setPaidAmount(newTotal);
  };

  const handleRateChange = (val: string) => {
    setRate(val);
    const newTotal = quantity && val ? DecimalMath.multiply(quantity, val).toFixed(2) : '0.00';
    setPaidAmount(newTotal);
  };

  const handlePartySelect = (id: string) => {
    setSelectedPartyId(id);
    const p = parties.find((item) => item._id === id);
    if (p) setSupplierName(p.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        partyId: selectedPartyId || undefined,
        supplierName: supplierName || 'Counter Customer',
        purchasedCurrency: currency,
        quantity,
        purchaseRate: rate,
        paidAmount,
        paymentAccountId: paymentAccountId || undefined,
        notes,
      };

      const res = await ApiClient.request('/currency/purchase', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSuccessResult(res.data);
      } else {
        setError(res.message || 'ক্রয় সংরক্ষণ করতে সমস্যা হয়েছে (Failed to record purchase)');
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
        title="বৈদেশিক মুদ্রা ক্রয় (FX Currency Purchase)"
        description="গ্রাহক বা সরবরাহকারীর কাছ থেকে বৈদেশিক মুদ্রা ক্রয় করুন। রিয়েল-টাইম ওয়েটেড এভারেজ কস্ট (WAC) এবং পার্টি খতিয়ান সমন্বিত হয়।"
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
              href="/exchange/purchases"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>ক্রয় রেজিস্টার</span>
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
          <h2 className="text-xl font-bold text-slate-900">মুদ্রা ক্রয় সফলভাবে সম্পন্ন হয়েছে!</h2>
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-left font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">ভাউচার নম্বর:</span>
              <span className="font-bold text-slate-900">{successResult.purchaseNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">সরবরাহকারী/পার্টি:</span>
              <span className="font-bold text-slate-900">{successResult.supplierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ক্রয়কৃত মুদ্রা:</span>
              <span className="font-bold text-blue-700">
                {formatNumber(parseFloat(successResult.quantity?.$numberDecimal || successResult.quantity || '0').toLocaleString())}{' '}
                {successResult.purchasedCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ক্রয় দর (BDT):</span>
              <span className="font-bold text-slate-900">
                ৳ {formatNumber(parseFloat(successResult.purchaseRate?.$numberDecimal || successResult.purchaseRate || '0').toFixed(4))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">মোট ক্রয়মূল্য:</span>
              <span className="font-bold text-emerald-700">
                ৳ {formatNumber(parseFloat(successResult.totalSettlementAmount?.$numberDecimal || successResult.totalSettlementAmount || '0').toLocaleString())} BDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">পরিশোধিত নগদ/ব্যাংক:</span>
              <span className="font-bold text-slate-900">
                ৳ {formatNumber(parseFloat(successResult.paidAmount?.$numberDecimal || successResult.paidAmount || '0').toLocaleString())} BDT
              </span>
            </div>
            {parseFloat(successResult.dueAmount?.$numberDecimal || successResult.dueAmount || '0') > 0 && (
              <div className="flex justify-between text-rose-600 font-bold border-t border-slate-200 pt-1">
                <span>অবশিষ্ট বকেয়া (Payable Due):</span>
                <span>৳ {formatNumber(parseFloat(successResult.dueAmount?.$numberDecimal || successResult.dueAmount || '0').toLocaleString())} BDT</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setSuccessResult(null);
                setQuantity('1000');
                setPaidAmount(DecimalMath.multiply('1000', rate).toFixed(2));
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              আরও ক্রয় রেকর্ড করুন
            </button>
            <Link
              href="/exchange/stock"
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              স্টক যাচাই করুন
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Purchase Details */}
          <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Coins className="w-4 h-4 text-blue-600" />
              <span>মুদ্রা ও ক্রয়ের বিবরণী (Purchase Transaction Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  পার্টি / সরবরাহকারী (Party / Supplier)
                </label>
                <select
                  value={selectedPartyId}
                  onChange={(e) => handlePartySelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">-- নতুন / কাউন্টার গ্রাহক (Counter) --</option>
                  {parties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.partyNo}) - {p.phone}
                    </option>
                  ))}
                </select>
                {!selectedPartyId && (
                  <input
                    type="text"
                    placeholder="কাউন্টার গ্রাহকের নাম লিখুন..."
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  মুদ্রা নির্বাচন করুন (Purchased Currency)
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
                  মুদ্রার পরিমাণ (Foreign Currency Quantity)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  ক্রয় দর (Purchase Rate BDT)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  min="0.0001"
                  value={rate}
                  onChange={(e) => handleRateChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  পরিশোধের তহবিল হিসাব (Payment Source Account)
                </label>
                <select
                  value={paymentAccountId}
                  onChange={(e) => setPaymentAccountId(e.target.value)}
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
                  পরিশোধিত নগদ টাকা (Paid Amount BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  সম্পূর্ণ বা আংশিক পরিশোধ করা যাবে। অবশিষ্ট টাকা পার্টির পাওনা হিসেবে থাকবে।
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                মন্তব্য বা নোট (Notes / Remarks)
              </label>
              <input
                type="text"
                placeholder="রেফারেন্স, পাসপোর্ট বা কাউন্টার নোট..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Settlement Summary Card */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <h4 className="font-bold text-sm tracking-wide flex items-center space-x-2 text-blue-400">
                <CreditCard className="w-4 h-4" />
                <span>ক্রয় হিসাব সারসংক্ষেপ</span>
              </h4>

              <div className="space-y-3 font-mono text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">মুদ্রার পরিমাণ:</span>
                  <span className="font-bold">{formatNumber(quantity)} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">প্রতি একক দর:</span>
                  <span className="font-bold">৳ {formatNumber(rate)} BDT</span>
                </div>
                <div className="flex justify-between text-base border-t border-slate-800 pt-2 text-emerald-400">
                  <span className="font-sans font-bold">মোট ক্রয়মূল্য:</span>
                  <span className="font-bold">৳ {formatNumber(Number(totalValue).toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
                </div>
                <div className="flex justify-between text-blue-300">
                  <span>পরিশোধযোগ্য টাকা:</span>
                  <span>৳ {formatNumber(Number(paidAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-bold border-t border-slate-800 pt-2">
                  <span>পার্টির পাওনা (Due):</span>
                  <span>৳ {formatNumber(Number(dueAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }))}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center space-x-1.5 text-blue-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ওয়েটেড এভারেজ কস্ট (WAC)</span>
                </div>
                <p>ক্রয় নিশ্চিত করার সাথে সাথে এই মুদ্রার গড় মজুদ মূল্য (WAC) স্বয়ংক্রিয়ভাবে আপডেট হবে।</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>{loading ? 'প্রক্রিয়াকরণ হচ্ছে...' : 'ক্রয় নিশ্চিত ও পোস্ট করুন'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
