'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import {
  Building,
  Landmark,
  ShieldCheck,
  FileCheck,
  Globe2,
  Calendar,
  DollarSign,
  Scale,
  CheckCircle2,
} from 'lucide-react';

export default function OrganizationSettingsPage() {
  const [entities] = useState([
    {
      id: 'ENT-MY',
      legalName: 'Dawat Money Services Sdn. Bhd.',
      country: 'Malaysia',
      jurisdiction: 'Kuala Lumpur, Malaysia',
      registrationNumber: '202401048892 (1542894-X)',
      taxNumber: 'SST-W10-2401-32000841',
      functionalCurrency: 'MYR',
      regulatoryBody: 'Bank Negara Malaysia (BNM)',
      licenseType: 'Class B Money Services Business (Remittance & FX)',
      licenseNumber: 'BNM-MSB-2024-091',
      licenseExpiry: '2028-12-31',
      registeredAddress: 'Level 22, Menara Ilham, No. 8 Jalan Binjai, 50450 Kuala Lumpur',
      complianceOfficer: 'Ahmad bin Zulkifli (BNM Certified AML/CFT)',
    },
    {
      id: 'ENT-BD',
      legalName: 'Dawat Exchange & Remittance Bangladesh Ltd.',
      country: 'Bangladesh',
      jurisdiction: 'Dhaka, Bangladesh',
      registrationNumber: 'C-198274/2024',
      taxNumber: 'TIN-489271038291',
      functionalCurrency: 'BDT',
      regulatoryBody: 'Bangladesh Bank (Foreign Exchange Operation Dept)',
      licenseType: 'Authorised Dealer & Inward Remittance Settlement Hub',
      licenseNumber: 'BB-FE-AD-8841',
      licenseExpiry: '2029-06-30',
      registeredAddress: 'City Centre (8th Floor), 90/1 Motijheel Commercial Area, Dhaka-1000',
      complianceOfficer: 'Tariqul Islam (BFIU Certified)',
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization & Legal Entities"
        description="Statutory legal entities, functional currency ledgers, central bank regulatory licenses, and tax registration details."
        actions={
          <button
            onClick={() => alert('Entity profile modification submitted for Board approval.')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Update Entity Details</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Legal Entities"
          value="2"
          subtitle="Malaysia & Bangladesh registered"
          icon={Building}
        />
        <StatCard
          title="Functional Currencies"
          value="MYR & BDT"
          subtitle="Segregated balance sheet ledgers"
          icon={DollarSign}
        />
        <StatCard
          title="Regulatory Approvals"
          value="Class B & AD"
          subtitle="BNM & Bangladesh Bank approved"
          icon={Landmark}
        />
        <StatCard
          title="Audit Compliance"
          value="Statutory"
          subtitle="IFRS / IAS 21 Compliant"
          icon={Scale}
        />
      </div>

      {/* Entity Cards */}
      <div className="space-y-6">
        {entities.map((ent) => (
          <div
            key={ent.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {ent.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">{ent.legalName}</h3>
                </div>
                <div className="text-xs text-slate-500 flex items-center space-x-2">
                  <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ent.jurisdiction}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Regulatory License Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
                <span className="text-slate-400 font-medium block">Incorporation Registration</span>
                <span className="font-mono font-bold text-slate-900">{ent.registrationNumber}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
                <span className="text-slate-400 font-medium block">Tax Registration / TIN</span>
                <span className="font-mono font-bold text-slate-900">{ent.taxNumber}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
                <span className="text-slate-400 font-medium block">Functional Ledger Currency</span>
                <span className="font-mono font-bold text-blue-700">{ent.functionalCurrency}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
                <span className="text-slate-400 font-medium block">Regulatory Authority</span>
                <span className="font-semibold text-slate-900">{ent.regulatoryBody}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
                <span className="text-slate-400 font-medium block">License Category & Ref</span>
                <span className="font-semibold text-slate-900">{ent.licenseNumber}</span>
                <span className="text-[10px] text-slate-400 block">Expires: {ent.licenseExpiry}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
                <span className="text-slate-400 font-medium block">Designated Compliance Officer</span>
                <span className="font-semibold text-slate-900">{ent.complianceOfficer}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                <span className="font-medium text-slate-700">Registered Office:</span> {ent.registeredAddress}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
