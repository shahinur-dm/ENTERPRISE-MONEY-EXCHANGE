'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Building2, ExternalLink } from 'lucide-react';

interface BankAccountItem {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  currency: string;
  balance: string;
  country: string;
  status: string;
}

export default function BankAccountsPage() {
  const [banks] = useState<BankAccountItem[]>([
    { id: '1', bankName: 'Maybank Berhad', accountName: 'Dawat IT & Consultancy Sdn Bhd', accountNumber: '514011984210', swiftCode: 'MBBEMYKL', currency: 'MYR', balance: '1,200,000.00 MYR', country: '🇲🇾 Malaysia', status: 'active' },
    { id: '2', bankName: 'CIMB Bank Berhad', accountName: 'Dawat Operations Clearing', accountNumber: '800912440182', swiftCode: 'CIBBMYKL', currency: 'MYR', balance: '450,000.00 MYR', country: '🇲🇾 Malaysia', status: 'active' },
    { id: '3', bankName: 'Islami Bank Bangladesh Ltd', accountName: 'Dawat Exchange Bangladesh Ltd', accountNumber: '20501180293001', swiftCode: 'IBBLBDDH', currency: 'BDT', balance: '14,500,000.00 BDT', country: '🇧🇩 Bangladesh', status: 'active' },
    { id: '4', bankName: 'Dutch-Bangla Bank Ltd', accountName: 'Dawat Settlement Account', accountNumber: '1151039842001', swiftCode: 'DBBLBDDH', currency: 'BDT', balance: '6,200,000.00 BDT', country: '🇧🇩 Bangladesh', status: 'active' },
    { id: '5', bankName: 'Citibank Europe PLC', accountName: 'Dawat Treasury Euro', accountNumber: 'DE89370400440532013000', swiftCode: 'CITIDEFF', currency: 'EUR', balance: '65,000.00 EUR', country: '🇩🇪 Germany', status: 'active' },
  ]);

  const columns: Column<BankAccountItem>[] = [
    {
      header: 'Bank & Country',
      accessorKey: 'bankName',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.bankName}</div>
          <div className="text-[11px] text-slate-500">{item.country}</div>
        </div>
      ),
    },
    {
      header: 'Corporate Account Name',
      accessorKey: 'accountName',
      cell: (item) => <span className="font-semibold text-slate-800">{item.accountName}</span>,
    },
    {
      header: 'Account / IBAN',
      accessorKey: 'accountNumber',
      cell: (item) => (
        <div>
          <div className="font-mono font-bold text-slate-900">{item.accountNumber}</div>
          <div className="text-[11px] text-slate-400 font-mono">SWIFT: {item.swiftCode}</div>
        </div>
      ),
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.currency}</span>,
    },
    {
      header: 'Ledger Balance',
      accessorKey: 'balance',
      cell: (item) => <span className="font-mono font-bold text-blue-600">{item.balance}</span>,
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
        title="Institutional Bank Accounts"
        description="Direct corporate settlement accounts, SWIFT/SEPA rails, and partner correspondent banks."
        actions={
          <button
            onClick={() => alert('Add Bank Account Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Bank Account</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Connected Banks" value="5" currency="Institutions" changeLabel="MY, BD, EU" variant="white" />
        <StatCard title="Bank Liquidity" value="23,415,000" currency="BDT Equiv" changePercent={4.8} changeLabel="Real-time synchronized" variant="white" />
        <StatCard title="Unreconciled Items" value="0" currency="Items" changeLabel="Reconciliation 100%" variant="white" />
        <StatCard title="Clearing SLA" value="15 min" currency="Fast Payout" changeLabel="Automated API push" variant="white" />
      </div>

      <DataTable
        title="Commercial Bank Registry"
        subtitle="All accounts segregated between company operating capital and client remittance settlement funds."
        columns={columns}
        data={banks}
        searchPlaceholder="Search bank accounts or SWIFT..."
      />
    </div>
  );
}
