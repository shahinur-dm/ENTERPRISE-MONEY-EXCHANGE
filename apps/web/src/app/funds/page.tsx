'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Landmark, ArrowRightLeft } from 'lucide-react';

interface FundAccountItem {
  id: string;
  name: string;
  accountType: string;
  currency: string;
  currentBalance: string;
  reservedBalance: string;
  availableBalance: string;
  branch: string;
  status: string;
}

export default function FundManagementPage() {
  const [funds] = useState<FundAccountItem[]>([
    { id: '1', name: 'KUL HQ Central Vault (MYR)', accountType: 'CASH_VAULT', currency: 'MYR', currentBalance: '150,000.00', reservedBalance: '25,000.00', availableBalance: '125,000.00', branch: 'Kuala Lumpur HQ', status: 'active' },
    { id: '2', name: 'Maybank Operating Corporate AC', accountType: 'BANK_ACCOUNT', currency: 'MYR', currentBalance: '1,200,000.00', reservedBalance: '100,000.00', availableBalance: '1,100,000.00', branch: 'Kuala Lumpur HQ', status: 'active' },
    { id: '3', name: 'Islami Bank Remit Settlement BD', accountType: 'BANK_ACCOUNT', currency: 'BDT', currentBalance: '14,500,000.00', reservedBalance: '2,000,000.00', availableBalance: '12,500,000.00', branch: 'Dhaka Principal', status: 'active' },
    { id: '4', name: 'bKash Authorized Settlement Wallet', accountType: 'AUTHORIZED_MFS', currency: 'BDT', currentBalance: '4,200,000.00', reservedBalance: '500,000.00', availableBalance: '3,700,000.00', branch: 'Dhaka Principal', status: 'active' },
    { id: '5', name: 'US Dollar Reserve Vault', accountType: 'VAULT', currency: 'USD', currentBalance: '85,000.00', reservedBalance: '10,000.00', availableBalance: '75,000.00', branch: 'Kuala Lumpur HQ', status: 'active' },
    { id: '6', name: 'Euro Clearing Pool', accountType: 'SETTLEMENT_CLEARING', currency: 'EUR', currentBalance: '65,000.00', reservedBalance: '5,000.00', availableBalance: '60,000.00', branch: 'Kuala Lumpur HQ', status: 'active' },
  ]);

  const columns: Column<FundAccountItem>[] = [
    {
      header: 'Account Name',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-400">{item.branch}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'accountType',
      cell: (item) => (
        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
          {item.accountType.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.currency}</span>,
    },
    {
      header: 'Current Balance',
      accessorKey: 'currentBalance',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.currentBalance}</span>,
    },
    {
      header: 'Reserved / In-Transit',
      accessorKey: 'reservedBalance',
      cell: (item) => <span className="font-mono text-amber-600 font-semibold">{item.reservedBalance}</span>,
    },
    {
      header: 'Net Available Balance',
      accessorKey: 'availableBalance',
      cell: (item) => (
        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
          {item.availableBalance}
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
        title="Treasury & Fund Management"
        description="Consolidated enterprise liquidity, cash vaults, bank accounts, and settlement pools."
        actions={
          <button
            onClick={() => alert('New Financial Account Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Financial Account</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cash & Bank" value="28,500,000" currency="BDT" changePercent={6.4} changeLabel="Consolidated functional balance" variant="white" />
        <StatCard title="Foreign Reserves" value="150,000" currency="USD Equiv" changeLabel="USD, EUR, SGD" variant="white" />
        <StatCard title="Pending Clearing" value="2,640,000" currency="BDT" changeLabel="Locked for active payouts" variant="white" />
        <StatCard title="Solvency Ratio" value="184%" currency="Tier 1" changeLabel="Exceeds central bank mandates" variant="white" />
      </div>

      <DataTable
        title="Multi-Currency Financial Accounts"
        subtitle="Available balance strictly enforces BR-003: Available = Current - (Reserved + Blocked)."
        columns={columns}
        data={funds}
        searchPlaceholder="Search accounts by name or currency..."
      />
    </div>
  );
}
