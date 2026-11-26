'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Wallet,
  Receipt,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface Party {
  _id: string;
  partyNo: string;
  name: string;
  businessName?: string;
  currentBalanceBDT: any;
}

interface FinancialAccount {
  _id: string;
  accountNo: string;
  accountName: string;
  accountType: string;
  balanceBDT: any;
}

export default function BuyerReceiptPage() {
  const searchParams = useSearchParams();
  const initialPartyId = searchParams.get('partyId') || '';
  const { formatNumber } = useI18n();

  const [parties, setParties] = useState<Party[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [partyId, setPartyId] = useState(initialPartyId);
  const [receiptAccountId, setReceiptAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, aRes] = await Promise.all([
          ApiClient.request('/currency/parties'),
          ApiClient.request('/currency/accounts'),
        ]);

        if (pRes.success && Array.isArray(pRes.data)) {
          setParties(pRes.data);
          if (!partyId && pRes.data.length > 0) {
            setPartyId(pRes.data[0]._id);
          }
        }
        if (aRes.success && Array.isArray(aRes.data)) {
          setAccounts(aRes.data);
          if (aRes.data.length > 0) {
            setReceiptAccountId(aRes.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    }
    loadData();
  }, []);

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const selectedParty = parties.find((p) => p._id === partyId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!partyId) {
      setErrorMsg('দয়া করে পার্টি নির্বাচন করুন।');
      return;
    }
    if (!receiptAccountId) {
      setErrorMsg('দয়া করে জমা গ্রহণের অ্যাকাউন্ট নির্বাচন করুন।');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('জমার পরিমাণ অবশ্যই ০ এর বেশি হতে হবে।');
      return;
    }

    try {
      setSubmitting(true);
      const res = await ApiClient.request('/currency/buyer-receipt', {
        method: 'POST',
        body: JSON.stringify({
          partyId,
          receiptAccountId,
          amount,
          notes,
        }),
      });

      if (res.success) {
        setSuccessResult(res.data);
      } else {
        setErrorMsg(res.message || 'রসিদ ভাউচার সংরক্ষণ করতে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'সার্ভার সংযোগে ত্রুটি ঘটেছে।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="বায়ার জমা গ্রহণ ও নিষ্পত্তি (Buyer Settlement Receipt)"
        description="মুদ্রা ক্রেতা বা পাইকারি ডিলারের কাছ থেকে পূর্বে বাকিতে বিক্রিত কারেন্সির দেনা বাবদ টাকা নগদ বা ব্যাংক হিসাবে জমা নিন।"
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            প্রাপ্য তহবিল নিষ্পত্তি (Receivable Settlement)
          </span>
        }
      />

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successResult ? (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">টাকা জমা সফলভাবে সম্পন্ন হয়েছে!</h2>
            <p className="text-xs text-slate-600 mt-1">
              রসিদ ভাউচার নম্বর:{' '}
              <span className="font-mono font-bold text-blue-700">{successResult.voucherNo}</span>
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">গৃহীত জমা টাকা:</span>
              <span className="font-bold text-emerald-700">
                ৳ {formatNumber(parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">পার্টির নতুন জের:</span>
              <span className="font-bold text-slate-900">
                ৳ {formatNumber(getDecVal(successResult.party?.currentBalanceBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">অ্যাকাউন্টের বর্তমান স্থিতি:</span>
              <span className="font-bold text-blue-700">
                ৳ {formatNumber(getDecVal(successResult.account?.balanceBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setSuccessResult(null);
                setAmount('');
                setNotes('');
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              আরও জমা গ্রহণ করুন
            </button>
            <Link
              href={`/parties/ledger?partyId=${partyId}`}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              পার্টির খতিয়ান দেখুন
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              প্রদানকারী ক্রেতা বা ডিলার (Party / Customer) *
            </label>
            <select
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
            >
              {parties.map((p) => {
                const bal = getDecVal(p.currentBalanceBDT);
                return (
                  <option key={p._id} value={p._id}>
                    {p.businessName ? `${p.businessName} (${p.name})` : p.name} [{p.partyNo}] — দেনা: ৳ {bal.toLocaleString()} BDT
                  </option>
                );
              })}
            </select>
            {selectedParty && (
              <div className="mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-500">গ্রাহকের কাছে বর্তমান দেনা (Receivable):</span>
                <span
                  className={`font-mono font-bold ${
                    getDecVal(selectedParty.currentBalanceBDT) > 0 ? 'text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  ৳ {formatNumber(getDecVal(selectedParty.currentBalanceBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              জমা গ্রহণের অ্যাকাউন্ট (Deposit Receipt Account) *
            </label>
            <select
              value={receiptAccountId}
              onChange={(e) => setReceiptAccountId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
            >
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.accountName} ({a.accountType}) — স্থিতি: ৳{getDecVal(a.balanceBDT).toLocaleString()} BDT
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              গৃহীত জমার পরিমাণ (Received Amount BDT) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="যেমন: 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
            />
            {selectedParty && getDecVal(selectedParty.currentBalanceBDT) > 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(getDecVal(selectedParty.currentBalanceBDT)))}
                className="text-[11px] text-blue-600 font-semibold hover:underline mt-1"
              >
                সম্পূর্ণ বকেয়া নির্ধারণ করুন (৳ {formatNumber(getDecVal(selectedParty.currentBalanceBDT).toLocaleString())})
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              বিবরণ বা রেফারেন্স নম্বর (Notes)
            </label>
            <input
              type="text"
              placeholder="যেমন: নগদ গ্রহণ, ব্যাংক ট্রান্সফার রেফারেন্স..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{submitting ? 'প্রসেসিং হচ্ছে...' : 'জমা নিশ্চিত ও পোস্ট করুন (Execute Receipt)'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
