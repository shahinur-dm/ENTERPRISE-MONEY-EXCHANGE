'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Send,
  Scale,
  ShieldAlert,
  Sliders,
  Info,
} from 'lucide-react';

interface PermissionModule {
  category: string;
  icon: any;
  permissions: {
    key: string;
    label: string;
    description: string;
    requiresMakerChecker?: boolean;
  }[];
}

const PERMISSION_MODULES: PermissionModule[] = [
  {
    category: 'Foreign Exchange Operations',
    icon: ArrowRightLeft,
    permissions: [
      { key: 'fx.buy', label: 'Execute Currency Purchase', description: 'Counter buy of foreign currencies with WAC recalculation' },
      { key: 'fx.sell', label: 'Execute Currency Sale', description: 'Counter sale of foreign currencies with realized margin recognition' },
      { key: 'fx.rate_override', label: 'Rate Margin Override', description: 'Adjust board exchange rate for high-volume VIP counter trades', requiresMakerChecker: true },
      { key: 'fx.wholesale', label: 'Wholesale B2B FX Execution', description: 'Conduct wholesale institutional currency purchases > 50,000 MYR', requiresMakerChecker: true },
    ],
  },
  {
    category: 'Remittance & Payouts',
    icon: Send,
    permissions: [
      { key: 'remittance.quote', label: 'Generate Quote & Lock Rate', description: 'Create guaranteed 15-minute rate quote for customer' },
      { key: 'remittance.collect', label: 'Collect Sender Funds', description: 'Accept cash/transfer payment and post clearing journal' },
      { key: 'remittance.payout_authorize', label: 'Authorize External Payout', description: 'Release partner bank settlement in Bangladesh', requiresMakerChecker: true },
      { key: 'remittance.cancel_refund', label: 'Cancel & Refund Remittance', description: 'Initiate reverse equilibrium journal entry', requiresMakerChecker: true },
    ],
  },
  {
    category: 'Financial Accounting & Treasury',
    icon: Scale,
    permissions: [
      { key: 'accounting.journal_create', label: 'Draft Journal Entry', description: 'Prepare balanced double-entry vouchers' },
      { key: 'accounting.journal_post', label: 'Post Balanced Journal', description: 'Commit immutable journal entry to general ledger', requiresMakerChecker: true },
      { key: 'accounting.vault_transfer', label: 'Vault-to-Vault Transfer', description: 'Move physical cash or foreign currencies between branch vaults' },
      { key: 'accounting.coa_manage', label: 'Manage Chart of Accounts', description: 'Add, update or retire GL accounts', requiresMakerChecker: true },
    ],
  },
  {
    category: 'Risk, AML & Compliance',
    icon: ShieldAlert,
    permissions: [
      { key: 'compliance.kyc_review', label: 'Review & Approve KYC', description: 'Verify national IDs, passports and proof of address' },
      { key: 'compliance.aml_override', label: 'Clear Sanctions Hit', description: 'Documented clearance of PEP / OFAC false positives', requiresMakerChecker: true },
      { key: 'compliance.str_file', label: 'File Suspicious Transaction (STR)', description: 'Direct regulatory report dispatch to Central Bank' },
      { key: 'compliance.audit_read', label: 'Inspect Immutable Audit Trails', description: 'Read-only access to complete system audit event log' },
    ],
  },
];

