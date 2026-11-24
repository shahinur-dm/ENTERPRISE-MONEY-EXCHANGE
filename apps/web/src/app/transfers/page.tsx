'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface TransferItem {
  id: string;
  transferNo: string;
  sourceAccount: string;
  destinationAccount: string;
  amount: string;
  currency: string;
  initiatedBy: string;
  approvedBy: string;
  status: string;
  date: string;
}

export default function InternalTransfersPage() {
  const [transfers] = useState<TransferItem[]>([
    { id: '1', transferNo: 'TRF-2026-00041', sourceAccount: 'KUL HQ Vault (MYR)', destinationAccount: 'Counter Till 01 (Retail)', amount: '30,000.00', currency: 'MYR', initiatedBy: 'Farhana Yasmin', approvedBy: 'Chief Admin', status: 'completed', date: '24 Nov 2026' },
    { id: '2', transferNo: 'TRF-2026-00042', sourceAccount: 'Maybank Operating AC', destinationAccount: 'CIMB Clearing Account', amount: '200,000.00', currency: 'MYR', initiatedBy: 'Accountant', approvedBy: 'Chief Admin', status: 'completed', date: '24 Nov 2026' },
    { id: '3', transferNo: 'TRF-2026-00043', sourceAccount: 'Motijheel Principal Payout', destinationAccount: 'Agrabad Cash Till', amount: '500,000.00', currency: 'BDT', initiatedBy: 'Branch Manager', approvedBy: 'Country Admin', status: 'processing', date: '24 Nov 2026' },
  ]);

  const columns: Column<TransferItem>[] = [
    {
      header: 'Transfer No',
      accessorKey: 'transferNo',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.transferNo}</span>,
    },
    {
      header: 'Source Account',
      accessorKey: 'sourceAccount',
      cell: (item) => <span className="font-semibold text-slate-800">{item.sourceAccount}</span>,
    },
    {
      header: 'Destination Account',
      accessorKey: 'destinationAccount',
      cell: (item) => (
        <div className="flex items-center space-x-1 font-semibold text-slate-800">
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{item.destinationAccount}</span>
        </div>
      ),
    },
    {
      header: 'Transfer Amount',
      accessorKey: 'amount',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900">
          {item.amount} {item.currency}
        </span>
      ),
    },
    {
      header: 'Maker / Checker',
      accessorKey: 'initiatedBy',
      cell: (item) => (
        <div className="text-xs">
          <div className="text-slate-800 font-medium">By: {item.initiatedBy}</div>
          <div className="text-slate-400 font-mono">Appr: {item.approvedBy}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (item) => <span className="text-slate-500 text-xs">{item.date}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Fund Transfers"
        description="Branch-to-branch, vault-to-till, and inter-bank liquidity rebalancing workflows."
        actions={
          <button
            onClick={() => alert('New Internal Transfer Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Internal Transfer</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Transfers Today" value="830,000" currency="BDT Equiv" changeLabel="Vault rebalancing" variant="white" />
        <StatCard title="Funds In-Transit" value="500,000" currency="BDT" changeLabel="Pending destination confirmation" variant="white" />
        <StatCard title="Maker-Checker" value="Enforced" currency="100%" changeLabel="Two-person rule mandated" variant="white" />
        <StatCard title="Discrepancy Log" value="0.00" currency="Zero" changeLabel="Fully reconciled" variant="white" />
      </div>

      <DataTable
        title="Internal Transfer Orders"
        subtitle="Funds remain in-transit until acknowledged and verified by receiving custodian."
        columns={columns}
        data={transfers}
        searchPlaceholder="Search transfers by account..."
      />
    </div>
  );
}
