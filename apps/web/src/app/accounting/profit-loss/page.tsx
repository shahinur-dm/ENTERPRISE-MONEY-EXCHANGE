'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';

export default function ProfitLossPage() {
  const revenueLines = [
    { code: '4010', name: 'FX Trading Margin & Realized Currency Gains', amount: '48,500.00 MYR' },
    { code: '4020', name: 'Remittance Service Fee Income', amount: '18,500.00 MYR' },
  ];

  const expenseLines = [
    { code: '5010', name: 'Remittance Partner Provider Charges', amount: '9,200.00 MYR' },
    { code: '5020', name: 'Bank Correspondent & Clearing Charges', amount: '3,800.00 MYR' },
    { code: '5030', name: 'Compliance & Automated Screening Fees', amount: '1,500.00 MYR' },
    { code: '5040', name: 'Branch Counter Operational Expenses', amount: '11,500.00 MYR' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profit & Loss Statement"
        description="Comprehensive income statement: Realized FX trading margins, fee income, and operating expenses."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Operating Revenue" value="67,000" currency="MYR" changePercent={14.8} changeLabel="FX + Remittance fees" variant="white" />
        <StatCard title="Total Operating Expenses" value="26,000" currency="MYR" changePercent={-2.1} changeLabel="Direct costs & overhead" variant="white" />
        <StatCard title="Net Realized Profit" value="41,000" currency="MYR" changePercent={22.4} changeLabel="Net Margin: 61.2%" variant="white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Operating Revenue</h3>
            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
              +67,000.00 MYR
            </span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {revenueLines.map((line) => (
              <div key={line.code} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-slate-900 mr-2">{line.code}</span>
                  <span className="text-slate-700">{line.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{line.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Operating & Direct Expenses</h3>
            <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs">
              -26,000.00 MYR
            </span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {expenseLines.map((line) => (
              <div key={line.code} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-slate-900 mr-2">{line.code}</span>
                  <span className="text-slate-700">{line.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{line.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
