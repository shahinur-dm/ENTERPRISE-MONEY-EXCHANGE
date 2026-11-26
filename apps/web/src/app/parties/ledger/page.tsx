'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Calendar,
  User,
  Phone,
  RefreshCw,
  Wallet,
  ShieldCheck,
  Building,
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
  address?: string;
  currentBalanceBDT: any;
  totalPurchasedBDT: any;
  totalSoldBDT: any;
  advanceBalanceBDT: any;
}

interface LedgerEntry {
  _id: string;
  transactionDate: string;
  voucherNo: string;
  transactionType: string;
  currencyCode?: string;
  foreignCurrencyAmount?: any;
  conversionRate?: any;
  debitBDT: any;
  creditBDT: any;
  runningBalanceBDT: any;
  notes?: string;
}

export default function PartyLedgerPage() {
  const searchParams = useSearchParams();
  const urlPartyId = searchParams.get('partyId');
  const { formatNumber } = useI18n();

  const [parties, setParties] = useState<Party[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState<string>('');
  const [partyDetail, setPartyDetail] = useState<Party | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all parties
  useEffect(() => {
    ApiClient.request('/currency/parties').then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setParties(res.data);
        const match = urlPartyId && res.data.some((p: Party) => p._id === urlPartyId);
        const initialId = match ? urlPartyId! : res.data[0]._id;
        setSelectedPartyId(initialId);
      } else {
        setLoading(false);
      }
    });
  }, [urlPartyId]);

  // Fetch ledger when party selection changes
  useEffect(() => {
    if (!selectedPartyId) return;

    setLoading(true);
    Promise.all([
      ApiClient.request(`/currency/parties/${selectedPartyId}`),
      ApiClient.request(`/currency/parties/${selectedPartyId}/ledger`),
    ])
      .then(([partyRes, ledgerRes]) => {
        if (partyRes.success && partyRes.data) {
          setPartyDetail(partyRes.data);
        }
        if (ledgerRes.success && Array.isArray(ledgerRes.data)) {
          setEntries(ledgerRes.data);
        } else {
          setEntries([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching party ledger:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedPartyId]);

  const getDecVal = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return parseFloat(String(val)) || 0;
  };

  const currentBal = getDecVal(partyDetail?.currentBalanceBDT);
  const totalPurchased = getDecVal(partyDetail?.totalPurchasedBDT);
  const totalSold = getDecVal(partyDetail?.totalSoldBDT);

  const columns: Column<LedgerEntry>[] = [
    {
      header: 'Date & Time / তারিখ',
      accessorKey: 'transactionDate',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-700">
          {item.transactionDate ? new Date(item.transactionDate).toLocaleString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Voucher Ref / ভাউচার',
      accessorKey: 'voucherNo',
      cell: (item) => (
        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {item.voucherNo}
        </span>
      ),
    },
    {
      header: 'Type / লেনদেন বিবরণী',
      accessorKey: 'transactionType',
      cell: (item) => {
        const fcAmt = getDecVal(item.foreignCurrencyAmount);
        const rate = getDecVal(item.conversionRate);
        return (
          <div>
            <span className="font-semibold text-slate-900 text-xs block">{item.transactionType}</span>
            {item.currencyCode && fcAmt > 0 && (
              <span className="text-[11px] text-slate-500 font-mono">
                {formatNumber(fcAmt.toLocaleString())} {item.currencyCode} @ ৳{formatNumber(rate.toFixed(4))}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Debit (Dr) / প্রাপ্য বৃদ্ধি',
      accessorKey: 'debitBDT',
      cell: (item) => {
        const d = getDecVal(item.debitBDT);
        return d > 0 ? (
          <span className="font-mono font-bold text-xs text-slate-900">
            ৳ {formatNumber(d.toLocaleString(undefined, { minimumFractionDigits: 2 }))}
          </span>
        ) : (
          <span className="text-slate-300 font-mono text-xs">—</span>
        );
      },
    },
    {
      header: 'Credit (Cr) / প্রদেয় বৃদ্ধি/জমা',
      accessorKey: 'creditBDT',
      cell: (item) => {
        const c = getDecVal(item.creditBDT);
        return c > 0 ? (
          <span className="font-mono font-bold text-xs text-emerald-700">
            ৳ {formatNumber(c.toLocaleString(undefined, { minimumFractionDigits: 2 }))}
          </span>
        ) : (
          <span className="text-slate-300 font-mono text-xs">—</span>
        );
      },
    },
    {
      header: 'Running Balance / চলতি জের',
      accessorKey: 'runningBalanceBDT',
      cell: (item) => {
        const b = getDecVal(item.runningBalanceBDT);
        return (
          <div className="font-mono text-xs">
            {b > 0 && (
              <span className="font-bold text-emerald-700">
                ৳ +{formatNumber(b.toLocaleString(undefined, { minimumFractionDigits: 2 }))} (Dr)
              </span>
            )}
            {b < 0 && (
              <span className="font-bold text-rose-600">
                ৳ -{formatNumber(Math.abs(b).toLocaleString(undefined, { minimumFractionDigits: 2 }))} (Cr)
              </span>
            )}
            {b === 0 && <span className="text-slate-400">৳ 0.00</span>}
          </div>
        );
      },
    },
    {
      header: 'Notes / মন্তব্য',
      accessorKey: 'notes',
      cell: (item) => <span className="text-xs text-slate-500">{item.notes || '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="পার্টি হিসাব খতিয়ান (Party Running Ledger Statement)"
        description="গ্রাহক বা ডিলারের সম্পূর্ণ ডেবিট-ক্রেডিট হিসাব, কারেন্সি ট্রানজেকশন রেফারেন্স এবং চলমান স্থিতির স্টেটমেন্ট।"
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (selectedPartyId) {
                  setLoading(true);
                  ApiClient.request(`/currency/parties/${selectedPartyId}/ledger`).then((res) => {
                    if (res.success && Array.isArray(res.data)) setEntries(res.data);
                    setLoading(false);
                  });
                }
              }}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>স্টেটমেন্ট প্রিন্ট</span>
            </button>
          </div>
        }
      />

      {/* Party Selector Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">পার্টি নির্বাচন করুন:</label>
          <select
            value={selectedPartyId}
            onChange={(e) => setSelectedPartyId(e.target.value)}
            className="w-full sm:w-80 rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
          >
            {parties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.businessName ? `${p.businessName} (${p.name})` : p.name} [{p.partyType}] - {p.partyNo}
              </option>
            ))}
          </select>
        </div>

        {partyDetail && (
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <Link
              href={`/financials/payments?partyId=${partyDetail._id}`}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>পাওনা পরিশোধ (Customer Payment)</span>
            </Link>
            <Link
              href={`/financials/receipts?partyId=${partyDetail._id}`}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>জমা গ্রহণ (Buyer Receipt)</span>
            </Link>
          </div>
        )}
      </div>

      {/* Party Summary Details */}
      {partyDetail && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center space-x-2 text-blue-600">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">পার্টির পরিচয়</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-1">
              {partyDetail.businessName || partyDetail.name}
            </h4>
            <p className="text-xs text-slate-600">আইডি: {partyDetail.partyNo} | {partyDetail.phone}</p>
            {partyDetail.address && <p className="text-[11px] text-slate-400">{partyDetail.address}</p>}
          </div>

          <StatCard
            title="বর্তমান চলতি স্থিতি (Balance)"
            value={`৳ ${formatNumber(Math.abs(currentBal).toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
            subtitle={
              currentBal > 0
                ? 'Dr — পার্টির কাছে প্রাপ্য (Receivable)'
                : currentBal < 0
                ? 'Cr — পার্টিকে প্রদেয় (Payable)'
                : 'ব্যালেন্স সম্পূর্ণ পরিশোধিত'
            }
            icon={Wallet}
          />

          <StatCard
            title="মোট বিক্রয় ভলিউম (Turnover)"
            value={`৳ ${formatNumber(totalSold.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
            subtitle="এই পার্টির কাছে বিক্রিত মুদ্রা"
            icon={ArrowUpRight}
          />

          <StatCard
            title="মোট ক্রয় ভলিউম (Purchases)"
            value={`৳ ${formatNumber(totalPurchased.toLocaleString(undefined, { minimumFractionDigits: 2 }))}`}
            subtitle="এই পার্টির কাছ থেকে কেনা মুদ্রা"
            icon={ArrowDownLeft}
          />
        </div>
      )}

      {/* Ledger Table */}
      <DataTable
        columns={columns}
        data={entries}
        loading={loading}
        emptyMessage="এই পার্টির কোনো লেজার লেনদেন রেকর্ড নেই।"
      />
    </div>
  );
}
