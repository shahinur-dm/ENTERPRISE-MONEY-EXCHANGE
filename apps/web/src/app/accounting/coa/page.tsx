'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, BookOpenCheck, Scale } from 'lucide-react';

interface COAItem {
  id: string;
  code: string;
  name: string;
  type: string;
  classification: string;
  currency: string;
  balance: string;
  status: string;
}

export default function ChartOfAccountsPage() {
  const [accounts] = useState<COAItem[]>([
    { id: '1', code: '1010', name: 'Cash on Hand / Vault (Base)', type: 'ASSET', classification: 'Current Assets', currency: 'MYR', balance: '150,000.00', status: 'active' },
    { id: '2', code: '1020', name: 'Foreign Currency Vault (Inventory)', type: 'ASSET', classification: 'Current Assets', currency: 'MYR', balance: '250,000.00', status: 'active' },
    { id: '3', code: '1030', name: 'Operating Bank Account (Maybank)', type: 'ASSET', classification: 'Current Assets', currency: 'MYR', balance: '1,200,000.00', status: 'active' },
    { id: '4', code: '1040', name: 'Remittance Clearing Account', type: 'ASSET', classification: 'Current Assets', currency: 'MYR', balance: '150,000.00', status: 'active' },
    { id: '5', code: '1050', name: 'Customer Receivables', type: 'ASSET', classification: 'Current Assets', currency: 'MYR', balance: '45,000.00', status: 'active' },
    { id: '6', code: '2010', name: 'Accounts Payable - FX Suppliers', type: 'LIABILITY', classification: 'Current Liabilities', currency: 'MYR', balance: '100,000.00', status: 'active' },
    { id: '7', code: '2020', name: 'Remittance Payouts Payable', type: 'LIABILITY', classification: 'Current Liabilities', currency: 'MYR', balance: '150,000.00', status: 'active' },
    { id: '8', code: '3010', name: 'Share Capital', type: 'EQUITY', classification: 'Equity', currency: 'MYR', balance: '1,245,000.00', status: 'active' },
    { id: '9', code: '3020', name: 'Retained Earnings', type: 'EQUITY', classification: 'Equity', currency: 'MYR', balance: '300,000.00', status: 'active' },
    { id: '10', code: '4010', name: 'FX Trading Margin & Realized Gain', type: 'REVENUE', classification: 'Operating Revenue', currency: 'MYR', balance: '48,500.00', status: 'active' },
    { id: '11', code: '4020', name: 'Remittance Service Fee Income', type: 'REVENUE', classification: 'Operating Revenue', currency: 'MYR', balance: '18,500.00', status: 'active' },
    { id: '12', code: '5010', name: 'Remittance Provider Charges', type: 'EXPENSE', classification: 'Direct Costs', currency: 'MYR', balance: '9,200.00', status: 'active' },
    { id: '13', code: '5020', name: 'Bank Charges & Clearing Fees', type: 'EXPENSE', classification: 'Direct Costs', currency: 'MYR', balance: '3,800.00', status: 'active' },
  ]);

  const columns: Column<COAItem>[] = [
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
      header: 'Type',
      accessorKey: 'type',
      cell: (item) => {
        const color =
          item.type === 'ASSET'
            ? 'text-blue-700 bg-blue-50'
            : item.type === 'LIABILITY'
            ? 'text-amber-700 bg-amber-50'
            : item.type === 'EQUITY'
            ? 'text-purple-700 bg-purple-50'
            : item.type === 'REVENUE'
            ? 'text-emerald-700 bg-emerald-50'
            : 'text-rose-700 bg-rose-50';
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${color}`}>
            {item.type}
          </span>
        );
      },
    },
    {
      header: 'Classification',
      accessorKey: 'classification',
      cell: (item) => <span className="text-slate-500 text-xs">{item.classification}</span>,
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      cell: (item) => <span className="font-mono font-semibold text-slate-700">{item.currency}</span>,
    },
    {
      header: 'Ledger Balance',
      accessorKey: 'balance',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.balance}</span>,
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
        title="Chart of Accounts"
        description="Master financial ledger structure strictly partitioned across Legal Entities."
        actions={
          <button
            onClick={() => alert('Add Account Head Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Account Head</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Account Heads" value="13" currency="Active" changeLabel="MYR Operating Entity" variant="white" />
        <StatCard title="Total Assets" value="1,795,000" currency="MYR" changeLabel="Vaults, bank & receivables" variant="white" />
        <StatCard title="Total Liabilities" value="250,000" currency="MYR" changeLabel="Payables & settlements" variant="white" />
        <StatCard title="Balance Equilibrium" value="100%" currency="Balanced" changeLabel="Assets = Liab + Equity" variant="white" />
      </div>

      <DataTable
        title="Account Heads Registry"
        subtitle="Standard 5-category accounting classification with parent-child rollups."
        columns={columns}
        data={accounts}
        searchPlaceholder="Search accounts by code or name..."
      />
    </div>
  );
}
