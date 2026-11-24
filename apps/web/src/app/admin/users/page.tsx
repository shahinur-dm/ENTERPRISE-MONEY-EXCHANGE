'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Users,
  ShieldCheck,
  Building2,
  Lock,
  Plus,
  KeyRound,
  UserX,
  Mail,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  totpEnabled: boolean;
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'USR-001',
      name: 'Dr. Shahinur Rahman',
      email: 'admin@moneyexchange.com',
      role: 'Master Admin',
      branch: 'Global Corporate HQ',
      totpEnabled: true,
      status: 'active',
      lastActive: 'Just now',
      createdAt: '2026-01-10',
    },
    {
      id: 'USR-002',
      name: 'Mohammad Farooq',
      email: 'farooq.k@dawat-erp.com',
      role: 'Branch Manager',
      branch: 'Kuala Lumpur Central (KUL-01)',
      totpEnabled: true,
      status: 'active',
      lastActive: '12 mins ago',
      createdAt: '2026-01-15',
    },
    {
      id: 'USR-003',
      name: 'Tariqul Islam',
      email: 'tariqul.i@dawat-erp.com',
      role: 'Compliance Officer',
      branch: 'Dhaka Motijheel Hub (DHK-01)',
      totpEnabled: true,
      status: 'active',
      lastActive: '25 mins ago',
      createdAt: '2026-02-01',
    },
    {
      id: 'USR-004',
      name: 'Nurul Huda',
      email: 'nurul.h@dawat-erp.com',
      role: 'FX Senior Trader',
      branch: 'Kuala Lumpur Central (KUL-01)',
      totpEnabled: true,
      status: 'active',
      lastActive: '1 hour ago',
      createdAt: '2026-02-10',
    },
    {
      id: 'USR-005',
      name: 'Salma Begum',
      email: 'salma.b@dawat-erp.com',
      role: 'Chief Accountant',
      branch: 'Dhaka Motijheel Hub (DHK-01)',
      totpEnabled: true,
      status: 'active',
      lastActive: '3 hours ago',
      createdAt: '2026-02-12',
    },
    {
      id: 'USR-006',
      name: 'Ahmad Faiz',
      email: 'faiz.a@dawat-erp.com',
      role: 'FX Cashier',
      branch: 'Johor Bahru Branch (JHR-01)',
      totpEnabled: false,
      status: 'pending',
      lastActive: 'Never',
      createdAt: '2026-11-20',
    },
  ]);

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'FX Cashier',
    branch: 'Kuala Lumpur Central (KUL-01)',
  });

  const filteredUsers = roleFilter === 'ALL'
    ? users
    : users.filter((u) => u.role.toLowerCase().includes(roleFilter.toLowerCase()));

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created: UserRecord = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      branch: newUser.branch,
      totpEnabled: false,
      status: 'active',
      lastActive: 'Just invited',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers([created, ...users]);
    setNewUser({ name: '', email: '', role: 'FX Cashier', branch: 'Kuala Lumpur Central (KUL-01)' });
    setIsInviteModalOpen(false);
  };

  const columns: Column<UserRecord>[] = [
    {
      header: 'Operator',
      accessorKey: 'name',
      cell: (item) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs">
            {item.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
            <div className="text-xs text-slate-500 font-mono">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      accessorKey: 'role',
      cell: (item) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          {item.role}
        </span>
      ),
    },
    {
      header: 'Assigned Branch',
      accessorKey: 'branch',
      cell: (item) => (
        <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          {item.branch}
        </span>
      ),
    },
    {
      header: '2FA / TOTP',
      accessorKey: 'totpEnabled',
      cell: (item) =>
        item.totpEnabled ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Enforced
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <XCircle className="w-3 h-3 text-amber-500" /> Pending Setup
          </span>
        ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Last Active',
      accessorKey: 'lastActive',
      cell: (item) => <span className="text-xs text-slate-500">{item.lastActive}</span>,
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (item) => (
        <div className="flex items-center space-x-1.5">
          <button
            title="Reset TOTP"
            onClick={() => alert(`Reset TOTP token for ${item.name}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <button
            title="Toggle Status"
            onClick={() => {
              setUsers(
                users.map((u) =>
                  u.id === item.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
                )
              );
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <UserX className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Operator Management"
        description="Provision enterprise users, assign granular roles, bind branch scopes, and enforce TOTP multi-factor authentication."
        actions={
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Operator</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Operators"
          value={users.length.toString()}
          subtitle="Across 4 active branches"
          icon={Users}
        />
        <StatCard
          title="2FA Enforced"
          value={`${Math.round((users.filter((u) => u.totpEnabled).length / users.length) * 100)}%`}
          subtitle="Mandatory for financial actions"
          icon={ShieldCheck}
        />
        <StatCard
          title="Active Sessions"
          value="5"
          subtitle="Real-time operators online"
          icon={Building2}
        />
        <StatCard
          title="Security Invariant"
          value="Enforced"
          subtitle="Strict branch scoping active"
          icon={Lock}
        />
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Admin', 'Manager', 'Compliance', 'Trader', 'Accountant', 'Cashier'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              roleFilter === role
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {role === 'ALL' ? 'All Roles' : role}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredUsers}
          searchKey="name"
          searchPlaceholder="Search operator by name or email..."
        />
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Invite Enterprise Operator</h3>
            <p className="text-xs text-slate-500 mb-5">
              An invitation email with TOTP registration link will be dispatched.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="operator@dawat-erp.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="FX Cashier">FX Cashier (Counter Sales & Purchases)</option>
                  <option value="FX Senior Trader">FX Senior Trader (Rate Overrides & Wholesale)</option>
                  <option value="Compliance Officer">Compliance Officer (AML & KYC Verification)</option>
                  <option value="Branch Manager">Branch Manager (Maker-Checker Approvals)</option>
                  <option value="Chief Accountant">Chief Accountant (Journals & Ledger Audits)</option>
                  <option value="Master Admin">Master Admin (Full System Privileges)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Branch</label>
                <select
                  value={newUser.branch}
                  onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Kuala Lumpur Central (KUL-01)">Kuala Lumpur Central (KUL-01)</option>
                  <option value="Dhaka Motijheel Hub (DHK-01)">Dhaka Motijheel Hub (DHK-01)</option>
                  <option value="Chittagong Agrabad (CTG-01)">Chittagong Agrabad (CTG-01)</option>
                  <option value="Johor Bahru Branch (JHR-01)">Johor Bahru Branch (JHR-01)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Create & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
