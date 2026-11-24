'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Send, Plus, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import { DEMO_REMITTANCES, DemoRemittance } from '@erp/shared';

export default function RemittancePage() {
  const [remittances] = useState<DemoRemittance[]>(DEMO_REMITTANCES);

  const columns: Column<DemoRemittance>[] = [
    {
      header: 'Remittance Ref',
      accessorKey: 'id',
      cell: (item) => (
        <Link href={`/remittances/${item.id}`} className="group block">
          <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
            <span>{item.id}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">{item.date}</span>
        </Link>
      ),
    },
    {
      header: 'Sender Details',
      accessorKey: 'senderName',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-800">{item.senderName}</div>
          <div className="text-[11px] text-slate-400 font-mono">{item.senderPhone}</div>
        </div>
      ),
    },
    {
      header: 'Beneficiary & Destination',
      accessorKey: 'beneficiaryName',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-800">{item.beneficiaryName}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1">{item.beneficiaryBank}</div>
        </div>
      ),
    },
    {
      header: 'Collected (MYR)',
      accessorKey: 'sourceAmount',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.sourceAmount}</span>,
    },
    {
      header: 'Payout (BDT)',
      accessorKey: 'targetAmount',
      cell: (item) => <span className="font-mono font-bold text-emerald-700">{item.targetAmount}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Branch',
      accessorKey: 'branch',
      cell: (item) => <span className="text-xs text-slate-500">{item.branch}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Border Remittance Operations"
        description="End-to-end corridor settlement engine with 16-state audit trail, real-time AML screening, and central bank compliance."
        actions={
          <Link
            href="/remittances/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Remittance</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Remittances"
          value={remittances.length.toString()}
          subtitle="All transactions logged"
          icon={Send}
        />
        <StatCard
          title="Corridor Volume"
          value="৳ 5,420,000"
          subtitle="BDT Settled this month"
          icon={ShieldCheck}
        />
        <StatCard
          title="Average Speed"
          value="4.2 Mins"
          subtitle="API Bank Disbursement"
          icon={Clock}
        />
        <StatCard
          title="Disbursement Success"
          value="99.8%"
          subtitle="BEFTN & MFS Real-time"
          icon={ShieldCheck}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={remittances}
          searchPlaceholder="Search remittance by ref, sender, or beneficiary..."
        />
      </div>
    </div>
  );
}
