'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  Plus,
} from 'lucide-react';

interface AMLCase {
  id: string;
  customerName: string;
  sourceCurrency: string;
  amount: string;
  matchedList: string;
  score: number;
  status: 'PENDING_REVIEW' | 'CLEARED' | 'BLOCKED_STR';
  date: string;
}

export default function AMLCompliancePage() {
  const [cases] = useState<AMLCase[]>([
    {
      id: 'AML-2026-081',
      customerName: 'Tariqul Islam',
      sourceCurrency: 'MYR',
      amount: '45,000.00',
      matchedList: 'UN Security Council 1267 (Fuzzy Match)',
      score: 78,
      status: 'CLEARED',
      date: '24 Nov 2026',
    },
    {
      id: 'AML-2026-082',
      customerName: 'Ahmad bin Mansoor',
      sourceCurrency: 'MYR',
      amount: '120,000.00',
      matchedList: 'BNM PEP High-Risk Public Official',
      score: 92,
      status: 'PENDING_REVIEW',
      date: '24 Nov 2026',
    },
    {
      id: 'AML-2026-083',
      customerName: 'Farid Uddin',
      sourceCurrency: 'MYR',
      amount: '8,500.00',
      matchedList: 'OFAC SDN Specially Designated Nationals',
      score: 65,
      status: 'CLEARED',
      date: '23 Nov 2026',
    },
  ]);

  const columns: Column<AMLCase>[] = [
    {
      header: 'Case Ref',
      accessorKey: 'id',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.id}</span>,
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: (item) => <span className="font-semibold text-slate-800">{item.customerName}</span>,
    },
    {
      header: 'Transaction Amount',
      accessorKey: 'amount',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.amount} {item.sourceCurrency}</span>,
    },
    {
      header: 'Sanctions Watchlist Match',
      accessorKey: 'matchedList',
      cell: (item) => <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">{item.matchedList}</span>,
    },
    {
      header: 'Match Score',
      accessorKey: 'score',
      cell: (item) => (
        <span className={`font-mono font-bold text-xs ${item.score > 85 ? 'text-rose-600' : 'text-amber-600'}`}>
          {item.score}%
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anti-Money Laundering (AML) & Sanctions Monitoring"
        description="Real-time OFAC, UN Security Council, and BNM/Bangladesh Bank PEP screening and suspicious transaction reporting (STR)."
        actions={
          <button
            onClick={() => alert('STR Filing portal opened for Compliance Officer.')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>File Suspicious Transaction (STR)</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active AML Alerts"
          value="1"
          subtitle="Requires secondary review"
          icon={AlertTriangle}
        />
        <StatCard
          title="Sanctions Scanned"
          value="1,420"
          subtitle="100% Transactions verified"
          icon={ShieldAlert}
        />
        <StatCard
          title="PEP Matches"
          value="2"
          subtitle="Enhanced Due Diligence active"
          icon={FileCheck2}
        />
        <StatCard
          title="Regulatory Status"
          value="Fully Compliant"
          subtitle="BFIU / BNM Reporting clean"
          icon={CheckCircle2}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={cases}
          searchPlaceholder="Search AML cases by customer or ref..."
        />
      </div>
    </div>
  );
}
