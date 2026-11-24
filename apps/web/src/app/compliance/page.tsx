'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserCheck,
  Eye,
  FileCheck,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ComplianceCenterPage() {
  const [filter, setFilter] = useState('ALL');

  const cases = [
    {
      id: 'CMP-CASE-202611-0081',
      party: 'Sultan Mahmud',
      partyType: 'Remittance Sender',
      orderId: 'REM-202611-001088',
      type: 'TRANSACTION_THRESHOLD',
      riskScore: 78,
      riskLevel: 'HIGH',
      description: 'Single transaction of RM 15,000 exceeds standard retail threshold. Source of wealth declaration required.',
      status: 'on_hold',
      createdDate: '2026-11-24 13:20',
      assignedTo: 'Compliance Officer (Rahman)',
    },
    {
      id: 'CMP-CASE-202611-0079',
      party: 'Abdul Jabbar',
      partyType: 'Beneficiary',
      orderId: 'REM-202611-001088',
      type: 'PEP_SANCTIONS_MATCH',
      riskScore: 92,
      riskLevel: 'PROHIBITED',
      description: 'Phonetic similarity match (84%) with Politically Exposed Person (PEP) database watchlist.',
      status: 'on_hold',
      createdDate: '2026-11-24 13:22',
      assignedTo: 'Compliance Officer (Rahman)',
    },
    {
      id: 'CMP-CASE-202611-0075',
      party: 'Rahim Trading Corp',
      partyType: 'Corporate Customer',
      orderId: 'SAL-202611-000882',
      type: 'KYC_DOCUMENT_RENEWAL',
      riskScore: 25,
      riskLevel: 'LOW',
      description: 'Trade license expiration date within 30 days notice window.',
      status: 'approved',
      createdDate: '2026-11-23 10:15',
      assignedTo: 'System Auto-Alert',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Compliance, KYC & AML Screening Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time PEP & Sanctions screening, threshold limits, and institutional compliance holds.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-mono font-bold text-rose-800">
            <span>Active Compliance Holds: </span>
            <strong>2 Cases</strong>
          </div>
        </div>
      </div>

      {/* Case Management Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Active Compliance Alerts & Watchlist Cases
          </div>
          <div className="flex space-x-1 text-xs">
            {['ALL', 'ON_HOLD', 'UNDER_REVIEW', 'APPROVED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded font-semibold ${
                  filter === f ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Involved Party</th>
              <th className="py-3 px-4">Risk Category</th>
              <th className="py-3 px-4">Screening Description</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-600">{c.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{c.party}</div>
                  <div className="text-[10px] text-slate-400">{c.partyType} • {c.orderId}</div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-700">
                  {c.type}
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                  {c.description}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      c.riskLevel === 'PROHIBITED'
                        ? 'bg-rose-100 text-rose-800'
                        : c.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.riskLevel} ({c.riskScore})
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => alert(`Reviewing case: ${c.id}`)}
                    className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs font-semibold"
                  >
                    Investigate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
