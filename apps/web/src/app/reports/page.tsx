'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart3, Download, FileText, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { title: 'Daily Foreign Exchange Trading Summary', category: 'FX Operations', desc: 'Detailed turnover, buy/sell volumes, and realized WAC gross margins by corridor.', frequency: 'Daily' },
    { title: 'Bank Negara Malaysia Statutory Remittance Return', category: 'Regulatory Compliance', desc: 'Quarterly compliance submission under Money Services Business Act 2011 (MSBA).', frequency: 'Monthly / Quarterly' },
    { title: 'Bangladesh Bank Cross-Border Payout Filing', category: 'Regulatory Compliance', desc: 'Inward remittance report, wage earner incentive tracking, and NID clearances.', frequency: 'Daily' },
    { title: 'General Ledger Trial Balance & Period Close', category: 'Financial Accounting', desc: 'Detailed debits, credits, account reconciliations, and journal audit verification.', frequency: 'Monthly' },
    { title: 'AML / CFT Suspicious Transaction Report (STR)', category: 'Risk & Governance', desc: 'PEP matches, sanctions screening exceptions, and transaction threshold alerts.', frequency: 'On-Demand' },
    { title: 'Branch Liquidity & Vault Sweep Position', category: 'Treasury & Cash', desc: 'Physical currency on hand, bank account clearing balances, and cash limits.', frequency: 'Daily' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial & Regulatory Reports"
        description="Statutory filings, compliance submissions, executive balance sheets, and audit extracts."
        actions={
          <button
            onClick={() => alert('Custom Report Builder Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Generate Custom Report</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Standard Reports" value="18" currency="Templates" changeLabel="Regulatory compliant" variant="white" />
        <StatCard title="Scheduled Exports" value="4" currency="Automated" changeLabel="Delivered to compliance" variant="white" />
        <StatCard title="Export Formats" value="PDF / CSV" currency="Standard" changeLabel="Excel & PDF ready" variant="white" />
        <StatCard title="Central Bank Audit" value="Ready" currency="100%" changeLabel="Complete transaction trail" variant="white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((rpt, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px]">{rpt.category}</span>
                <span className="font-mono text-slate-400">{rpt.frequency}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-2">{rpt.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rpt.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => alert(`Generating PDF report: ${rpt.title}`)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => alert(`Exporting CSV dataset: ${rpt.title}`)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>CSV</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
