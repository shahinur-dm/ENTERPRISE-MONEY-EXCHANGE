'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Wallet,
  ArrowRightLeft,
  Plus,
  RefreshCw,
  Coins,
  ShieldCheck,
  AlertCircle,
  Landmark,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface FinancialAccount {
  _id: string;
  accountNo: string;
  accountName: string;
  accountType: string;
  currency: string;
  balanceBDT: any;
  bankName?: string;
  accountNumber?: string;
  branchName?: string;
  isDefaultDisbursement: boolean;
  isDefaultReceipt: boolean;
  status: string;
}

export default function FinancialAccountsPage() {
  const { formatNumber } = useI18n();
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Transfer Modal
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [fromAccountId, setFromAccountId] = useState<string>('');
  const [toAccountId, setToAccountId] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferNotes, setTransferNotes] = useState<string>('');
  const [transferLoading, setTransferLoading] = useState<boolean>(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.request('/currency/accounts');
      if (res.success && Array.isArray(res.data)) {
        setAccounts(res.data);
        if (res.data.length >= 2) {
          setFromAccountId(res.data[0]._id);
          setToAccountId(res.data[1]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching financial accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const totalLiquidityBDT = accounts.reduce((sum, a) => sum + getDecVal(a.balanceBDT), 0);
  const totalCashBDT = accounts
    .filter((a) => a.accountType === 'COUNTER_CASH' || a.accountType === 'VAULT')
    .reduce((sum, a) => sum + getDecVal(a.balanceBDT), 0);
  const totalBankBDT = accounts
    .filter((a) => a.accountType === 'BANK')
    .reduce((sum, a) => sum + getDecVal(a.balanceBDT), 0);

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (fromAccountId === toAccountId) {
      setTransferError('উৎস এবং গন্তব্য অ্যাকাউন্ট ভিন্ন হতে হবে।');
      return;
    }

    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) {
      setTransferError('স্থানান্তরের পরিমাণ ০ এর বেশি হতে হবে।');
      return;
    }

    setTransferLoading(true);
    try {
      const res = await ApiClient.request('/currency/transfer', {
        method: 'POST',
        body: JSON.stringify({
          fromAccountId,
          toAccountId,
          amount: transferAmount,
          notes: transferNotes,
        }),
      });

      if (res.success) {
        setShowTransferModal(false);
        setTransferAmount('');
        setTransferNotes('');
        fetchAccounts();
      } else {
        setTransferError(res.message || 'স্থানান্তর প্রক্রিয়া সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      setTransferError(err.message || 'Network error occurred');
    } finally {
      setTransferLoading(false);
    }
  };

  const columns: Column<FinancialAccount>[] = [
    {
      header: 'Account No / হিসাব নম্বর',
      accessorKey: 'accountNo',
      cell: (item) => <span className="font-mono font-bold text-slate-900 text-xs">{item.accountNo}</span>,
    },
    {
      header: 'Account Name / নাম',
      accessorKey: 'accountName',
      cell: (item) => (
        <div className="flex items-center space-x-2">
          {item.accountType === 'BANK' ? (
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          ) : (
            <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <div>
            <span className="font-bold text-slate-900 text-xs block">{item.accountName}</span>
            {item.bankName && (
              <span className="text-[11px] text-slate-500 block">
                {item.bankName} - {item.accountNumber} ({item.branchName})
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Type / ধরন',
      accessorKey: 'accountType',
      cell: (item) => (
        <span className="font-semibold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
          {item.accountType === 'COUNTER_CASH'
            ? 'কাউন্টার ক্যাশ'
            : item.accountType === 'VAULT'
            ? 'ভল্ট ক্যাশ'
            : 'বাণিজ্যিক ব্যাংক'}
        </span>
      ),
    },
    {
      header: 'Current Balance (BDT) / স্থিতি',
      accessorKey: 'balanceBDT',
      cell: (item) => {
        const bal = getDecVal(item.balanceBDT);
        return (
          <span className="font-mono font-bold text-slate-900 text-sm">
            ৳ {formatNumber(bal.toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
          </span>
        );
      },
    },
    {
      header: 'Role / ব্যবহার',
      accessorKey: 'isDefaultDisbursement',
      cell: (item) => (
        <div className="flex space-x-1">
          {item.isDefaultReceipt && (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
              ডিফল্ট প্রাপ্তি
            </span>
          )}
          {item.isDefaultDisbursement && (
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
              ডিফল্ট প্রদান
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions / পদক্ষেপ',
      accessorKey: '_id',
      cell: (item) => (
        <button
          onClick={() => {
            setFromAccountId(item._id);
            setTransferError(null);
            setShowTransferModal(true);
          }}
          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-slate-200"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>তহবিল স্থানান্তর</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="নগদ ও ব্যাংক হিসাব ব্যবস্থাপনা (Cash & Bank Accounts)"
        description="কাউন্টার ক্যাশ ড্রয়ার, সেন্ট্রাল ভল্ট এবং বাণিজ্যিক ব্যাংক হিসাবের স্থিতি ট্র্যাকিং ও আন্তঃঅ্যাকাউন্ট স্থানান্তর।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAccounts}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <button
              onClick={() => {
                setTransferError(null);
                setShowTransferModal(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>আন্তঃঅ্যাকাউন্ট স্থানান্তর</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="মোট স্থানীয় তারল্য (Total Liquidity BDT)"
          value={`৳ ${formatNumber(totalLiquidityBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="সকল ক্যাশ ও ব্যাংক হিসাবের যোগফল"
          icon={Coins}
        />
        <StatCard
          title="মোট নগদ তহবিল (Cash & Vault BDT)"
          value={`৳ ${formatNumber(totalCashBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="কাউন্টার ড্রয়ার ও সেন্ট্রাল ভল্ট"
          icon={Wallet}
        />
        <StatCard
          title="মোট ব্যাংক ব্যালেন্স (Commercial Banks BDT)"
          value={`৳ ${formatNumber(totalBankBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="ক্লিয়ারিং ও অপারেটিং ব্যাংক হিসাব"
          icon={Landmark}
        />
      </div>

      <DataTable
        columns={columns}
        data={accounts}
        loading={loading}
        emptyMessage="কোনো আর্থিক হিসাব পাওয়া যায়নি।"
      />

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">আন্তঃঅ্যাকাউন্ট তহবিল স্থানান্তর (Inter-Account Transfer)</h3>

            {transferError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{transferError}</span>
              </div>
            )}

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  উৎস অ্যাকাউন্ট (From Account) *
                </label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.accountName} (ব্যালেন্স: ৳{getDecVal(a.balanceBDT).toLocaleString()} BDT)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  গন্তব্য অ্যাকাউন্ট (To Account) *
                </label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.accountName} (ব্যালেন্স: ৳{getDecVal(a.balanceBDT).toLocaleString()} BDT)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  স্থানান্তরের পরিমাণ (Amount BDT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  placeholder="যেমন: 25000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  মন্তব্য বা বিবরণ (Notes)
                </label>
                <input
                  type="text"
                  placeholder="কাউন্টার ক্যাশ ভল্টে জমা, ব্যাংক উত্তোলন ইত্যাদি..."
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={transferLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  {transferLoading ? 'স্থানান্তর হচ্ছে...' : 'স্থানান্তর সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
