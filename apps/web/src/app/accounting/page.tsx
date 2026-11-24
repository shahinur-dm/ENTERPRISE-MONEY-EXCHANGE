'use client';

import React, { useState } from 'react';
import { BookOpenCheck, Scale, CheckCircle2, Lock, Plus, FileText, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function AccountingLedgerPage() {
  const [activeTab, setActiveTab] = useState<'JOURNALS' | 'COA'>('JOURNALS');

  const journals = [
    {
      id: 'JRN-202611-000482',
      date: '2026-11-24',
      module: 'TRADING_PURCHASE',
      narration: 'Procurement of 100,000 MYR foreign currency holding from Metro Forex Wholesale',
      functionalCurrency: 'BDT',
      totalDebit: '3,300,000.00',
      totalCredit: '3,300,000.00',
      isBalanced: true,
      lines: [
        { coaCode: '1300', coaName: 'Foreign Currency Holdings (MYR)', debit: '3,300,000.00', credit: '—' },
        { coaCode: '1200', coaName: 'Bank Settlement Account (BDT)', debit: '—', credit: '3,000,000.00' },
        { coaCode: '2100', coaName: 'Supplier Payable - Metro Forex', debit: '—', credit: '300,000.00' },
      ],
    },
    {
      id: 'JRN-202611-000481',
      date: '2026-11-24',
      module: 'TRADING_SALE',
      narration: 'Sale of 20,000 MYR foreign currency to Rahim Trading Corp @ 35.00 BDT',
      functionalCurrency: 'BDT',
      totalDebit: '700,000.00',
      totalCredit: '700,000.00',
      isBalanced: true,
      lines: [
        { coaCode: '1200', coaName: 'Bank Collection Account (BDT)', debit: '700,000.00', credit: '—' },
        { coaCode: '1300', coaName: 'Foreign Currency Holdings (MYR cost basis)', debit: '—', credit: '660,000.00' },
        { coaCode: '4100', coaName: 'Realized Exchange Gain (Income)', debit: '—', credit: '40,000.00' },
      ],
    },
    {
      id: 'JRN-202611-000480',
      date: '2026-11-24',
      module: 'REMITTANCE_COLLECTION',
      narration: 'Collection of 2,500 MYR remittance principal + fee for Order REM-1092',
      functionalCurrency: 'MYR',
      totalDebit: '2,510.00',
      totalCredit: '2,510.00',
      isBalanced: true,
      lines: [
        { coaCode: '1100', coaName: 'Kuala Lumpur Cash Register', debit: '2,510.00', credit: '—' },
        { coaCode: '2200', coaName: 'Customer Remittance Payable (Principal)', debit: '—', credit: '2,500.00' },
        { coaCode: '4200', coaName: 'Remittance Service Charge Income', debit: '—', credit: '10.00' },
      ],
    },
  ];

  const coaTree = [
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpenCheck className="w-5 h-5 text-blue-600" />
            <span>Institutional Accounting Engine & General Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Strict double-entry accounting engine with immutable posted journals and period closing locks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-mono font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Trial Balance: 100% Equilibrium</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('JOURNALS')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'JOURNALS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Posted Journal Entries
        </button>
        <button
          onClick={() => setActiveTab('COA')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'COA'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Standard Chart of Accounts (COA)
        </button>
      </div>

      {activeTab === 'JOURNALS' ? (
        <div className="space-y-4">
          {journals.map((j) => (
            <div key={j.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-sm text-blue-600">{j.id}</span>
                  <span className="text-xs text-slate-400 font-mono">{j.date}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-100 text-slate-600">
                    {j.module}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-500">Functional: <strong>{j.functionalCurrency}</strong></span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Debit = Credit ({j.totalDebit})
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 italic">{j.narration}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2 px-3">Account Code</th>
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
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Account Head Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Current Ledger Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coaTree.map((row) => (
                <tr key={row.code} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{row.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
