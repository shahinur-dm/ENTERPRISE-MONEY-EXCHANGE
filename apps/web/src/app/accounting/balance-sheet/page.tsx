'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { PieChart, CheckCircle2 } from 'lucide-react';

export default function BalanceSheetPage() {
  const assetItems = [
    { code: '1010', name: 'Cash on Hand / Vault (Base)', amount: '150,000.00 MYR' },
    { code: '1020', name: 'Foreign Currency Vault (Inventory @ WAC)', amount: '250,000.00 MYR' },
    { code: '1030', name: 'Operating Bank Account (Maybank)', amount: '1,200,000.00 MYR' },
    { code: '1040', name: 'Remittance Clearing Account', amount: '150,000.00 MYR' },
    { code: '1050', name: 'Customer Receivables', amount: '45,000.00 MYR' },
  ];

  const liabilityItems = [
    { code: '2010', name: 'Accounts Payable - FX Suppliers', amount: '100,000.00 MYR' },
    { code: '2020', name: 'Remittance Payouts Payable', amount: '150,000.00 MYR' },
  ];

  const equityItems = [
    { code: '3010', name: 'Paid-Up Share Capital', amount: '1,245,000.00 MYR' },
    { code: '3020', name: 'Retained Earnings', amount: '300,000.00 MYR' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balance Sheet"
        description="Institutional Statement of Financial Position: Assets ≡ Liabilities + Equity."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Assets" value="1,795,000" currency="MYR" changeLabel="Vaults, banks, receivables" variant="white" />
        <StatCard title="Total Liabilities" value="250,000" currency="MYR" changeLabel="Payables & remittance liabilities" variant="white" />
        <StatCard title="Total Shareholder Equity" value="1,545,000" currency="MYR" changeLabel="Capital + Retained earnings" variant="white" />
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center space-x-3 text-xs">
        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
        <div>
          <span className="font-bold">Accounting Identity Preserved:</span> Total Assets (1,795,000 MYR) = Total Liabilities (250,000 MYR) + Equity (1,545,000 MYR).
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Assets</h3>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
              1,795,000.00 MYR
            </span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {assetItems.map((item) => (
              <div key={item.code} className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-slate-900 mr-2">{item.code}</span>
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Liabilities</h3>
              <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs">
                250,000.00 MYR
              </span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {liabilityItems.map((item) => (
                <div key={item.code} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-slate-900 mr-2">{item.code}</span>
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Shareholder Equity</h3>
              <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs">
                1,545,000.00 MYR
              </span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {equityItems.map((item) => (
                <div key={item.code} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-slate-900 mr-2">{item.code}</span>
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
