'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  RefreshCw,
  Coins,
  Building,
  TrendingDown,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface BusinessExpense {
  _id: string;
  expenseNo: string;
  category: string;
  amountBDT: any;
  paymentAccountName?: string;
  payeeName?: string;
  notes?: string;
  createdAt: string;
}

interface FinancialAccount {
  _id: string;
  accountNo: string;
  accountName: string;
  balanceBDT: any;
}

export default function BusinessExpensesPage() {
  const { formatNumber } = useI18n();
  const [expenses, setExpenses] = useState<BusinessExpense[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Expense Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('RENT');
  const [paymentAccountId, setPaymentAccountId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [payeeName, setPayeeName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchExpensesAndAccounts = async () => {
    try {
      setLoading(true);
      const [expRes, accRes] = await Promise.all([
        ApiClient.request('/currency/expenses'),
        ApiClient.request('/currency/accounts'),
      ]);

      if (expRes.success && Array.isArray(expRes.data)) {
        setExpenses(expRes.data);
      }
      if (accRes.success && Array.isArray(accRes.data)) {
        setAccounts(accRes.data);
        if (accRes.data.length > 0) {
          setPaymentAccountId(accRes.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesAndAccounts();
  }, []);

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setModalError('খরচের পরিমাণ ০ এর বেশি হতে হবে।');
      return;
    }

    setSaving(true);
    try {
      const res = await ApiClient.request('/currency/expense', {
        method: 'POST',
        body: JSON.stringify({
          category,
          paymentAccountId,
          amount,
          payeeName,
          notes,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setAmount('');
        setPayeeName('');
        setNotes('');
        fetchExpensesAndAccounts();
      } else {
        setModalError(res.message || 'ব্যয় রেকর্ড করা সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setModalError(err.message || 'Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  const totalExpensesBDT = expenses.reduce((sum, e) => sum + getDecVal(e.amountBDT), 0);
  const rentExpensesBDT = expenses
    .filter((e) => e.category === 'RENT')
    .reduce((sum, e) => sum + getDecVal(e.amountBDT), 0);
  const salaryExpensesBDT = expenses
    .filter((e) => e.category === 'SALARY')
    .reduce((sum, e) => sum + getDecVal(e.amountBDT), 0);

  const columns: Column<BusinessExpense>[] = [
    {
      header: 'Voucher No / ভাউচার',
      accessorKey: 'expenseNo',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs">{item.expenseNo}</span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Category / ব্যয়ের খাত',
      accessorKey: 'category',
      cell: (item) => (
        <span className="font-semibold text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
          {item.category === 'RENT'
            ? 'অফিস ভাড়া'
            : item.category === 'SALARY'
            ? 'কর্মচারী বেতন'
            : item.category === 'UTILITIES'
            ? 'বিদ্যুৎ ও সেবা'
            : item.category === 'INTERNET'
            ? 'ইন্টারনেট বিল'
            : item.category === 'STATIONERY'
            ? 'স্টেশনারি ও পেপার'
            : item.category === 'ENTERTAINMENT'
            ? 'আপ্যায়ন ও রিফ্রেশমেন্ট'
            : item.category === 'COURIER'
            ? 'কুরিয়ার ও পরিবহন'
            : item.category === 'LICENSE_FEES'
            ? 'লাইসেন্স ও ফি'
            : item.category}
        </span>
      ),
    },
    {
      header: 'Amount / পরিমাণ (BDT)',
      accessorKey: 'amountBDT',
      cell: (item) => (
        <span className="font-mono font-bold text-xs text-rose-600">
          ৳ {formatNumber(getDecVal(item.amountBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))} BDT
        </span>
      ),
    },
    {
      header: 'Payment Account / পরিশোধ হিসাব',
      accessorKey: 'paymentAccountName',
      cell: (item) => <span className="text-xs text-slate-700 font-medium">{item.paymentAccountName || 'নগদ ক্যাশ'}</span>,
    },
    {
      header: 'Payee / প্রাপক',
      accessorKey: 'payeeName',
      cell: (item) => <span className="text-xs text-slate-800 font-semibold">{item.payeeName || '—'}</span>,
    },
    {
      header: 'Remarks / মন্তব্য',
      accessorKey: 'notes',
      cell: (item) => <span className="text-xs text-slate-500">{item.notes || '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ব্যবসায়িক পরিচালন ব্যয় (Business Operating Expenses)"
        description="মানি এক্সচেঞ্জ ব্যবসার দৈনন্দিন পরিচালন খরচ, বেতন, অফিস ভাড়া এবং ইউটিলিটি ব্যয়ের হিসাব।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchExpensesAndAccounts}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <button
              onClick={() => {
                setModalError(null);
                setShowModal(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ব্যয় রেকর্ড করুন</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="মোট পরিচালন ব্যয় (Total Expenses BDT)"
          value={`৳ ${formatNumber(totalExpensesBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="সর্বমোট ব্যবসায়িক ব্যয়"
          icon={TrendingDown}
        />
        <StatCard
          title="অফিস ও শাখা ভাড়া (Office Rent)"
          value={`৳ ${formatNumber(rentExpensesBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="স্থাপনা ও আউটলেট ভাড়া"
          icon={Building}
        />
        <StatCard
          title="বেতন ও পারিশ্রমিক (Salaries)"
          value={`৳ ${formatNumber(salaryExpensesBDT.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="কর্মকর্তা ও স্টাফ বেতন"
          icon={CreditCard}
        />
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        loading={loading}
        emptyMessage="কোনো ব্যয়ের হিসাব পাওয়া যায়নি।"
      />

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">ব্যয় এন্ট্রি (Record Business Expense)</h3>

            {modalError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ব্যয়ের খাত (Expense Category) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  <option value="RENT">অফিস / কাউন্টার ভাড়া (Office Rent)</option>
                  <option value="SALARY">কর্মচারী বেতন (Staff Salary)</option>
                  <option value="UTILITIES">বিদ্যুৎ ও গ্যাস বিল (Utilities)</option>
                  <option value="INTERNET">ইন্টারনেট ও টেলিফোন (Internet)</option>
                  <option value="STATIONERY">স্টেশনারি ও প্রিন্টিং (Stationery)</option>
                  <option value="ENTERTAINMENT">আপ্যায়ন ও রিফ্রেশমেন্ট (Entertainment)</option>
                  <option value="COURIER">কুরিয়ার ও পরিবহন (Courier/Transport)</option>
                  <option value="LICENSE_FEES">ট্রেড লাইসেন্স ও অনুমোদন ফি (License)</option>
                  <option value="OTHER">অন্যান্য ব্যয় (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  পরিশোধের উৎস অ্যাকাউন্ট (Payment Account) *
                </label>
                <select
                  value={paymentAccountId}
                  onChange={(e) => setPaymentAccountId(e.target.value)}
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
                  ব্যয়ের পরিমাণ (Amount BDT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  placeholder="যেমন: 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  প্রাপকের নাম (Payee / Vendor Name)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: বাড়িওয়ালা, সেবা প্রদানকারী..."
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  বিবরণ বা ভাউচার নোট (Notes)
                </label>
                <input
                  type="text"
                  placeholder="খরচের বিস্তারিত..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'ব্যয় পোস্ট করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
