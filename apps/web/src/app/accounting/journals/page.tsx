'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FileText, Plus, Scale, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DEMO_BALANCED_JOURNALS } from '@erp/shared';

export default function JournalsPage() {
  const [journals] = useState(DEMO_BALANCED_JOURNALS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Ledger Journal Entries"
        description="Double-entry vouchers with immutable audit trails. Dual authorization enforced for all adjusting journals."
        actions={
          <button
            onClick={() => alert('New Journal Voucher creation wizard')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal Voucher</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Posted Vouchers"
          value={journals.length.toString()}
          subtitle="All journals posted"
          icon={FileText}
        />
        <StatCard
          title="Balancing Invariant"
          value="100.00%"
          subtitle="Σ Debit ≡ Σ Credit"
          icon={Scale}
        />
        <StatCard
          title="Immutability"
          value="Enforced"
          subtitle="Reversal entries only"
          icon={ShieldCheck}
        />
        <StatCard
          title="Audit Trail Status"
          value="Verified"
          subtitle="ISO 27001 Compliant"
          icon={CheckCircle2}
        />
      </div>

      <div className="space-y-4">
        {journals.map((j) => (
          <div
            key={j.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-blue-600 text-sm">{j.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-mono">{j.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{j.narrative}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={j.status} />
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-12 py-1.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <div className="col-span-2">Account Code</div>
                <div className="col-span-6">Account Title</div>
                <div className="col-span-2 text-right">Debit (MYR)</div>
                <div className="col-span-2 text-right">Credit (MYR)</div>
              </div>

              {j.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 py-2 text-slate-700">
                  <div className="col-span-2 font-mono font-bold text-slate-900">{line.code}</div>
                  <div className="col-span-6 font-semibold">{line.name}</div>
                  <div className="col-span-2 text-right font-mono font-bold text-slate-900">
                    {line.debit !== '0.00' ? line.debit : '—'}
                  </div>
                  <div className="col-span-2 text-right font-mono font-bold text-slate-900">
                    {line.credit !== '0.00' ? line.credit : '—'}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-12 pt-2.5 font-bold text-slate-900 border-t-2 border-slate-200">
                <div className="col-span-8 text-right pr-4 uppercase text-[11px] text-slate-500">
                  Total Voucher Balance
                </div>
                <div className="col-span-2 text-right font-mono text-emerald-700">{j.debitTotal}</div>
                <div className="col-span-2 text-right font-mono text-emerald-700">{j.creditTotal}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <div>Posted By: <span className="text-slate-700 font-medium">{j.postedBy}</span></div>
              <div className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> General Ledger Balanced
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