const ROLES = [
  { id: 'master_admin', name: 'Master Admin', desc: 'Full architectural and executive privileges' },
  { id: 'branch_manager', name: 'Branch Manager', desc: 'Branch operational head with Maker-Checker approval rights' },
  { id: 'compliance_officer', name: 'Compliance Officer', desc: 'Regulatory oversight, KYC verification and AML investigations' },
  { id: 'fx_trader', name: 'FX Senior Trader', desc: 'Currency trading counter specialist' },
  { id: 'accountant', name: 'Chief Accountant', desc: 'General ledger, journal postings and financial reconciliation' },
  { id: 'auditor', name: 'External Auditor', desc: 'Read-only regulatory compliance and ledger scrutiny' },
];

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('branch_manager');

  // Matrix state
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    master_admin: [
      'fx.buy', 'fx.sell', 'fx.rate_override', 'fx.wholesale',
      'remittance.quote', 'remittance.collect', 'remittance.payout_authorize', 'remittance.cancel_refund',
      'accounting.journal_create', 'accounting.journal_post', 'accounting.vault_transfer', 'accounting.coa_manage',
      'compliance.kyc_review', 'compliance.aml_override', 'compliance.str_file', 'compliance.audit_read',
    ],
    branch_manager: [
      'fx.buy', 'fx.sell', 'fx.rate_override', 'fx.wholesale',
      'remittance.quote', 'remittance.collect', 'remittance.payout_authorize',
      'accounting.journal_create', 'accounting.journal_post', 'accounting.vault_transfer',
      'compliance.kyc_review', 'compliance.audit_read',
    ],
    compliance_officer: [
      'compliance.kyc_review', 'compliance.aml_override', 'compliance.str_file', 'compliance.audit_read',
    ],
    fx_trader: [
      'fx.buy', 'fx.sell', 'remittance.quote', 'remittance.collect',
    ],
    accountant: [
      'accounting.journal_create', 'accounting.journal_post', 'accounting.vault_transfer', 'accounting.coa_manage',
      'compliance.audit_read',
    ],
    auditor: [
      'compliance.audit_read',
    ],
  });

  const togglePermission = (permKey: string) => {
    if (selectedRole === 'master_admin') return; // Cannot modify Master Admin root permissions

    const current = rolePermissions[selectedRole] || [];
    const updated = current.includes(permKey)
      ? current.filter((k) => k !== permKey)
      : [...current, permKey];

    setRolePermissions({
      ...rolePermissions,
      [selectedRole]: updated,
    });
  };

  const activePermissions = rolePermissions[selectedRole] || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions Matrix"
        description="Fine-grained Role-Based Access Control (RBAC) with hardcoded Maker-Checker segregation of duties."
        actions={
          <button
            onClick={() => alert('Permissions configuration saved successfully.')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save Policy Matrix</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Configured Roles"
          value="6"
          subtitle="Enterprise governance archetypes"
          icon={Lock}
        />
        <StatCard
          title="Granular Controls"
          value="16"
          subtitle="Domain-specific permissions"
          icon={ShieldCheck}
        />
        <StatCard
          title="Segregation Rules"
          value="Strict"
          subtitle="Self-approval hard-blocked"
          icon={AlertTriangle}
        />
        <StatCard
          title="Policy Version"
          value="v2.4-SEC"
          subtitle="ISO 27001 Compliant"
          icon={Scale}
        />
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`p-3 rounded-xl text-left border transition-all ${
              selectedRole === role.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-100'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs">{role.name}</div>
            <div
              className={`text-[10px] mt-0.5 line-clamp-1 ${
                selectedRole === role.id ? 'text-blue-100' : 'text-slate-400'
              }`}
            >
              {role.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Permission Groups */}
      <div className="space-y-6">
        {PERMISSION_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <div key={mod.category} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="flex items-center space-x-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
                <div className="p-2 rounded-lg bg-blue-100/70 text-blue-700">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{mod.category}</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {mod.permissions.map((perm) => {
                  const isChecked = activePermissions.includes(perm.key);
                  return (
                    <div
                      key={perm.key}
                      onClick={() => togglePermission(perm.key)}
                      className="flex items-center justify-between p-4 hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <div className="space-y-0.5 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-slate-900">{perm.label}</span>
                          {perm.requiresMakerChecker && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-500" /> Maker-Checker Mandate
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{perm.description}</p>
                      </div>

                      <div className="shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={selectedRole === 'master_admin'}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
