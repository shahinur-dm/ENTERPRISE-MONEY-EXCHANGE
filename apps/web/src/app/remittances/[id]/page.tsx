'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Send,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  Printer,
  ArrowLeft,
  Scale,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

export default function RemittanceDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || 'REM-2026-98421';

  const remittance = {
    id,
    status: 'PAID_OUT',
    createdAt: '24 Nov 2026, 14:32 MYT',
    sourceAmount: '2,500.00 MYR',
    rate: '35.00 BDT/MYR',
    fee: '10.00 MYR',
    targetAmount: '87,500.00 BDT',
    sender: {
      name: 'Mohammad Rahim',
      phone: '+60 12-345 6789',
      passport: 'A9842103',
      nationality: 'Bangladeshi',
    },
    beneficiary: {
      name: 'Rokeya Begum',
      bank: 'Islami Bank Bangladesh PLC',
      branch: 'Motijheel Corporate Branch',
      accountNumber: '205011802938471',
    },
    journalVoucher: 'JV-2026-11-0084',
    branch: 'Kuala Lumpur Central (KUL-01)',
  };

  const timeline = [
    { title: 'Quote Created & Locked', time: '14:30 MYT', status: 'done', desc: '15-min price guarantee applied (35.00 BDT/MYR)' },
    { title: 'Funds Collected & Voucher Posted', time: '14:32 MYT', status: 'done', desc: 'Debited Cash Vault (1010), Credited Remittance Clearing (1040)' },
    { title: 'AML & Sanctions Screening Cleared', time: '14:33 MYT', status: 'done', desc: 'Zero PEP / OFAC matches detected' },
    { title: 'Dispatched to External Settlement Partner', time: '14:35 MYT', status: 'done', desc: 'BEFTN instant clearing dispatched' },
    { title: 'Beneficiary Payout Confirmed', time: '14:38 MYT', status: 'done', desc: 'Islami Bank Bangladesh confirmed credit to account' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/remittance"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Remittances</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print Settlement Voucher</span>
        </button>
      </div>

      <PageHeader
        title={`Remittance Voucher #${remittance.id}`}
        description="Official institutional cross-border settlement record and general ledger audit timeline."
        badge={<StatusBadge status={remittance.status} />}
      />

      {/* Main Voucher Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase font-mono">
              DAWAT MONEY SERVICES SDN BHD
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Cross-Border Settlement Receipt
            </h2>
            <div className="text-xs text-slate-400 mt-1">
              Issued at: {remittance.branch} • Ref: {remittance.id}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Payout Net Value</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-700">
              {remittance.targetAmount}
            </div>
          </div>
        </div>

        {/* Sender & Beneficiary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
            <div className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <User className="w-3.5 h-3.5 text-blue-600" /> Sender Information
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-400">Name:</span> <span className="font-semibold text-slate-800">{remittance.sender.name}</span></div>
              <div><span className="text-slate-400">Contact:</span> <span className="font-mono">{remittance.sender.phone}</span></div>
              <div><span className="text-slate-400">Passport:</span> <span className="font-mono">{remittance.sender.passport}</span></div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
            <div className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Beneficiary Details
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-400">Name:</span> <span className="font-semibold text-slate-800">{remittance.beneficiary.name}</span></div>
              <div><span className="text-slate-400">Bank:</span> <span className="font-semibold">{remittance.beneficiary.bank}</span></div>
              <div><span className="text-slate-400">Account:</span> <span className="font-mono">{remittance.beneficiary.accountNumber}</span></div>
            </div>
          </div>
        </div>

        {/* Settlement Financial Details */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
          <div className="font-bold text-slate-900 uppercase tracking-wider mb-2 text-[11px]">
            Financial Settlement Breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block text-[11px]">Collected Amount</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{remittance.sourceAmount}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Exchange Rate</span>
              <span className="font-bold font-mono text-blue-700 text-sm">{remittance.rate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Service Charge</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{remittance.fee}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">General Ledger Journal</span>
              <span className="font-bold font-mono text-indigo-700 text-sm">{remittance.journalVoucher}</span>
            </div>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Audit Lifecycle & Milestones
          </h3>
          <div className="space-y-3 border-l-2 border-emerald-400 pl-4 text-xs">
            {timeline.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{step.title}</span>
                  <span className="font-mono text-[10px] text-slate-400">{step.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
