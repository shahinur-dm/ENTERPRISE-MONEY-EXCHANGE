'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { History, TrendingUp, ShieldCheck } from 'lucide-react';
import { DEMO_FX_SALES, DemoFXTrade } from '@erp/shared';

export default function SalesHistoryPage() {
  const [sales] = useState<DemoFXTrade[]>(DEMO_FX_SALES);

  const columns: Column<DemoFXTrade>[] = [
    {
      header: 'Sale Ref',
      accessorKey: 'id',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{item.id}</span>
          <span className="text-[10px] text-slate-400 font-mono block">{item.date}</span>
        </div>
      ),
    },
    {
      header: 'Customer / Counterparty',
      accessorKey: 'partyName',
      cell: (item) => <span className="font-semibold text-slate-800">{item.partyName}</span>,
    },
    {
      header: 'Currency Sold',
      accessorKey: 'amount',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.amount}</span>,
    },
    {
      header: 'Executed Rate',
      accessorKey: 'rate',
      cell: (item) => <span className="font-mono font-bold text-blue-700">{item.rate}</span>,
    },
    {
      header: 'Total Sale (MYR)',
      accessorKey: 'baseAmount',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.baseAmount}</span>,
    },
    {
      header: 'Realized Margin',
      accessorKey: 'realizedMargin',
      cell: (item) => <span className="font-mono font-bold text-emerald-700">{item.realizedMargin}</span>,
    },
    {
      header: 'General Ledger Voucher',
      accessorKey: 'voucherNo',
      cell: (item) => <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{item.voucherNo}</span>,
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
        title="Currency Sales History & Realized Margin"
        description="Historical counter and wholesale foreign exchange sales with immediate gross margin and P&L recognition."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          value={sales.length.toString()}
          subtitle="42 Completed orders"
          icon={History}
        />
        <StatCard
          title="Total Realized Margin"
          value="48,500 MYR"
          subtitle="Gross FX trading profit"
          icon={TrendingUp}
        />
        <StatCard
          title="Corridor Turn"
          value="3.9 Days"
          subtitle="Average inventory velocity"
          icon={History}
        />
        <StatCard
          title="Accounting Postings"
          value="100% Balanced"
          subtitle="Recognized in Account 4010"
          icon={ShieldCheck}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={sales}
          searchPlaceholder="Search sale by ref, customer, or currency..."
        />
      </div>
    </div>
  );
}
