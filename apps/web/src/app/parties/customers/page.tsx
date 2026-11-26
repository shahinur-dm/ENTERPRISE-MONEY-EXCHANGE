'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ApiClient } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';

interface Party {
  _id: string;
  partyNo: string;
  partyType: string;
  name: string;
  businessName?: string;
  phone: string;
  email?: string;
  currentBalanceBDT: any;
  totalPurchasedBDT: any;
  totalSoldBDT: any;
  createdAt: string;
}

export default function CustomersPage() {
  const { formatNumber } = useI18n();
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Party Modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.request('/currency/parties');
      if (res.success && Array.isArray(res.data)) {
        // Filter customers or both
        const filtered = res.data.filter(
          (p: Party) => p.partyType === 'CUSTOMER' || p.partyType === 'BOTH'
        );
        setParties(filtered);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    try {
      const res = await ApiClient.request('/currency/parties', {
        method: 'POST',
        body: JSON.stringify({
          partyType: 'CUSTOMER',
          name,
          businessName,
          phone,
          email,
          address,
          openingBalanceBDT: openingBalance,
        }),
      });

      if (res.success) {
        setShowModal(false);
        setName('');
        setBusinessName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setOpeningBalance('0');
        fetchCustomers();
      } else {
        setModalError(res.message || 'গ্রাহক সংরক্ষণ করা যায়নি');
      }
    } catch (err: any) {
      setModalError(err.message || 'Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const filteredParties = parties.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.businessName && p.businessName.toLowerCase().includes(search.toLowerCase())) ||
      p.phone.includes(search) ||
      p.partyNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceivables = parties
    .filter((p) => getDecVal(p.currentBalanceBDT) > 0)
    .reduce((sum, p) => sum + getDecVal(p.currentBalanceBDT), 0);

  const totalPayables = parties
    .filter((p) => getDecVal(p.currentBalanceBDT) < 0)
    .reduce((sum, p) => sum + Math.abs(getDecVal(p.currentBalanceBDT)), 0);

  const columns: Column<Party>[] = [
    {
      header: 'Party No / আইডি',
      accessorKey: 'partyNo',
      cell: (item) => <span className="font-mono font-bold text-slate-900 text-xs">{item.partyNo}</span>,
    },
    {
      header: 'Customer Name / নাম',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs block">{item.name}</span>
          {item.businessName && <span className="text-[11px] text-slate-500">{item.businessName}</span>}
        </div>
      ),
    },
    {
      header: 'Phone / যোগাযোগ',
      accessorKey: 'phone',
      cell: (item) => <span className="font-mono text-xs text-slate-700">{item.phone}</span>,
    },
    {
      header: 'Current Balance / বর্তমান স্থিতি (BDT)',
      accessorKey: 'currentBalanceBDT',
      cell: (item) => {
        const bal = getDecVal(item.currentBalanceBDT);
        return (
          <div className="font-mono text-xs">
            {bal > 0 && (
              <span className="text-emerald-700 font-bold">
                ৳ +{formatNumber(bal.toLocaleString(undefined, { minimumFractionDigits: 2 }))} (প্রাপ্য/Receivable)
              </span>
            )}
            {bal < 0 && (
              <span className="text-rose-600 font-bold">
                ৳ -{formatNumber(Math.abs(bal).toLocaleString(undefined, { minimumFractionDigits: 2 }))} (প্রদেয়/Payable)
              </span>
            )}
            {bal === 0 && <span className="text-slate-400 font-medium">৳ 0.00 (পরিশোধিত)</span>}
          </div>
        );
      },
    },
    {
      header: 'Total Sold to Party / মোট বিক্রয়',
      accessorKey: 'totalSoldBDT',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-800">
          ৳ {formatNumber(getDecVal(item.totalSoldBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))}
        </span>
      ),
    },
    {
      header: 'Total Purchased / মোট ক্রয়',
      accessorKey: 'totalPurchasedBDT',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-800">
          ৳ {formatNumber(getDecVal(item.totalPurchasedBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))}
        </span>
      ),
    },
    {
      header: 'Actions / পদক্ষেপ',
      accessorKey: '_id',
      cell: (item) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/parties/ledger?partyId=${item._id}`}
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-slate-200 transition-all"
          >
            <BookOpen className="w-3 h-3" />
            <span>খতিয়ান (Ledger)</span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="গ্রাহক ব্যবস্থাপনা (Customer Management)"
        description="মানি এক্সচেঞ্জ ও কারেন্সি ট্রেডিংয়ের নিবন্ধিত ও কাউন্টার গ্রাহকদের তালিকা, লেনদেন ইতিহাস এবং প্রদেয়-প্রাপ্য খতিয়ান।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchCustomers}
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
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন গ্রাহক নিবন্ধন</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="মোট নিবন্ধিত গ্রাহক"
          value={formatNumber(parties.length)}
          subtitle="সক্রিয় গ্রাহক সংখ্যা"
          icon={Users}
        />
        <StatCard
          title="মোট বকেয়া প্রাপ্য (Receivables)"
          value={`৳ ${formatNumber(totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="গ্রাহকদের কাছে পাওনা"
          icon={ArrowUpRight}
        />
        <StatCard
          title="মোট প্রদেয় বাকি (Payables)"
          value={`৳ ${formatNumber(totalPayables.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="গ্রাহকদের কাছে দেনা"
          icon={ArrowDownLeft}
        />
        <StatCard
          title="কেওয়াইসি ভেরিফায়েড"
          value="100% Compliant"
          subtitle="বাংলাদেশ ব্যাংক নীতিমালা"
          icon={ShieldCheck}
        />
      </div>

      <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="গ্রাহকের নাম, মোবাইল নম্বর বা পার্টি আইডি দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent font-medium"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredParties}
        loading={loading}
        emptyMessage="কোনো গ্রাহকের তথ্য পাওয়া যায়নি।"
      />

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">নতুন গ্রাহক যোগ করুন (New Customer Registration)</h3>

            {modalError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    গ্রাহকের নাম (Customer Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="নাম লিখুন..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    প্রতিষ্ঠানের নাম (Business Name)
                  </label>
                  <input
                    type="text"
                    placeholder="কোম্পানির নাম (যদি থাকে)..."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    মোবাইল নম্বর (Phone) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ইমেইল (Email)
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ঠিকানা (Address)
                </label>
                <input
                  type="text"
                  placeholder="ঠিকানা লিখুন..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  প্রারম্ভিক জের (Opening Balance BDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs font-mono font-bold outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  ধণাত্মক সংখ্যা প্রাপ্য (Receivable), ঋণাত্মক সংখ্যা প্রদেয় (Payable) বোঝায়।
                </span>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'গ্রাহক সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
