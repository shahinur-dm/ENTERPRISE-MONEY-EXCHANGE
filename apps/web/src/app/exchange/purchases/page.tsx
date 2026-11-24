'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Receipt, Coins, ShieldCheck } from 'lucide-react';
import { DEMO_FX_PURCHASES, DemoFXTrade } from '@erp/shared';

export default function PurchasesPage() {
  const [purchases] = useState<DemoFXTrade[]>(DEMO_FX_PURCHASES);

  const columns: Column<DemoFXTrade>[] = [
    {
      header: 'Purchase Ref',
      accessorKey: 'id',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{item.id}</span>
          <span className="text-[10px] text-slate-400 font-mono block">{item.date}</span>
        </div>
      ),
    },
    {
      header: 'Supplier / Counterparty',
      accessorKey: 'partyName',
      cell: (item) => <span className="font-semibold text-slate-800">{item.partyName}</span>,
    },
    {
      header: 'Purchased Currency',
      accessorKey: 'amount',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.amount}</span>,
    },
    {
      header: 'Cost Rate',
      accessorKey: 'rate',
      cell: (item) => <span className="font-mono font-bold text-blue-700">{item.rate}</span>,
    },
    {
      header: 'Base Cost (MYR)',
      accessorKey: 'baseAmount',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.baseAmount}</span>,
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
        title="Foreign Currency Purchase Register"
        description="Historical wholesale and counter currency acquisitions with real-time Weighted Average Cost (WAC) pool updates."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Purchases"
          value={purchases.length.toString()}
          subtitle="42 Purchase vouchers"
          icon={Receipt}
        />
        <StatCard
          title="Volume Acquired"
          value="4.8M MYR"
          subtitle="Cumulative base inventory"
          icon={Coins}
        />
        <StatCard
          title="WAC Compliance"
          value="12 Decimals"
          subtitle="Strict inventory revaluation"
          icon={ShieldCheck}
        />
        <StatCard
          title="Voucher Equilibrium"
          value="Balanced"
          subtitle="100% Posted to general ledger"
          icon={Receipt}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={purchases}
          searchPlaceholder="Search purchase by ref, supplier, or currency..."
        />
      </div>
    </div>
  );
}
