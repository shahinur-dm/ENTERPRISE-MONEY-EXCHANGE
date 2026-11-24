'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UserCog, Plus, ShieldCheck } from 'lucide-react';
import { DEMO_AGENTS, DemoAgent } from '@erp/shared';

export default function AgentsPage() {
  const [agents] = useState<DemoAgent[]>(DEMO_AGENTS);

  const columns: Column<DemoAgent>[] = [
    {
      header: 'Agent / Settlement Hub',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">Code: {item.code}</div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'city',
      cell: (item) => <span className="font-semibold text-slate-800">{item.city}, {item.country}</span>,
    },
    {
      header: 'Settlement Account',
      accessorKey: 'settlementAccount',
      cell: (item) => <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{item.settlementAccount}</span>,
    },
    {
      header: 'Daily Payout Cap',
      accessorKey: 'dailyLimit',
      cell: (item) => <span className="font-mono font-bold text-emerald-700 text-xs">{item.dailyLimit}</span>,
    },
    {
      header: 'Contact',
      accessorKey: 'contact',
      cell: (item) => <span className="font-mono text-xs text-slate-600">{item.contact}</span>,
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
        title="Remittance Payout Agents"
        description="Authorized destination payout network across commercial banks and mobile financial service distributors in Bangladesh."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Payout Agents"
          value={agents.length.toString()}
          subtitle="Distributors & Banks"
          icon={UserCog}
        />
        <StatCard
          title="Settlement Network"
          value="BEFTN & NPSB"
          subtitle="Instant clearing active"
          icon={ShieldCheck}
        />
        <StatCard
          title="Disbursement Cap"
          value="250M BDT / Day"
          subtitle="Combined corridor liquidity"
          icon={UserCog}
        />
        <StatCard
          title="Uptime"
          value="99.98%"
          subtitle="24/7 Clearing enabled"
          icon={ShieldCheck}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={agents}
          searchPlaceholder="Search payout agent by name, code, or city..."
        />
      </div>
    </div>
  );
}
