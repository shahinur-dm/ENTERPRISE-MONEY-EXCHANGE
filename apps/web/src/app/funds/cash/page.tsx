'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Wallet, ShieldAlert } from 'lucide-react';

interface CashRegisterItem {
  id: string;
  name: string;
  branch: string;
  custodian: string;
  currency: string;
  openingCash: string;
  currentCash: string;
  maxLimit: string;
  status: string;
}

export default function CashManagementPage() {
  const [tills] = useState<CashRegisterItem[]>([
    { id: '1', name: 'Counter Till 01 (Retail)', branch: 'Kuala Lumpur HQ', custodian: 'Farhana Yasmin', currency: 'MYR', openingCash: '20,000.00', currentCash: '45,820.00', maxLimit: '100,000.00', status: 'active' },
    { id: '2', name: 'Counter Till 02 (Wholesale)', branch: 'Kuala Lumpur HQ', custodian: 'Ibrahim Ali', currency: 'MYR', openingCash: '50,000.00', currentCash: '82,400.00', maxLimit: '200,000.00', status: 'active' },
    { id: '3', name: 'Motijheel Payout Till A', branch: 'Dhaka Principal', custodian: 'Kamrul Hasan', currency: 'BDT', openingCash: '500,000.00', currentCash: '1,250,000.00', maxLimit: '3,000,000.00', status: 'active' },
    { id: '4', name: 'Agrabad Cash Till', branch: 'Chittagong Branch', custodian: 'Mahbubur Rahman', currency: 'BDT', openingCash: '300,000.00', currentCash: '480,000.00', maxLimit: '1,500,000.00', status: 'active' },
  ]);

  const columns: Column<CashRegisterItem>[] = [
    {
      header: 'Till / Cash Register',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-400">{item.branch}</div>
        </div>
      ),
    },
    {
      header: 'Cashier / Custodian',
      accessorKey: 'custodian',
      cell: (item) => <span className="font-semibold text-slate-800">{item.custodian}</span>,
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.currency}</span>,
    },
    {
      header: 'Opening Cash',
      accessorKey: 'openingCash',
      cell: (item) => <span className="font-mono text-slate-500">{item.openingCash}</span>,
    },
    {
      header: 'Physical Cash on Hand',
      accessorKey: 'currentCash',
      cell: (item) => <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.currentCash}</span>,
    },
    {
      header: 'Maximum Limit',
      accessorKey: 'maxLimit',
      cell: (item) => <span className="font-mono text-slate-500">{item.maxLimit}</span>,
    },
    {
      header: 'Till Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Physical Cash & Till Management"
        description="Branch counter cash registers, daily opening floats, and end-of-day reconciliation."
        actions={
          <button
            onClick={() => alert('Open / Reconcile Cash Till Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Open Cash Till</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Cash Tills" value="4" currency="Registers" changeLabel="All branch counters open" variant="white" />
        <StatCard title="Cash on Hand (MYR)" value="128,220" currency="MYR" changeLabel="Vault sweeps scheduled" variant="white" />
        <StatCard title="Cash on Hand (BDT)" value="1,730,000" currency="BDT" changeLabel="Within branch limits" variant="white" />
        <StatCard title="Audit Variance" value="0.00" currency="Discrepancy" changeLabel="100% physically reconciled" variant="white" />
      </div>

      <DataTable
        title="Branch Cash Registers"
        subtitle="End-of-day cash count verification enforced before closing registers."
        columns={columns}
        data={tills}
        searchPlaceholder="Search tills or custodians..."
      />
    </div>
  );
}
