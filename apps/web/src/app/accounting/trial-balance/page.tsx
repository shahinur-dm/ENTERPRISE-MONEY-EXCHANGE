'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Scale, CheckCircle2 } from 'lucide-react';

interface TrialBalanceItem {
  id: string;
  code: string;
  name: string;
  type: string;
  debit: string;
  credit: string;
}

export default function TrialBalancePage() {
  const [items] = useState<TrialBalanceItem[]>([
    { id: '1', code: '1010', name: 'Cash on Hand / Vault (Base)', type: 'ASSET', debit: '150,000.00', credit: '—' },
    { id: '2', code: '1020', name: 'Foreign Currency Vault (Inventory)', type: 'ASSET', debit: '250,000.00', credit: '—' },
    { id: '3', code: '1030', name: 'Operating Bank Account (Maybank)', type: 'ASSET', debit: '1,200,000.00', credit: '—' },
    { id: '4', code: '1040', name: 'Remittance Clearing Account', type: 'ASSET', debit: '150,000.00', credit: '—' },
    { id: '5', code: '1050', name: 'Customer Receivables', type: 'ASSET', debit: '45,000.00', credit: '—' },
    { id: '6', code: '2010', name: 'Accounts Payable - FX Suppliers', type: 'LIABILITY', debit: '—', credit: '100,000.00' },
    { id: '7', code: '2020', name: 'Remittance Payouts Payable', type: 'LIABILITY', debit: '—', credit: '150,000.00' },
    { id: '8', code: '3010', name: 'Share Capital', type: 'EQUITY', debit: '—', credit: '1,245,000.00' },
    { id: '9', code: '3020', name: 'Retained Earnings', type: 'EQUITY', debit: '—', credit: '300,000.00' },
  ]);

  const columns: Column<TrialBalanceItem>[] = [
    {
      header: 'Account Code',
      accessorKey: 'code',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.code}</span>,
    },
    {
      header: 'Account Name',
      accessorKey: 'name',
      cell: (item) => <span className="font-semibold text-slate-800">{item.name}</span>,
    },
    {
      header: 'Classification Type',
      accessorKey: 'type',
      cell: (item) => <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{item.type}</span>,
    },
    {
      header: 'Debit Balance (MYR)',
      accessorKey: 'debit',
      align: 'right',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.debit}</span>,
    },
    {
      header: 'Credit Balance (MYR)',
      accessorKey: 'credit',
      align: 'right',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.credit}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trial Balance"
        description="Verification of double-entry mathematical equilibrium: Total Debits == Total Credits."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Debits" value="1,795,000.00" currency="MYR" changeLabel="Sum of all debit balances" variant="white" />
        <StatCard title="Total Credits" value="1,795,000.00" currency="MYR" changeLabel="Sum of all credit balances" variant="white" />
        <StatCard title="Equilibrium Variance" value="0.0000" currency="MYR" changeLabel="Mathematically balanced" variant="white" />
      </div>

      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3 text-xs">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold">Double-Entry Invariant BR-001 Confirmed:</span> Trial balance is in absolute equilibrium ($\sum Debit \equiv \sum Credit$). No unbalanced journals detected.
        </div>
      </div>

      <DataTable
        title="Consolidated Trial Balance Sheet"
        subtitle="As of 24 Nov 2026 across active ledger accounts."
        columns={columns}
        data={items}
        searchPlaceholder="Search trial balance accounts..."
      />
    </div>
  );
}
