'use client';

import React, { useState } from 'react';
import {
  Send,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Download,
  Building2,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatCard } from '@/components/ui/StatCard';

interface RemittanceItem {
  id: string;
  sender: string;
  senderPhone: string;
  beneficiary: string;
  beneficiaryAccount: string;
  sourceAmount: string;
  destinationAmount: string;
  exchangeRate: string;
  assignedAgent: string;
  status: string;
  date: string;
}

export default function RemittancePage() {
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const stats = [
    { title: 'Total Volume (Month)', value: '৳ 35,420,000', changePercent: 14.2, changeLabel: 'vs last month' },
    { title: 'In-Transit Settlement', value: '৳ 2,150,000', changePercent: -4.1, changeLabel: 'pending payout' },
    { title: 'Completed Payouts', value: '1,428', changePercent: 8.5, changeLabel: 'orders delivered' },
    { title: 'Compliance Holds', value: '2', changePercent: 0, changeLabel: 'action required' },
  ];

  const data: RemittanceItem[] = [
    {
      id: 'REM-202611-001092',
      sender: 'Mohammad Faruk Hossain',
      senderPhone: '+60 17-234 5678',
      beneficiary: 'Rokeya Begum',
      beneficiaryAccount: 'Islami Bank Bangladesh (A/C: 20501100234)',
      sourceAmount: '2,500.00 MYR',
      destinationAmount: '87,500.00 BDT',
      exchangeRate: '35.00 BDT/MYR',
      assignedAgent: 'Farhana Akhter (Agent BD-04)',
      status: 'processing',
      date: '24 Nov 2026 16:45',
    },
    {
      id: 'REM-202611-001091',
      sender: 'Tanvir Ahmed',
      senderPhone: '+60 11-889 1234',
      beneficiary: 'Amena Khatun',
      beneficiaryAccount: 'bKash MFS Wallet (01711-223344)',
      sourceAmount: '1,200.00 MYR',
      destinationAmount: '42,000.00 BDT',
      exchangeRate: '35.00 BDT/MYR',
      assignedAgent: 'Mahmudul Hasan (Agent BD-02)',
      status: 'paid',
      date: '24 Nov 2026 15:30',
    },
    {
      id: 'REM-202611-001090',
      sender: 'Kamrul Islam',
      senderPhone: '+60 19-332 9876',
      beneficiary: 'Shahidul Alam',
      beneficiaryAccount: 'Dutch-Bangla Bank (A/C: 1101550098)',
      sourceAmount: '5,000.00 MYR',
      destinationAmount: '175,000.00 BDT',
      exchangeRate: '35.00 BDT/MYR',
      assignedAgent: 'Pending Allocation',
      status: 'approved',
      date: '24 Nov 2026 14:10',
    },
    {
      id: 'REM-202611-001088',
      sender: 'Sultan Mahmud',
      senderPhone: '+60 16-778 4433',
      beneficiary: 'Abdul Jabbar',
      beneficiaryAccount: 'Agrani Bank Ltd (A/C: 020001889)',
      sourceAmount: '15,000.00 MYR',
      destinationAmount: '525,000.00 BDT',
      exchangeRate: '35.00 BDT/MYR',
      assignedAgent: 'Held by Compliance',
      status: 'on_hold',
      date: '24 Nov 2026 13:20',
    },
  ];

  const filteredData = data.filter((item) => {
    if (selectedStatus === 'ALL') return true;
    return item.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  const columns: Column<RemittanceItem>[] = [
    {
      header: 'Order ID & Date',
      cell: (item) => (
        <div className="font-mono">
          <div className="font-bold text-blue-600 hover:underline cursor-pointer">{item.id}</div>
          <div className="text-[11px] text-slate-400 font-sans">{item.date}</div>
        </div>
      ),
    },
    {
      header: 'Sender Information',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.sender}</div>
          <div className="text-[11px] text-slate-400 font-mono">{item.senderPhone}</div>
        </div>
      ),
    },
    {
      header: 'Beneficiary & Destination',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.beneficiary}</div>
          <div className="text-[11px] text-slate-500">{item.beneficiaryAccount}</div>
        </div>
      ),
    },
    {
      header: 'Source (MYR)',
      cell: (item) => (
        <div className="font-mono font-bold text-slate-800">{item.sourceAmount}</div>
      ),
    },
    {
      header: 'Payout (BDT)',
      cell: (item) => (
        <div className="font-mono">
          <div className="font-bold text-emerald-700">{item.destinationAmount}</div>
          <div className="text-[10px] text-slate-400 font-mono">@{item.exchangeRate}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Agent',
      accessorKey: 'assignedAgent',
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Action',
      align: 'right',
      cell: (item) => (
        <button
          onClick={() => alert(`Opening Remittance Order details: ${item.id}`)}
          className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
          View Order
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Remittance Management"
        description="End-to-end server-enforced remittance pipeline, agent payout assignments, and provider settlement."
        actions={
          <button
            onClick={() => alert('New Remittance Modal Opened')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Remittance Order</span>
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            title={s.title}
            value={s.value}
            changePercent={s.changePercent}
            changeLabel={s.changeLabel}
            variant="white"
          />
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        title="Remittance Orders Stream"
        subtitle="Live tracking across all authorized payment corridors."
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search order ID, sender or beneficiary..."
        statusOptions={[
          { label: 'All Orders', value: 'ALL' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Processing', value: 'PROCESSING' },
          { label: 'Paid', value: 'PAID' },
          { label: 'On Hold', value: 'ON_HOLD' },
        ]}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
    </div>
  );
}
