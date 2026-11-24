'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Clock,
  Send,
  Coins,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const params = useParams();
  const id = (params?.id as string) || 'CUST-001';

  const customer = {
    id,
    name: 'Mohammad Rahim',
    phone: '+60 12-345 6789',
    email: 'm.rahim@gmail.com',
    nationality: 'Bangladeshi',
    kycTier: 'Tier 2 (Standard Remittance)',
    kycStatus: 'verified',
    idType: 'Passport',
    idNumber: 'A9842103',
    idExpiry: '2028-09-15',
    address: 'No 45, Jalan Ampang, 50450 Kuala Lumpur',
    totalRemitted: '45,800.00 MYR',
    totalExchanged: '12,000.00 MYR',
    joinedDate: '15 Jan 2025',
  };

  const recentTransactions = [
    { id: 'REM-2026-98421', type: 'Remittance', date: '24 Nov 2026', amount: '2,500.00 MYR', target: '87,500.00 BDT', status: 'PAID_OUT' },
    { id: 'FXS-2026-1049', type: 'FX Purchase', date: '10 Nov 2026', amount: '1,200.00 MYR', target: 'USD 250.00', status: 'COMPLETED' },
    { id: 'REM-2026-91024', type: 'Remittance', date: '01 Nov 2026', amount: '5,000.00 MYR', target: '175,000.00 BDT', status: 'PAID_OUT' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/customers"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Customer Directory</span>
      </Link>

      <PageHeader
        title={`Customer 360 Profile • ${customer.name}`}
        description="Comprehensive KYC verification, sanctions clearance, and historical transaction ledger."
        badge={<StatusBadge status={customer.kycStatus} />}
      />

      {/* Customer Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shadow-xs">
              {customer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-blue-600">{customer.id}</span>
                <span className="font-bold text-slate-900 text-base">{customer.name}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{customer.kycTier}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Sanctions Screening: Clear
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
            <span className="text-slate-400 block font-medium">Contact Phone</span>
            <span className="font-mono font-bold text-slate-900">{customer.phone}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
            <span className="text-slate-400 block font-medium">Identity Document</span>
            <span className="font-mono font-bold text-slate-900">{customer.idType}: {customer.idNumber}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
            <span className="text-slate-400 block font-medium">Document Expiry</span>
            <span className="font-mono font-bold text-slate-900">{customer.idExpiry}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-1 sm:col-span-2">
            <span className="text-slate-400 block font-medium">Residential Address</span>
            <span className="font-semibold text-slate-800">{customer.address}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
            <span className="text-slate-400 block font-medium">Lifetime Remittances</span>
            <span className="font-mono font-bold text-emerald-700">{customer.totalRemitted}</span>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Recent Transactions Ledger
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900">{tx.id}</span>
                    <span className="font-semibold text-slate-600">({tx.type})</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{tx.date}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="font-mono font-bold text-slate-900">{tx.amount} → {tx.target}</div>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
