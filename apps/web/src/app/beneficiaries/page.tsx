'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UserCheck, Plus, Building2, Wallet } from 'lucide-react';
import { DEMO_BENEFICIARIES, DemoBeneficiary } from '@erp/shared';

export default function BeneficiariesPage() {
  const [beneficiaries] = useState<DemoBeneficiary[]>(DEMO_BENEFICIARIES);

  const columns: Column<DemoBeneficiary>[] = [
    {
      header: 'Beneficiary Name',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-400">Rel: {item.relationship}</div>
        </div>
      ),
    },
    {
      header: 'Sender Account Link',
      accessorKey: 'customerName',
      cell: (item) => (
        <div>
          <span className="font-semibold text-slate-800">{item.customerName}</span>
          <span className="text-[10px] text-slate-400 font-mono block">{item.customerId}</span>
        </div>
      ),
    },
    {
      header: 'Payout Channel',
      accessorKey: 'paymentType',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {item.paymentType === 'BANK' ? <Building2 className="w-3 h-3 text-blue-600" /> : <Wallet className="w-3 h-3 text-emerald-600" />}
          {item.paymentType}
        </span>
      ),
    },
    {
      header: 'Bank / Wallet Provider',
      accessorKey: 'bankOrWallet',
      cell: (item) => <span className="font-semibold text-xs text-slate-800">{item.bankOrWallet}</span>,
    },
    {
      header: 'Account / Wallet Number',
      accessorKey: 'accountNumber',
      cell: (item) => <span className="font-mono font-bold text-slate-900 text-xs">{item.accountNumber}</span>,
    },
    {
      header: 'Branch & City',
      accessorKey: 'city',
      cell: (item) => <span className="text-xs text-slate-500">{item.branch}, {item.city}</span>,
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
        title="Beneficiary Directory"
        description="Registered destination payees linked to verified senders for automated cross-border transfer clearing."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beneficiaries"
          value={beneficiaries.length.toString()}
          subtitle="30 Verified payees"
          icon={UserCheck}
        />
        <StatCard
          title="Bank Accounts"
          value="20"
          subtitle="BEFTN routing active"
          icon={Building2}
        />
        <StatCard
          title="MFS Wallets"
          value="10"
          subtitle="bKash & Nagad verified"
          icon={Wallet}
        />
        <StatCard
          title="Verification Rate"
          value="100%"
          subtitle="Name match confirmed"
          icon={UserCheck}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={beneficiaries}
          searchPlaceholder="Search beneficiary by name, sender, or account..."
        />
      </div>
    </div>
  );
}
