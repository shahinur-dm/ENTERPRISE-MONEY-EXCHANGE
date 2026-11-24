'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, FileCheck2, ShieldCheck, AlertCircle } from 'lucide-react';

interface KYCApplication {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
  country: string;
  tier: string;
  riskRating: string;
  submittedAt: string;
  status: string;
}

export default function KYCManagementPage() {
  const [applications] = useState<KYCApplication[]>([
    { id: '1', name: 'Tan Sri Kamaruddin', documentType: 'MyKad / NRIC', documentNumber: '820412-10-5421', country: '🇲🇾 Malaysia', tier: 'Tier 3 (Institutional)', riskRating: 'LOW', submittedAt: '24 Nov 2026', status: 'verified' },
    { id: '2', name: 'Shahidul Alam', documentType: 'National ID (Smart NID)', documentNumber: '19842619800012', country: '🇧🇩 Bangladesh', tier: 'Tier 2 (Full KYC)', riskRating: 'LOW', submittedAt: '24 Nov 2026', status: 'verified' },
    { id: '3', name: 'Al-Madina Gold Traders', documentType: 'Corporate Trade License', documentNumber: 'DHK-TL-2022-841', country: '🇧🇩 Bangladesh', tier: 'Corporate EDD', riskRating: 'MEDIUM', submittedAt: '23 Nov 2026', status: 'pending' },
    { id: '4', name: 'Ibrahim Khalil', documentType: 'Passport', documentNumber: 'B1149208', country: '🇲🇾 Malaysia', tier: 'Tier 1 (Basic)', riskRating: 'LOW', submittedAt: '22 Nov 2026', status: 'verified' },
  ]);

  const columns: Column<KYCApplication>[] = [
    {
      header: 'Applicant Name',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-500">{item.country}</div>
        </div>
      ),
    },
    {
      header: 'Identity Document',
      accessorKey: 'documentType',
      cell: (item) => (
        <div>
          <span className="font-semibold text-slate-800">{item.documentType}</span>
          <div className="font-mono text-[11px] text-slate-400">{item.documentNumber}</div>
        </div>
      ),
    },
    {
      header: 'KYC Tier Target',
      accessorKey: 'tier',
      cell: (item) => <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{item.tier}</span>,
    },
    {
      header: 'Automated Risk Score',
      accessorKey: 'riskRating',
      cell: (item) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
          item.riskRating === 'LOW' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {item.riskRating}
        </span>
      ),
    },
    {
      header: 'Verification Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Submitted',
      accessorKey: 'submittedAt',
      cell: (item) => <span className="text-slate-500 text-xs">{item.submittedAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC & Identity Verification Vault"
        description="Encrypted identity verification documents, biometric facial matching, and AML risk tiers."
        actions={
          <button
            onClick={() => alert('Submit KYC Document Verification Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Verify New Customer</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="KYC Submissions" value="1,842" currency="Applications" changeLabel="Total processed" variant="white" />
        <StatCard title="Auto-Verified" value="94.2%" currency="Instant" changeLabel="OCR & MRZ validation" variant="white" />
        <StatCard title="Pending EDD Review" value="6" currency="Cases" changeLabel="Assigned to compliance officer" variant="white" />
        <StatCard title="Document Vault" value="Encrypted" currency="AES-256" changeLabel="Private S3 storage" variant="white" />
      </div>

      <DataTable
        title="KYC Applications Queue"
        subtitle="Identity verification adheres to Bank Negara Malaysia AMLA 2001 and Bangladesh Bank Guidelines."
        columns={columns}
        data={applications}
        searchPlaceholder="Search applicant, passport, or MyKad..."
      />
    </div>
  );
}
