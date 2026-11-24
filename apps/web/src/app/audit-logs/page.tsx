'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ClipboardList, ShieldCheck, Lock } from 'lucide-react';

interface AuditItem {
  id: string;
  timestamp: string;
  user: string;
  module: string;
  action: string;
  targetId: string;
  ipAddress: string;
  hash: string;
}

export default function AuditLogsPage() {
  const [logs] = useState<AuditItem[]>([
    { id: '1', timestamp: '24 Nov 2026, 11:35:12 UTC', user: 'admin@moneyexchange.com', module: 'EXCHANGE_RATE', action: 'RATE_APPROVED', targetId: 'RATE-2026-004', ipAddress: '192.168.1.104', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: '2', timestamp: '24 Nov 2026, 11:20:05 UTC', user: 'teller.kul@moneyexchange.com', module: 'REMITTANCE', action: 'REMITTANCE_COLLECTED', targetId: 'REM-2026-000081', ipAddress: '10.0.12.45', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
    { id: '3', timestamp: '24 Nov 2026, 11:15:40 UTC', user: 'admin@moneyexchange.com', module: 'ACCOUNTING', action: 'JOURNAL_POSTED', targetId: 'JE-2026-000004', ipAddress: '192.168.1.104', hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
    { id: '4', timestamp: '24 Nov 2026, 10:45:19 UTC', user: 'compliance@moneyexchange.com', module: 'COMPLIANCE', action: 'SANCTIONS_SCREENING_CLEARED', targetId: 'CASE-AML-842', ipAddress: '10.0.12.18', hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' },
  ]);

  const columns: Column<AuditItem>[] = [
    {
      header: 'Timestamp (UTC)',
      accessorKey: 'timestamp',
      cell: (item) => <span className="font-mono text-xs text-slate-500">{item.timestamp}</span>,
    },
    {
      header: 'Operator Email',
      accessorKey: 'user',
      cell: (item) => <span className="font-semibold text-slate-800 text-xs">{item.user}</span>,
    },
    {
      header: 'System Module',
      accessorKey: 'module',
      cell: (item) => <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{item.module}</span>,
    },
    {
      header: 'Action Taken',
      accessorKey: 'action',
      cell: (item) => <span className="font-semibold text-slate-900 text-xs">{item.action}</span>,
    },
    {
      header: 'Target Record ID',
      accessorKey: 'targetId',
      cell: (item) => <span className="font-mono text-xs text-slate-600 font-bold">{item.targetId}</span>,
    },
    {
      header: 'IP Address',
      accessorKey: 'ipAddress',
      cell: (item) => <span className="font-mono text-slate-400 text-xs">{item.ipAddress}</span>,
    },
    {
      header: 'Tamper-Evident SHA-256 Hash',
      accessorKey: 'hash',
      cell: (item) => (
        <span className="font-mono text-[10px] text-slate-400 truncate max-w-[140px] block" title={item.hash}>
          {item.hash.substring(0, 16)}...
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Audit Logs"
        description="Append-only regulatory audit ledger with cryptographically chained SHA-256 hashes."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Audit Entries Today" value="1,240" currency="Events" changeLabel="Continuous logging" variant="white" />
        <StatCard title="Chain Integrity" value="Verified" currency="100%" changeLabel="Zero hash breaks detected" variant="white" />
        <StatCard title="Privileged Operations" value="18" currency="Logged" changeLabel="Admin / Checker events" variant="white" />
        <StatCard title="Retention Standard" value="7 Years" currency="Statutory" changeLabel="BNM & Bangladesh Bank" variant="white" />
      </div>

      <DataTable
        title="System Event Audit Ledger"
        subtitle="Every record captures user context, IP address, previous state, new state, and cryptographic seal."
        columns={columns}
        data={logs}
        searchPlaceholder="Search audit logs..."
      />
    </div>
  );
}
