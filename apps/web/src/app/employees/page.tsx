'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Users, ShieldCheck } from 'lucide-react';

interface EmployeeItem {
  id: string;
  name: string;
  employeeCode: string;
  role: string;
  branch: string;
  email: string;
  phone: string;
  joinedDate: string;
  status: string;
}

export default function EmployeesPage() {
  const [employees] = useState<EmployeeItem[]>([
    { id: '1', name: 'Farhana Yasmin', employeeCode: 'EMP-KUL-001', role: 'Chief Currency Dealer', branch: 'Kuala Lumpur HQ', email: 'farhana.y@dawatremit.com', phone: '+60 12-441-9922', joinedDate: '15 Jan 2024', status: 'active' },
    { id: '2', name: 'Kamrul Hasan', employeeCode: 'EMP-DHK-002', role: 'Principal Settlement Officer', branch: 'Dhaka Principal', email: 'kamrul.h@dawatexchange.com', phone: '+880 1711-889900', joinedDate: '1 Feb 2024', status: 'active' },
    { id: '3', name: 'Ibrahim Ali', employeeCode: 'EMP-KUL-003', role: 'Senior Vault Cashier', branch: 'Kuala Lumpur HQ', email: 'ibrahim.a@dawatremit.com', phone: '+60 18-332-1100', joinedDate: '10 Mar 2024', status: 'active' },
    { id: '4', name: 'Nusrat Jahan', employeeCode: 'EMP-DHK-004', role: 'Compliance Officer', branch: 'Dhaka Principal', email: 'nusrat.j@dawatexchange.com', phone: '+880 1819-223344', joinedDate: '1 Apr 2024', status: 'active' },
  ]);

  const columns: Column<EmployeeItem>[] = [
    {
      header: 'Employee Name & Code',
      accessorKey: 'name',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="font-mono text-[11px] text-slate-400">{item.employeeCode}</div>
        </div>
      ),
    },
    {
      header: 'Role / Designation',
      accessorKey: 'role',
      cell: (item) => <span className="font-semibold text-slate-800">{item.role}</span>,
    },
    {
      header: 'Assigned Branch',
      accessorKey: 'branch',
      cell: (item) => <span className="text-slate-600 text-xs font-medium">{item.branch}</span>,
    },
    {
      header: 'Contact Details',
      accessorKey: 'email',
      cell: (item) => (
        <div className="text-xs">
          <div className="text-slate-700">{item.email}</div>
          <div className="font-mono text-slate-400">{item.phone}</div>
        </div>
      ),
    },
    {
      header: 'Date Joined',
      accessorKey: 'joinedDate',
      cell: (item) => <span className="text-slate-500 text-xs">{item.joinedDate}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        description="Branch staff, currency dealers, compliance officers, and cash custodians."
        actions={
          <button
            onClick={() => alert('Add Employee Modal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value="18" currency="Staff" changeLabel="Across 3 branches" variant="white" />
        <StatCard title="Licensed Dealers" value="4" currency="Certified" changeLabel="Forex licensed" variant="white" />
        <StatCard title="Compliance Officers" value="3" currency="AML Certified" changeLabel="Independent oversight" variant="white" />
        <StatCard title="Active Shifts" value="12" currency="On Duty" changeLabel="All counters covered" variant="white" />
      </div>

      <DataTable
        title="Enterprise Staff Registry"
        subtitle="Staff assignments dictate branch scoping and Maker-Checker authorization rights."
        columns={columns}
        data={employees}
        searchPlaceholder="Search employees..."
      />
    </div>
  );
}
