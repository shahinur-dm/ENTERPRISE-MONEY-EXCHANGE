'use client';

import React, { useState } from 'react';
import {
  BookOpenCheck,
  Scale,
  CheckCircle2,
  Lock,
  Plus,
  FileSpreadsheet,
  Download,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';

interface COAItem {
  code: string;
  name: string;
  type: string;
  balance: string;
}

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'JOURNALS' | 'COA'>('JOURNALS');

  const journals = [
    {
      id: 'JRN-202611-000482',
      date: '24 Nov 2026',
      module: 'TRADING_PURCHASE',
      narration: 'Procurement of 100,000 MYR foreign currency holding from Metro Forex Wholesale',
      functionalCurrency: 'BDT',
      totalDebit: '3,300,000.00',
      totalCredit: '3,300,000.00',
      lines: [
        { coaCode: '1300', coaName: 'Foreign Currency Holdings (MYR)', debit: '3,300,000.00', credit: '—' },
        { coaCode: '1200', coaName: 'Bank Settlement Account (BDT)', debit: '—', credit: '3,000,000.00' },
        { coaCode: '2100', coaName: 'Supplier Payable - Metro Forex', debit: '—', credit: '300,000.00' },
      ],
    },
    {
      id: 'JRN-202611-000481',
      date: '24 Nov 2026',
      module: 'TRADING_SALE',
      narration: 'Sale of 20,000 MYR foreign currency to Rahim Trading Corp @ 35.00 BDT',
      functionalCurrency: 'BDT',
      totalDebit: '700,000.00',
      totalCredit: '700,000.00',
      lines: [
        { coaCode: '1200', coaName: 'Bank Collection Account (BDT)', debit: '700,000.00', credit: '—' },
        { coaCode: '1300', coaName: 'Foreign Currency Holdings (MYR cost basis)', debit: '—', credit: '660,000.00' },
        { coaCode: '4100', coaName: 'Realized Exchange Gain (Income)', debit: '—', credit: '40,000.00' },
      ],
    },
    {
      id: 'JRN-202611-000480',
      date: '24 Nov 2026',
      module: 'REMITTANCE_COLLECTION',
      narration: 'Collection of 2,500 MYR remittance principal + fee for Order REM-1092',
      functionalCurrency: 'MYR',
      totalDebit: '2,510.00',
      totalCredit: '2,510.00',
      lines: [
        { coaCode: '1100', coaName: 'Kuala Lumpur Cash Register', debit: '2,510.00', credit: '—' },
        { coaCode: '2200', coaName: 'Customer Remittance Payable (Principal)', debit: '—', credit: '2,500.00' },
        { coaCode: '4200', coaName: 'Remittance Service Charge Income', debit: '—', credit: '10.00' },
      ],
    },
  ];

  const coaTree: COAItem[] = [
    { code: '1000', name: 'Assets', type: 'ASSET', balance: '৳ 14,250,000.00' },
    { code: '1100', name: 'Cash on Hand & Branch Registers', type: 'ASSET', balance: '৳ 1,220,000.00' },
    { code: '1200', name: 'Bank Accounts (Operating & Clearing)', type: 'ASSET', balance: '৳ 6,850,000.00' },
    { code: '1300', name: 'Foreign Currency Holdings (WAC Inventory)', type: 'ASSET', balance: '৳ 5,000,000.00' },
    { code: '1400', name: 'Accounts Receivable (Customer Due)', type: 'ASSET', balance: '৳ 680,000.00' },
    { code: '1500', name: 'Settlement Receivable (Provider Clearing)', type: 'ASSET', balance: '৳ 500,000.00' },
    { code: '2000', name: 'Liabilities', type: 'LIABILITY', balance: '৳ 5,750,000.00' },
    { code: '2100', name: 'Supplier Accounts Payable', type: 'LIABILITY', balance: '৳ 1,300,000.00' },
    { code: '2200', name: 'Customer Remittance Payable (Principal Escrow)', type: 'LIABILITY', balance: '৳ 4,200,000.00' },
    { code: '2300', name: 'Settlement Payable to Destination Partners', type: 'LIABILITY', balance: '৳ 250,000.00' },
    { code: '3000', name: 'Equity & Retained Earnings', type: 'EQUITY', balance: '৳ 8,500,000.00' },
    { code: '4000', name: 'Operating Income', type: 'REVENUE', balance: '৳ 1,250,000.00' },
    { code: '4100', name: 'Realized FX Exchange Gain', type: 'REVENUE', balance: '৳ 850,000.00' },
    { code: '4200', name: 'Remittance Service Fee Income', type: 'REVENUE', balance: '৳ 250,000.00' },
    { code: '4300', name: 'Agent Network Commission Income', type: 'REVENUE', balance: '৳ 120,000.00' },
    { code: '5000', name: 'Operating Expenses', type: 'EXPENSE', balance: '৳ 430,000.00' },
  ];

  const coaColumns: Column<COAItem>[] = [
    {
      header: 'Account Code',
      accessorKey: 'code',
      cell: (item) => <span className="font-mono font-bold text-blue-600">{item.code}</span>,
    },
    {
      header: 'Account Head Name',
      accessorKey: 'name',
      cell: (item) => <span className="font-semibold text-slate-900">{item.name}</span>,
    },
    {
      header: 'Category',
      accessorKey: 'type',
      cell: (item) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 font-mono">
          {item.type}
        </span>
      ),
    },
    {
      header: 'Ledger Balance',
      accessorKey: 'balance',
      align: 'right',
      cell: (item) => <span className="font-mono font-bold text-slate-900">{item.balance}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Double-Entry General Ledger"
        description="Immutable double-entry accounting engine with strict debit-credit equilibrium and period closing locks."
        badge={
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trial Balance Equilibrium: 100% Balanced</span>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200/90">
        <button
          onClick={() => setActiveTab('JOURNALS')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'JOURNALS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Posted Journal Entries
        </button>
        <button
          onClick={() => setActiveTab('COA')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'COA'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Chart of Accounts (COA)
        </button>
      </div>

      {activeTab === 'JOURNALS' ? (
        <div className="space-y-4">
          {journals.map((j) => (
            <div
              key={j.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-sm text-blue-600">{j.id}</span>
                  <span className="text-xs text-slate-400 font-mono">{j.date}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-100 text-slate-600">
                    {j.module}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-500">Currency: <strong>{j.functionalCurrency}</strong></span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Debit = Credit ({j.totalDebit})
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium italic">{j.narration}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2 px-3">Code</th>
                      <th className="py-2 px-3">Account Head</th>
                      <th className="py-2 px-3 text-right">Debit ({j.functionalCurrency})</th>
                      <th className="py-2 px-3 text-right">Credit ({j.functionalCurrency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {j.lines.map((l, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-bold text-slate-800">{l.coaCode}</td>
                        <td className="py-2 px-3 font-sans text-slate-800">{l.coaName}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">{l.debit}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">{l.credit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          title="Institutional Chart of Accounts (COA)"
          subtitle="Hierarchical structure of all asset, liability, equity, revenue, and expense ledgers."
          columns={coaColumns}
          data={coaTree}
          searchPlaceholder="Search account name or code..."
        />
      )}
    </div>
  );
}
