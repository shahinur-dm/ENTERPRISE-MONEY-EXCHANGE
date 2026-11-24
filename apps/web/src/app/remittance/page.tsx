'use client';

import React, { useState } from 'react';
import {
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function RemittanceListPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const remittances = [
    {
      id: 'REM-202611-001092',
      sender: 'Mohammad Faruk Hossain',
      senderPhone: '+60 17-234 5678',
      beneficiary: 'Rokeya Begum',
      beneficiaryBank: 'Islami Bank Bangladesh (A/C: 20501100234)',
      sourceAmount: 'RM 2,500.00',
      rate: '35.00 BDT/MYR',
      destinationAmount: '৳ 87,500.00',
      fee: 'RM 10.00',
      sourceBranch: 'Kuala Lumpur Central (KUL-01)',
      destinationBranch: 'Dhaka Motijheel (DHK-01)',
      assignedAgent: 'Farhana Akhter (Agent BD-04)',
      status: 'processing',
      date: '2026-11-24 16:45',
    },
    {
      id: 'REM-202611-001091',
      sender: 'Tanvir Ahmed',
      senderPhone: '+60 11-889 1234',
      beneficiary: 'Amena Khatun',
      beneficiaryBank: 'bKash MFS (01711-223344)',
      sourceAmount: 'RM 1,200.00',
      rate: '35.00 BDT/MYR',
      destinationAmount: '৳ 42,000.00',
      fee: 'RM 10.00',
      sourceBranch: 'Kuala Lumpur Central (KUL-01)',
      destinationBranch: 'Dhaka Motijheel (DHK-01)',
      assignedAgent: 'Mahmudul Hasan (Agent BD-02)',
      status: 'paid',
      date: '2026-11-24 15:30',
    },
    {
      id: 'REM-202611-001090',
      sender: 'Kamrul Islam',
      senderPhone: '+60 19-332 9876',
      beneficiary: 'Shahidul Alam',
      beneficiaryBank: 'Dutch-Bangla Bank Ltd (A/C: 1101550098)',
      sourceAmount: 'RM 5,000.00',
      rate: '35.00 BDT/MYR',
      destinationAmount: '৳ 175,000.00',
      fee: 'RM 15.00',
      sourceBranch: 'Kuala Lumpur Central (KUL-01)',
      destinationBranch: 'Chittagong Agrabad (CTG-01)',
      assignedAgent: 'None (Unassigned)',
      status: 'approved',
      date: '2026-11-24 14:10',
    },
    {
      id: 'REM-202611-001088',
      sender: 'Sultan Mahmud',
      senderPhone: '+60 16-778 4433',
      beneficiary: 'Abdul Jabbar',
      beneficiaryBank: 'Agrani Bank Ltd',
      sourceAmount: 'RM 15,000.00',
      rate: '35.00 BDT/MYR',
      destinationAmount: '৳ 525,000.00',
      fee: 'RM 25.00',
      sourceBranch: 'Kuala Lumpur Central (KUL-01)',
      destinationBranch: 'Dhaka Motijheel (DHK-01)',
      assignedAgent: 'Pending Compliance',
      status: 'on_hold',
      date: '2026-11-24 13:20',
    },
  ];

  const filtered = remittances.filter((item) => {
    const matchesFilter = filterStatus === 'ALL' || item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.beneficiary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Send className="w-5 h-5 text-blue-600" />
            <span>Cross-Border Remittance Operations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Server-enforced 16-state settlement workflow for Malaysia → Bangladesh corridor.
          </p>
        </div>

        <button
          onClick={() => alert('New Remittance Modal Opened')}
          className="flex items-center space-x-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Remittance Order</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-1 overflow-x-auto text-xs">
          {['ALL', 'COLLECTED', 'APPROVED', 'PROCESSING', 'PAID', 'COMPLETED', 'ON_HOLD'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Order, Sender, Beneficiary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-64 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Remittance Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Sender Details</th>
              <th className="py-3 px-4">Beneficiary & Account</th>
              <th className="py-3 px-4">Source (Principal)</th>
              <th className="py-3 px-4">Payout (Destination)</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((rem) => (
              <tr key={rem.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-blue-600">{rem.id}</div>
                  <div className="text-[11px] text-slate-400 font-sans">{rem.date}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{rem.sender}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{rem.senderPhone}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">{rem.beneficiary}</div>
                  <div className="text-[11px] text-slate-500">{rem.beneficiaryBank}</div>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-slate-900">{rem.sourceAmount}</div>
                  <div className="text-[10px] text-slate-400">Fee: {rem.fee}</div>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-emerald-700">{rem.destinationAmount}</div>
                  <div className="text-[10px] text-slate-400">Rate: {rem.rate}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  {rem.assignedAgent}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={rem.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => alert(`Details for ${rem.id}`)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md font-semibold"
                  >
                    View
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
