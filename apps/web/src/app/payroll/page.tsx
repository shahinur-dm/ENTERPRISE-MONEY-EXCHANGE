'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Banknote, Download } from 'lucide-react';

interface PayrollItem {
  id: string;
  batchNo: string;
  period: string;
  totalEmployees: number;
  grossPay: string;
  deductions: string;
  netPayable: string;
  currency: string;
  disbursedDate: string;
  status: string;
}

export default function PayrollPage() {
  const [batches] = useState<PayrollItem[]>([
    { id: '1', batchNo: 'PAY-2026-11', period: 'November 2026', totalEmployees: 18, grossPay: '115,000.00', deductions: '14,200.00', netPayable: '100,800.00', currency: 'MYR', disbursedDate: '24 Nov 2026', status: 'completed' },
    { id: '2', batchNo: 'PAY-2026-10', period: 'October 2026', totalEmployees: 18, grossPay: '114,500.00', deductions: '14,100.00', netPayable: '100,400.00', currency: 'MYR', disbursedDate: '25 Oct 2026', status: 'completed' },
    { id: '3', batchNo: 'PAY-2026-09', period: 'September 2026', totalEmployees: 17, grossPay: '108,000.00', deductions: '13,500.00', netPayable: '94,500.00', currency: 'MYR', disbursedDate: '25 Sep 2026', status: 'completed' },
  ]);

  const columns: Column<PayrollItem>[] = [
    {
      header: 'Payroll Batch',
      accessorKey: 'batchNo',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.batchNo}</span>,
    },
    {
      header: 'Pay Period',
      accessorKey: 'period',
      cell: (item) => <span className="font-semibold text-slate-800">{item.period}</span>,
    },
    {
      header: 'Headcount',
      accessorKey: 'totalEmployees',
      cell: (item) => <span className="font-mono text-slate-700 font-bold">{item.totalEmployees} Staff</span>,
    },
    {
      header: 'Gross Salary',
      accessorKey: 'grossPay',
      cell: (item) => <span className="font-mono font-semibold text-slate-800">{item.grossPay} {item.currency}</span>,
    },
    {
      header: 'Tax & EPF / Deductions',
      accessorKey: 'deductions',
      cell: (item) => <span className="font-mono text-rose-600">{item.deductions} {item.currency}</span>,
    },
    {
      header: 'Net Disbursed',
      accessorKey: 'netPayable',
      cell: (item) => (
        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
          {item.netPayable} {item.currency}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Disbursed On',
      accessorKey: 'disbursedDate',
      cell: (item) => <span className="text-slate-500 text-xs">{item.disbursedDate}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Salary Disbursals"
        description="Employee compensation, statutory withholdings, and bank batch payment files."
        actions={
          <button
            onClick={() => alert('Generate Payroll Batch Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Payroll Batch</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Month Payroll" value="100,800" currency="MYR" changeLabel="Disbursed via bank transfer" variant="white" />
        <StatCard title="Active Headcount" value="18" currency="Employees" changeLabel="Across MY & BD offices" variant="white" />
        <StatCard title="Statutory Compliance" value="100%" currency="Filed" changeLabel="EPF, SOCSO, PCB, Tax" variant="white" />
        <StatCard title="Double-Entry Journal" value="Posted" currency="JE-PAY" changeLabel="DR Salary, CR Bank" variant="white" />
      </div>

      <DataTable
        title="Monthly Payroll Batches"
        subtitle="Automatic double-entry wage expense accrual and net pay bank settlement."
        columns={columns}
        data={batches}
        searchPlaceholder="Search payroll batches..."
      />
    </div>
  );
}
