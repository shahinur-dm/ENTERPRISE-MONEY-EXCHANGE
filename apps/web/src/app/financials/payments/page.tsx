'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowDownLeft,
  CheckCircle2,
  AlertTriangle,
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
  currentBalanceBDT: number;
}

interface FinancialAccount {
  _id: string;
  accountNo: string;
  accountName: string;
  balanceBDT: number;
}

export default function CustomerPaymentPage() {
  const searchParams = useSearchParams();
  const initialPartyId = searchParams.get('partyId') || '';
  const { t, formatNumber } = useI18n();

  const [parties, setParties] = useState<Party[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [partyId, setPartyId] = useState(initialPartyId);
  const [paymentAccountId, setPaymentAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, aRes] = await Promise.all([
          ApiClient.request('/currency/parties'),
          ApiClient.request('/currency/accounts'),
        ]);

        if (pRes.success && pRes.data) {
          setParties(pRes.data);
          if (!partyId && pRes.data.length > 0) {
            setPartyId(pRes.data[0]._id);
          }
        }
        if (aRes.success && aRes.data) {
          setAccounts(aRes.data);
          if (aRes.data.length > 0) {
            setPaymentAccountId(aRes.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    }
    loadData();
  }, []);

  const selectedParty = parties.find((p) => p._id === partyId);
  const selectedAccount = accounts.find((a) => a._id === paymentAccountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!partyId) {
      setErrorMsg('দয়া করে পার্টি নির্বাচন করুন।');
      return;
    }
    if (!paymentAccountId) {
      setErrorMsg('দয়া করে পরিশোধের অ্যাকাউন্ট নির্বাচন করুন।');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg('পরিশোধের পরিমাণ অবশ্যই ০ এর বেশি হতে হবে।');
      return;
    }

    try {
      setSubmitting(true);
      const res = await ApiClient.request('/currency/customer-payment', {
        method: 'POST',
        body: JSON.stringify({
          partyId,
          paymentAccountId,
          amount: Number(amount),
          notes,
        }),
      });

      if (res.success && res.data) {
        setSuccessResult(res.data);
      } else {
        setErrorMsg(res.message || 'পেমেন্ট ভাউচার পোস্ট করতে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="গ্রাহক পাওনা পরিশোধ (Customer Settlement Payment)"
        description="মুদ্রা সরবরাহকারী বা গ্রাহকের কাছে পূর্বে বাকিতে কেনা কারেন্সির পাওনা অর্থ নগদ বা ব্যাংক হিসাব থেকে পরিশোধ করুন।"
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            দায় নিষ্পত্তি (Payable Settlement)
          </span>
        }
      />

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successResult ? (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">পাওনা পরিশোধ সফলভাবে সম্পন্ন হয়েছে!</h2>
            <p className="text-xs text-slate-600 mt-1">
              পেমেন্ট ভাউচার নম্বর:{' '}
              <span className="font-mono font-bold text-blue-700">{successResult.voucherNo}</span>
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">পরিশোধিত অর্থ:</span>
              <span className="font-bold text-slate-900">৳ {Number(amount).toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">পার্টির নতুন জের:</span>
              <span className="font-bold text-emerald-700">
                ৳ {successResult.party?.currentBalanceBDT?.toLocaleString()} BDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">অ্যাকাউন্টের অবশিষ্ট স্থিতি:</span>
              <span className="font-bold text-blue-700">
                ৳ {successResult.account?.balanceBDT?.toLocaleString()} BDT
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
              আরেকটি পরিশোধ রেকর্ড করুন
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
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              প্রাপক গ্রাহক বা সরবরাহকারী (Party) *
            </label>
            <select
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
            >
              {parties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.partyNo} — {p.businessName ? `${p.businessName} (${p.name})` : p.name} (জের: ৳ {p.currentBalanceBDT.toLocaleString()} BDT)
                </option>
              ))}
            </select>
            {selectedParty && (
              <div className="mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-500">বর্তমান হিসাব স্থিতি:</span>
                <span
                  className={`font-mono font-bold ${
                    selectedParty.currentBalanceBDT < 0 ? 'text-rose-600' : 'text-slate-700'
                  }`}
                >
                  ৳ {selectedParty.currentBalanceBDT.toLocaleString()} BDT{' '}
                  {selectedParty.currentBalanceBDT < 0 ? '(আমাদের কাছে পাওনা)' : ''}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              পরিশোধের উৎস অ্যাকাউন্ট (Payment Account) *
            </label>
            <select
              value={paymentAccountId}
              onChange={(e) => setPaymentAccountId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
            >
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.accountName} (ব্যালেন্স: ৳ {a.balanceBDT.toLocaleString()} BDT)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              পরিশোধের পরিমাণ (Payment Amount BDT) *
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
            {selectedParty && selectedParty.currentBalanceBDT < 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(Math.abs(selectedParty.currentBalanceBDT)))}
                className="text-[11px] text-blue-600 font-semibold hover:underline mt-1"
              >
                সম্পূর্ণ বকেয়া পাওনা নির্ধারণ করুন (৳ {Math.abs(selectedParty.currentBalanceBDT).toLocaleString()})
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              বিবরণ বা চেক/রেফারেন্স নম্বর (Notes)
            </label>
            <input
              type="text"
              placeholder="যেমন: নগদ পরিশোধ, চেক নম্বর ইত্যাদি"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{submitting ? 'প্রসেসিং হচ্ছে...' : 'পেমেন্ট নিশ্চিত ও নিষ্পত্তি করুন (Execute Payment)'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
