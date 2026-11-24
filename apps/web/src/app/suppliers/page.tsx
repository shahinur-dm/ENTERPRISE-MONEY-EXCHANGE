'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Truck, Plus, ShieldCheck } from 'lucide-react';
import { DEMO_SUPPLIERS, DemoSupplier } from '@erp/shared';

export default function SuppliersPage() {
  const [suppliers] = useState<DemoSupplier[]>(DEMO_SUPPLIERS);

  const columns: Column<DemoSupplier>[] = [
    {
      header: 'Supplier / Liquidity Provider',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">Code: {item.code}</div>
        </div>
      ),
    },
    {
      header: 'Dealing Officer',
      accessorKey: 'contactPerson',
      cell: (item) => <span className="font-semibold text-slate-800">{item.contactPerson}</span>,
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
      header: 'Supported Currencies',
      accessorKey: 'currency',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {item.currency}
        </span>
      ),
    },
    {
      header: 'Credit Rating',
      accessorKey: 'rating',
      cell: (item) => <span className="font-semibold text-xs text-slate-700">{item.rating}</span>,
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
        title="FX Liquidity Suppliers & Wholesalers"
        description="Approved wholesale currency providers, treasury dealing desks, and central bank authorized dealers."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Suppliers"
          value={suppliers.length.toString()}
          subtitle="Wholesale liquidity providers"
          icon={Truck}
        />
        <StatCard
          title="Institutional Credit"
          value="AAA / Sovereign"
          subtitle="Central bank vetted"
          icon={ShieldCheck}
        />
        <StatCard
          title="Currencies Supplied"
          value="8 Core Pairs"
          subtitle="Spot & Forward Settlement"
          icon={Truck}
        />
        <StatCard
          title="Compliance Score"
          value="100%"
          subtitle="Regulatory compliant"
          icon={ShieldCheck}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={suppliers}
          searchPlaceholder="Search supplier by name, code, or currency..."
        />
      </div>
    </div>
  );
}
