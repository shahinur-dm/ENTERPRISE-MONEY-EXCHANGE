'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, ArrowRightLeft, ShieldCheck, RefreshCw } from 'lucide-react';

interface RateItem {
  id: string;
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  buyRate: string;
  sellRate: string;
  midRate: string;
  spread: string;
  version: number;
  status: string;
  effectiveFrom: string;
}

export default function ExchangeRatesPage() {
  const [rates] = useState<RateItem[]>([
    { id: '1', pair: 'MYR/BDT', baseCurrency: 'MYR', quoteCurrency: 'BDT', buyRate: '33.00', sellRate: '35.00', midRate: '34.00', spread: '2.00', version: 4, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
    { id: '2', pair: 'USD/BDT', baseCurrency: 'USD', quoteCurrency: 'BDT', buyRate: '119.50', sellRate: '121.20', midRate: '120.35', spread: '1.70', version: 8, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
    { id: '3', pair: 'EUR/BDT', baseCurrency: 'EUR', quoteCurrency: 'BDT', buyRate: '130.50', sellRate: '132.50', midRate: '131.50', spread: '2.00', version: 3, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
    { id: '4', pair: 'GBP/BDT', baseCurrency: 'GBP', quoteCurrency: 'BDT', buyRate: '153.00', sellRate: '156.00', midRate: '154.50', spread: '3.00', version: 2, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
    { id: '5', pair: 'SGD/BDT', baseCurrency: 'SGD', quoteCurrency: 'BDT', buyRate: '90.00', sellRate: '92.50', midRate: '91.25', spread: '2.50', version: 1, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
    { id: '6', pair: 'SAR/BDT', baseCurrency: 'SAR', quoteCurrency: 'BDT', buyRate: '31.50', sellRate: '32.80', midRate: '32.15', spread: '1.30', version: 5, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
    { id: '7', pair: 'AED/BDT', baseCurrency: 'AED', quoteCurrency: 'BDT', buyRate: '32.00', sellRate: '33.30', midRate: '32.65', spread: '1.30', version: 4, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
    { id: '8', pair: 'EUR/USD', baseCurrency: 'EUR', quoteCurrency: 'USD', buyRate: '1.0850', sellRate: '1.0950', midRate: '1.0900', spread: '0.0100', version: 12, status: 'active', effectiveFrom: '24 Nov 2026, 09:00' },
  ]);

  const columns: Column<RateItem>[] = [
    {
      header: 'Currency Pair',
      accessorKey: 'pair',
      cell: (item) => (
        <div className="font-bold text-slate-900 font-mono flex items-center space-x-1.5">
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>{item.pair}</span>
        </div>
      ),
    },
    {
      header: 'Institutional Buy',
      accessorKey: 'buyRate',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.buyRate}</span>,
    },
    {
      header: 'Institutional Sell',
      accessorKey: 'sellRate',
      cell: (item) => <span className="font-mono font-bold text-blue-600">{item.sellRate}</span>,
    },
    {
      header: 'Mid Rate',
      accessorKey: 'midRate',
      cell: (item) => <span className="font-mono text-slate-600">{item.midRate}</span>,
    },
    {
      header: 'Gross Spread',
      accessorKey: 'spread',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {item.spread}
        </span>
      ),
    },
    {
      header: 'Version',
      accessorKey: 'version',
      cell: (item) => <span className="font-mono text-slate-400">v{item.version}.0</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Effective As Of',
      accessorKey: 'effectiveFrom',
      cell: (item) => <span className="text-slate-500 text-xs">{item.effectiveFrom}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exchange Rates Management"
        description="Live institutional foreign exchange corridor rates, spreads, and Maker-Checker approvals."
        actions={
          <button
            onClick={() => alert('Add Rate / Propose New Corridor Rate Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Propose New Rate</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Corridors" value="8" currency="Pairs" changeLabel="Regulatory compliant" variant="white" />
        <StatCard title="Primary Corridor" value="35.00" currency="BDT/MYR" changePercent={1.2} changeLabel="Real-time spread: 2.00" variant="white" />
        <StatCard title="Rate Versioning" value="v12.0" currency="Active" changeLabel="Audit logged" variant="white" />
        <StatCard title="Rate Assurance" value="100%" currency="Checked" changeLabel="Maker-Checker enforced" variant="white" />
      </div>

      <DataTable
        title="Institutional Corridor Exchange Rates"
        subtitle="All rates guaranteed with 15-minute quote TTL under Bank Negara Malaysia & Bangladesh Bank policy."
        columns={columns}
        data={rates}
        searchPlaceholder="Search currency pairs..."
      />
    </div>
  );
}
