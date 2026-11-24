'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserCheck,
  Eye,
  FileCheck,
  Download,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatCard } from '@/components/ui/StatCard';

interface ComplianceCase {
  id: string;
  party: string;
  partyType: string;
  orderId: string;
  type: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'PROHIBITED';
  description: string;
  status: string;
  createdDate: string;
}

export default function ComplianceCenterPage() {
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const stats = [
    { title: 'Active Compliance Holds', value: '2', changePercent: 0, changeLabel: 'payouts frozen' },
    { title: 'Screenings Cleared Today', value: '48', changePercent: 12.0, changeLabel: 'passed sanctions' },
    { title: 'PEP / Watchlist Matches', value: '1', changePercent: 0, changeLabel: 'under investigation' },
    { title: 'KYC Renewals Due', value: '14', changePercent: 3.2, changeLabel: 'expiring in 30 days' },
  ];

  const cases: ComplianceCase[] = [
    {
      id: 'CMP-CASE-202611-0081',
      party: 'Sultan Mahmud',
      partyType: 'Remittance Sender',
      orderId: 'REM-202611-001088',
      type: 'TRANSACTION_THRESHOLD',
      riskScore: 78,
      riskLevel: 'HIGH',
      description: 'Single transaction of RM 15,000 exceeds standard retail threshold. Source of wealth declaration required.',
      status: 'on_hold',
      createdDate: '24 Nov 2026 13:20',
    },
    {
      id: 'CMP-CASE-202611-0079',
      party: 'Abdul Jabbar',
      partyType: 'Beneficiary',
      orderId: 'REM-202611-001088',
      type: 'PEP_SANCTIONS_MATCH',
      riskScore: 92,
      riskLevel: 'PROHIBITED',
      description: 'Phonetic similarity match (84%) with Politically Exposed Person (PEP) database watchlist.',
      status: 'on_hold',
      createdDate: '24 Nov 2026 13:22',
    },
    {
      id: 'CMP-CASE-202611-0075',
      party: 'Rahim Trading Corp',
      partyType: 'Corporate Customer',
      orderId: 'SAL-202611-000882',
      type: 'KYC_DOCUMENT_RENEWAL',
      riskScore: 25,
      riskLevel: 'LOW',
      description: 'Trade license expiration date within 30 days notice window.',
      status: 'approved',
      createdDate: '23 Nov 2026 10:15',
    },
  ];

  const filtered = cases.filter((c) => {
    if (selectedStatus === 'ALL') return true;
    return c.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  const columns: Column<ComplianceCase>[] = [
    {
      header: 'Case ID',
      accessorKey: 'id',
      cell: (item) => <span className="font-mono font-bold text-blue-600">{item.id}</span>,
    },
    {
      header: 'Party & Order',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.party}</div>
          <div className="text-[11px] text-slate-400 font-mono">{item.partyType} • {item.orderId}</div>
        </div>
      ),
    },
    {
      header: 'Alert Type',
      accessorKey: 'type',
      cell: (item) => <span className="font-mono text-xs font-bold text-slate-700">{item.type}</span>,
    },
    {
      header: 'Screening Details',
      accessorKey: 'description',
      cell: (item) => <p className="text-xs text-slate-600 max-w-sm">{item.description}</p>,
    },
    {
      header: 'Risk Level',
      cell: (item) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
            item.riskLevel === 'PROHIBITED'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : item.riskLevel === 'HIGH'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {item.riskLevel} ({item.riskScore})
        </span>
      ),
    },
    {
      header: 'Hold Status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Action',
      align: 'right',
      cell: (item) => (
        <button
          onClick={() => alert(`Reviewing Compliance Case: ${item.id}`)}
          className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
          Investigate
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance & AML Screening"
        description="Automated Sanctions and PEP watchlist matching, transaction threshold alerts, and compliance hold management."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            2 Active Compliance Holds
          </span>
        }
      />

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

      <DataTable
        title="Compliance Alerts & Watchlist Cases"
        subtitle="Cases requiring compliance officer verification before disbursement release."
        columns={columns}
        data={filtered}
        searchPlaceholder="Search case ID, party, or order..."
        statusOptions={[
          { label: 'All Cases', value: 'ALL' },
          { label: 'On Hold', value: 'ON_HOLD' },
          { label: 'Approved', value: 'APPROVED' },
        ]}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
    </div>
  );
}
