'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, CreditCard } from 'lucide-react';

interface ExpenseItem {
  id: string;
  voucherNo: string;
  category: string;
  branch: string;
  paidTo: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  date: string;
  status: string;
}

export default function ExpensesPage() {
  const [expenses] = useState<ExpenseItem[]>([
    { id: '1', voucherNo: 'EXP-2026-0041', category: 'Branch Lease & Rent', branch: 'Kuala Lumpur HQ', paidTo: 'Bukit Bintang Properties Sdn Bhd', amount: '12,500.00', currency: 'MYR', paymentMethod: 'Bank Transfer', date: '24 Nov 2026', status: 'completed' },
    { id: '2', voucherNo: 'EXP-2026-0042', category: 'IT & Infrastructure Hosting', branch: 'Kuala Lumpur HQ', paidTo: 'Amazon Web Services / S3', amount: '2,800.00', currency: 'MYR', paymentMethod: 'Corporate Card', date: '23 Nov 2026', status: 'completed' },
    { id: '3', voucherNo: 'EXP-2026-0043', category: 'Armored Vault Cash Transport', branch: 'Dhaka Principal', paidTo: 'Securicor Security BD', amount: '45,000.00', currency: 'BDT', paymentMethod: 'Bank Transfer', date: '22 Nov 2026', status: 'completed' },
    { id: '4', voucherNo: 'EXP-2026-0044', category: 'Regulatory Licensing Fees', branch: 'Kuala Lumpur HQ', paidTo: 'Bank Negara Malaysia', amount: '5,000.00', currency: 'MYR', paymentMethod: 'Cheque', date: '20 Nov 2026', status: 'completed' },
  ]);

  const columns: Column<ExpenseItem>[] = [
    {
      header: 'Voucher No',
      accessorKey: 'voucherNo',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.voucherNo}</span>,
    },
    {
      header: 'Expense Category',
      accessorKey: 'category',
      cell: (item) => <span className="font-semibold text-slate-800">{item.category}</span>,
    },
    {
      header: 'Branch & Payee',
      accessorKey: 'paidTo',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.paidTo}</div>
          <div className="text-[11px] text-slate-400">{item.branch}</div>
        </div>
      ),
    },
    {
      header: 'Disbursed Amount',
      accessorKey: 'amount',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900">
          {item.amount} {item.currency}
        </span>
      ),
    },
    {
      header: 'Payment Rail',
      accessorKey: 'paymentMethod',
      cell: (item) => <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{item.paymentMethod}</span>,
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
        title="Operating Expenses"
        description="Branch operational overhead, premise leases, security logistics, and technology fees."
        actions={
          <button
            onClick={() => alert('Record Expense Voucher Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Expenses This Month" value="26,000" currency="MYR" changePercent={-2.1} changeLabel="Within budget allocation" variant="white" />
        <StatCard title="Facility Costs" value="12,500" currency="MYR" changeLabel="Premise leases" variant="white" />
        <StatCard title="Security & Logistics" value="45,000" currency="BDT" changeLabel="Cash-in-transit escorts" variant="white" />
        <StatCard title="Tax Deductible" value="100%" currency="Compliant" changeLabel="Full receipts cataloged" variant="white" />
      </div>

      <DataTable
        title="Expense Voucher Register"
        subtitle="Automatic double-entry expense classification against Chart of Accounts (5000 Series)."
        columns={columns}
        data={expenses}
        searchPlaceholder="Search expenses..."
      />
    </div>
  );
}
