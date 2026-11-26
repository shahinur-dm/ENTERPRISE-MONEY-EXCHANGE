'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
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

export default function DealersPage() {
  const { formatNumber } = useI18n();
  const [dealers, setDealers] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Dealer Modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.request('/currency/parties');
      if (res.success && Array.isArray(res.data)) {
        const filtered = res.data.filter(
          (p: Party) => p.partyType === 'DEALER' || p.partyType === 'BOTH'
        );
        setDealers(filtered);
      }
    } catch (err) {
      console.error('Error fetching dealers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const handleCreateDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    try {
      const res = await ApiClient.request('/currency/parties', {
        method: 'POST',
        body: JSON.stringify({
          partyType: 'DEALER',
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
        fetchDealers();
      } else {
        setModalError(res.message || 'ডিলার সংরক্ষণ করা যায়নি');
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

  const filteredDealers = dealers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.businessName && p.businessName.toLowerCase().includes(search.toLowerCase())) ||
      p.phone.includes(search) ||
      p.partyNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceivables = dealers
    .filter((p) => getDecVal(p.currentBalanceBDT) > 0)
    .reduce((sum, p) => sum + getDecVal(p.currentBalanceBDT), 0);

  const totalPayables = dealers
    .filter((p) => getDecVal(p.currentBalanceBDT) < 0)
    .reduce((sum, p) => sum + Math.abs(getDecVal(p.currentBalanceBDT)), 0);

  const columns: Column<Party>[] = [
    {
      header: 'Dealer Code / কোড',
      accessorKey: 'partyNo',
      cell: (item) => <span className="font-mono font-bold text-slate-900 text-xs">{item.partyNo}</span>,
    },
    {
      header: 'Dealer / Business Name',
      accessorKey: 'businessName',
      cell: (item) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs block">
            {item.businessName || item.name}
          </span>
          {item.businessName && <span className="text-[11px] text-slate-500">প্রতিনিধি: {item.name}</span>}
        </div>
      ),
    },
    {
      header: 'Contact / যোগাযোগ',
      accessorKey: 'phone',
      cell: (item) => <span className="font-mono text-xs text-slate-700">{item.phone}</span>,
    },
    {
      header: 'Current Balance / চলতি ব্যালেন্স (BDT)',
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
      header: 'Total Wholesale Sold / মোট সরবরাহ',
      accessorKey: 'totalSoldBDT',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-800">
          ৳ {formatNumber(getDecVal(item.totalSoldBDT).toLocaleString(undefined, { minimumFractionDigits: 2 }))}
        </span>
      ),
    },
    {
      header: 'Total Acquired / মোট ক্রয়',
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
        title="পাইকারি ডিলার ও বায়ার নেটওয়ার্ক (Wholesale Currency Dealers)"
        description="বৈদেশিক মুদ্রা পাইকারি লেনদেনকারী ডিলার ও বায়ারদের তালিকা, প্রদেয়-প্রাপ্য চলতি স্থিতি ও লেজার হিসাব।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchDealers}
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
              <span>নতুন ডিলার নিবন্ধন</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="নিবন্ধিত হোলসেল ডিলার"
          value={formatNumber(dealers.length)}
          subtitle="সক্রিয় কর্পোরেট বায়ার"
          icon={Briefcase}
        />
        <StatCard
          title="ডিলারদের কাছে পাওনা (Receivables)"
          value={`৳ ${formatNumber(totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="বকেয়া প্রাপ্য তহবিল"
          icon={ArrowUpRight}
        />
        <StatCard
          title="ডিলারদের কাছে দেনা (Payables)"
          value={`৳ ${formatNumber(totalPayables.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
          subtitle="অগ্রিম বা প্রদেয় টাকা"
          icon={ArrowDownLeft}
        />
        <StatCard
          title="ট্রেজারি পার্টনার"
          value="Institutional"
          subtitle="বৈধ মানি চেঞ্জার চ্যানেল"
          icon={ShieldCheck}
        />
      </div>

      <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="ডিলারের নাম, প্রতিষ্ঠানের নাম, মোবাইল বা কোড দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent font-medium"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredDealers}
        loading={loading}
        emptyMessage="কোনো ডিলারের তথ্য পাওয়া যায়নি।"
      />

      {/* Add Dealer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">নতুন পাইকারি ডিলার নিবন্ধন (New Dealer)</h3>

            {modalError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateDealer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    প্রতিষ্ঠানের নাম (Business / Exchange Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: আল-ফারহান মানি এক্সচেঞ্জ"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    যোগাযোগকারী ব্যক্তি (Contact Person) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ম্যানেজার বা স্বত্বাধিকারী..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    placeholder="dealer@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ব্যবসার ঠিকানা (Office Address)
                </label>
                <input
                  type="text"
                  placeholder="অফিস বা ব্রাঞ্চের ঠিকানা..."
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
                  ধণাত্মক = ডিলারের কাছে প্রাপ্য, ঋণাত্মক = ডিলারের প্রদেয় জামানত।
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
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'ডিলার সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
