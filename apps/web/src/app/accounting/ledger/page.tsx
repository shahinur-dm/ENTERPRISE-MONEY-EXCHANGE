'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FileSpreadsheet, Download, Filter } from 'lucide-react';

interface LedgerLine {
  id: string;
  date: string;
  accountCode: string;
  accountName: string;
  entryNumber: string;
  memo: string;
  debit: string;
  credit: string;
  runningBalance: string;
}

export default function GeneralLedgerPage() {
  const [lines] = useState<LedgerLine[]>([
    { id: '1', date: '24 Nov 2026', accountCode: '1010', accountName: 'Cash on Hand (Base)', entryNumber: 'JE-2026-000002', memo: 'Remittance Collection REM-001', debit: '87,510.00', credit: '0.00', runningBalance: '150,000.00' },
    { id: '2', date: '24 Nov 2026', accountCode: '1010', accountName: 'Cash on Hand (Base)', entryNumber: 'JE-2026-000004', memo: 'Transfer to Counter Till 01', debit: '0.00', credit: '30,000.00', runningBalance: '120,000.00' },
    { id: '3', date: '24 Nov 2026', accountCode: '1020', accountName: 'Foreign Currency Inventory', entryNumber: 'JE-2026-000001', memo: 'Wholesale FX Purchase', debit: '3,300,000.00', credit: '0.00', runningBalance: '3,300,000.00' },
    { id: '4', date: '24 Nov 2026', accountCode: '1020', accountName: 'Foreign Currency Inventory', entryNumber: 'JE-2026-000003', memo: 'Inventory reduction @ WAC', debit: '0.00', credit: '660,000.00', runningBalance: '2,640,000.00' },
    { id: '5', date: '24 Nov 2026', accountCode: '4010', accountName: 'FX Trading Margin & Gain', entryNumber: 'JE-2026-000003', memo: 'Realized FX Profit Rahim Trading', debit: '0.00', credit: '40,000.00', runningBalance: '40,000.00' },
  ]);

  const columns: Column<LedgerLine>[] = [
    {
      header: 'Posting Date',
      accessorKey: 'date',
      cell: (item) => <span className="text-slate-500 font-mono text-xs">{item.date}</span>,
    },
    {
      header: 'Account Code & Name',
      accessorKey: 'accountName',
      cell: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 mr-2">{item.accountCode}</span>
          <span className="font-semibold text-slate-700">{item.accountName}</span>
        </div>
      ),
    },
    {
      header: 'Journal Entry',
      accessorKey: 'entryNumber',
      cell: (item) => <span className="font-mono text-blue-600 font-bold">{item.entryNumber}</span>,
    },
    {
      header: 'Memo / Description',
      accessorKey: 'memo',
      cell: (item) => <span className="text-slate-600 text-xs truncate max-w-[240px] block">{item.memo}</span>,
    },
    {
      header: 'Debit',
      accessorKey: 'debit',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.debit !== '0.00' ? item.debit : '—'}</span>,
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.credit !== '0.00' ? item.credit : '—'}</span>,
    },
    {
      header: 'Running Balance',
      accessorKey: 'runningBalance',
      cell: (item) => <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">{item.runningBalance}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Ledger"
        description="Detailed account-by-account transaction history with continuous running balances."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Ledger Accounts" value="13" currency="Heads" changeLabel="MYR Legal Entity" variant="white" />
        <StatCard title="Total Line Postings" value="28" currency="Lines" changeLabel="Continuous audit" variant="white" />
        <StatCard title="Integrity Check" value="Valid" currency="100%" changeLabel="Reconciliation in sync" variant="white" />
        <StatCard title="Closed Periods" value="0" currency="Open" changeLabel="Fiscal year 2026 active" variant="white" />
      </div>

      <DataTable
        title="General Ledger Account Lines"
        subtitle="Chronological transaction lines grouped by Chart of Accounts head."
        columns={columns}
        data={lines}
        searchPlaceholder="Filter ledger lines..."
      />
    </div>
  );
}
