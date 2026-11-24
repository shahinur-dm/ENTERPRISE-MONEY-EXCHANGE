'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  GitBranch,
  Building2,
  Globe2,
  Users,
  Coins,
  ShieldCheck,
  Plus,
  MapPin,
  Phone,
  Clock,
  Landmark,
} from 'lucide-react';

interface BranchItem {
  id: string;
  code: string;
  name: string;
  country: 'Malaysia' | 'Bangladesh';
  city: string;
  functionalCurrency: 'MYR' | 'BDT';
  vaultBalance: string;
  vaultLimit: string;
  tellersActive: number;
  manager: string;
  status: 'active' | 'suspended';
  address: string;
  licenseNumber: string;
}

export default function BranchManagementPage() {
  const [branches] = useState<BranchItem[]>([
    {
      id: 'BR-001',
      code: 'KUL-01',
      name: 'Kuala Lumpur Central Branch',
      country: 'Malaysia',
      city: 'Kuala Lumpur',
      functionalCurrency: 'MYR',
      vaultBalance: '400,000.00 MYR',
      vaultLimit: '1,500,000.00 MYR',
      tellersActive: 6,
      manager: 'Mohammad Farooq',
      status: 'active',
      address: 'Suite 12.04, Menara Maybank, 100 Jalan Tun Perak, 50050 Kuala Lumpur',
      licenseNumber: 'BNM-MSB-2024-091',
    },
    {
      id: 'BR-002',
      code: 'DHK-01',
      name: 'Dhaka Motijheel Principal Hub',
      country: 'Bangladesh',
      city: 'Dhaka',
      functionalCurrency: 'BDT',
      vaultBalance: '15,500,000.00 BDT',
      vaultLimit: '30,000,000.00 BDT',
      tellersActive: 8,
      manager: 'Tariqul Islam',
      status: 'active',
      address: 'Level 8, City Centre, 90/1 Motijheel C/A, Dhaka 1000',
      licenseNumber: 'BB-FE-AD-8841',
    },
    {
      id: 'BR-003',
      code: 'CTG-01',
      name: 'Chittagong Agrabad Commercial Branch',
      country: 'Bangladesh',
      city: 'Chittagong',
      functionalCurrency: 'BDT',
      vaultBalance: '6,200,000.00 BDT',
      vaultLimit: '15,000,000.00 BDT',
      tellersActive: 4,
      manager: 'Kazi Mahbubur Rahman',
      status: 'active',
      address: 'Ground Floor, Agrabad Commercial Area, Chittagong 4100',
      licenseNumber: 'BB-FE-AD-8842',
    },
    {
      id: 'BR-004',
      code: 'JHR-01',
      name: 'Johor Bahru City Square Counter',
      country: 'Malaysia',
      city: 'Johor Bahru',
      functionalCurrency: 'MYR',
      vaultBalance: '150,000.00 MYR',
      vaultLimit: '500,000.00 MYR',
      tellersActive: 3,
      manager: 'Ahmad Faiz',
      status: 'active',
      address: 'Lot M2-18, City Square, 106-108 Jalan Wong Ah Fook, 80000 Johor Bahru',
      licenseNumber: 'BNM-MSB-2024-092',
    },
  ]);

  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branch Network Management"
        description="Multi-country legal entity branches, segregated cash vaults, operational teller assignments, and statutory license tracking."
        actions={
          <button
            onClick={() => alert('New Branch provisioning wizard requires Master Admin credentials.')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Branch</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Branches"
          value={branches.length.toString()}
          subtitle="Malaysia & Bangladesh hubs"
          icon={Building2}
        />
        <StatCard
          title="Active Tellers"
          value="21"
          subtitle="Operating across 4 vaults"
          icon={Users}
        />
        <StatCard
          title="Cross-Border Corridors"
          value="MYR ⇄ BDT"
          subtitle="Sub-second settlement clearing"
          icon={Globe2}
        />
        <StatCard
          title="Licensing Invariant"
          value="100% Valid"
          subtitle="BNM & Bangladesh Bank Verified"
          icon={ShieldCheck}
        />
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:border-blue-300 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {branch.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{branch.name}</h3>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.city}, {branch.country}</span>
                </div>
              </div>
              <StatusBadge status={branch.status} />
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">{branch.address}</p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-slate-500 font-medium block mb-1">Vault Inventory</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{branch.vaultBalance}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Limit: {branch.vaultLimit}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-slate-500 font-medium block mb-1">Functional Currency</span>
                <span className="font-bold text-blue-700 font-mono text-sm">{branch.functionalCurrency}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{branch.tellersActive} Tellers on Duty</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="text-slate-500">
                <span className="font-medium text-slate-700">Manager:</span> {branch.manager}
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                Lic: {branch.licenseNumber}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
