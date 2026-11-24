'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Users, ShieldCheck, ChevronRight } from 'lucide-react';
import { DEMO_CUSTOMERS, DemoCustomer } from '@erp/shared';

export default function CustomersPage() {
  const [customers] = useState<DemoCustomer[]>(DEMO_CUSTOMERS);

  const columns: Column<DemoCustomer>[] = [
    {
      header: 'Customer / Business Name',
      accessorKey: 'name',
      cell: (item) => (
        <Link href={`/customers/${item.id}`} className="group block">
          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <span>{item.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">{item.idNumber}</div>
        </Link>
      ),
    },
    {
      header: 'Entity Type',
      accessorKey: 'type',
      cell: (item) => (
        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
          {item.type}
        </span>
      ),
    },
    {
      header: 'Contact Details',
      accessorKey: 'phone',
      cell: (item) => (
        <div className="text-xs">
          <div className="font-mono text-slate-800">{item.phone}</div>
          <div className="text-slate-400">{item.email}</div>
        </div>
      ),
    },
    {
      header: 'KYC Level',
      accessorKey: 'kycTier',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          {item.kycTier}
        </span>
      ),
    },
    {
      header: 'Risk Score',
      accessorKey: 'riskRating',
      cell: (item) => {
        const color =
          item.riskRating === 'LOW'
            ? 'text-emerald-700 bg-emerald-50'
            : item.riskRating === 'MEDIUM'
            ? 'text-amber-700 bg-amber-50'
            : 'text-rose-700 bg-rose-50';
        return <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${color}`}>{item.riskRating}</span>;
      },
    },
    {
      header: 'Account Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Directory & KYC Profiles"
        description="Comprehensive customer database across individual senders and commercial import/export entities."
        actions={
          <button
            onClick={() => alert('Add customer registration modal')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={customers.length.toString()}
          subtitle="32 Active profiles"
          icon={Users}
        />
        <StatCard
          title="Full KYC Verified"
          value="94%"
          subtitle="Meets BNM & BB mandates"
          icon={ShieldCheck}
        />
        <StatCard
          title="Corporate Entities"
          value="6"
          subtitle="High-volume FX traders"
          icon={Users}
        />
        <StatCard
          title="Sanctions Status"
          value="100% Clean"
          subtitle="Daily PEP & OFAC rescanned"
          icon={ShieldCheck}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={customers}
          searchPlaceholder="Search customer by name, email, or passport..."
        />
      </div>
    </div>
  );
}
