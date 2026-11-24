'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CheckSquare, Check, X, ShieldAlert } from 'lucide-react';

interface ApprovalItem {
  id: string;
  referenceNo: string;
  type: string;
  initiator: string;
  amount: string;
  currency: string;
  reason: string;
  status: string;
  submittedAt: string;
}

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>([
    { id: '1', referenceNo: 'REM-2026-000081', type: 'High-Value Remittance', initiator: 'Branch Teller (KUL)', amount: '175,000.00', currency: 'BDT', reason: 'Remittance exceeding 100k BDT threshold', status: 'pending', submittedAt: '24 Nov 2026, 11:20' },
    { id: '2', referenceNo: 'RATE-2026-004', type: 'Corridor Rate Spread Override', initiator: 'Treasury Dealer', amount: '35.20', currency: 'BDT/MYR', reason: 'High wholesale demand spread adjustment', status: 'pending', submittedAt: '24 Nov 2026, 10:45' },
    { id: '3', referenceNo: 'TRF-2026-00043', type: 'Branch Cash Transfer', initiator: 'Dhaka Vault Custodian', amount: '500,000.00', currency: 'BDT', reason: 'Inter-branch liquidity replenishment', status: 'pending', submittedAt: '24 Nov 2026, 09:30' },
  ]);

  const handleApprove = (id: string) => {
    alert(`Approved request: ${id}`);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item)));
  };

  const handleReject = (id: string) => {
    alert(`Rejected request: ${id}`);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item)));
  };

  const columns: Column<ApprovalItem>[] = [
    {
      header: 'Reference No',
      accessorKey: 'referenceNo',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.referenceNo}</span>,
    },
    {
      header: 'Workflow Request Type',
      accessorKey: 'type',
      cell: (item) => <span className="font-semibold text-slate-800">{item.type}</span>,
    },
    {
      header: 'Initiator (Maker)',
      accessorKey: 'initiator',
      cell: (item) => <span className="text-slate-600 text-xs font-medium">{item.initiator}</span>,
    },
    {
      header: 'Financial Amount',
      accessorKey: 'amount',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-900">
          {item.amount} {item.currency}
        </span>
      ),
    },
    {
      header: 'Justification / Reason',
      accessorKey: 'reason',
      cell: (item) => <span className="text-slate-500 text-xs truncate max-w-[220px] block">{item.reason}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center space-x-1.5">
          {item.status === 'pending' ? (
            <>
              <button
                onClick={() => handleApprove(item.id)}
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="Approve (Checker)"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                title="Reject"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <span className="text-slate-400 text-xs">—</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maker-Checker Approval Queue"
        description="Dual-control authorization policy: creators are strictly prohibited from approving their own transactions."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Approvals" value={String(items.filter((i) => i.status === 'pending').length)} currency="Requests" changeLabel="Awaiting checker authorization" variant="white" />
        <StatCard title="Maker-Checker Rule" value="Active" currency="BR-020" changeLabel="Self-approval blocked" variant="white" />
        <StatCard title="Threshold Approvals" value="1" currency="Above 100k BDT" changeLabel="Regulatory check required" variant="white" />
        <StatCard title="Average Turnaround" value="8 min" currency="SLA" changeLabel="High operational efficiency" variant="white" />
      </div>

      <DataTable
        title="Pending Authorization Queue"
        subtitle="Enforces Invariant BR-020: Dual authorization required for sensitive operations."
        columns={columns}
        data={items}
        searchPlaceholder="Search approvals..."
      />
    </div>
  );
}
