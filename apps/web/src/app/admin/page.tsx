'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  ShieldCheck,
  Lock,
  GitBranch,
  Building,
  Sliders,
  Users,
  ChevronRight,
  Database,
  KeyRound,
  FileText,
} from 'lucide-react';

export default function AdminIndexPage() {
  const adminSections = [
    {
      title: 'User & Operator Management',
      description: 'Provision staff accounts, configure branch bindings, and enforce TOTP multi-factor authentication.',
      href: '/admin/users',
      icon: Users,
      badge: '14 Active Operators',
    },
    {
      title: 'Roles & Permissions Matrix',
      description: 'Granular Role-Based Access Control (RBAC) with hardcoded Maker-Checker segregation of duties.',
      href: '/admin/roles',
      icon: Lock,
      badge: '6 Configured Roles',
    },
    {
      title: 'Branch Network Management',
      description: 'Multi-country branch locations, physical vault balances, teller desks, and operating licenses.',
      href: '/admin/branches',
      icon: GitBranch,
      badge: '4 Branches (MYS & BGD)',
    },
    {
      title: 'Organization & Legal Entities',
      description: 'Statutory registration, central bank authorizations, and functional accounting currencies.',
      href: '/admin/organization',
      icon: Building,
      badge: '2 Legal Entities',
    },
    {
      title: 'System Settings & Invariants',
      description: 'Maker-Checker monetary thresholds, rate quote TTL timers, session timeouts, and audit rules.',
      href: '/admin/settings',
      icon: Sliders,
      badge: 'ISO 27001 Compliant',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration Suite"
        description="Enterprise configuration, multi-entity corporate parameters, security invariants, and operator privilege control."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.href}
              href={sec.href}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:border-blue-400 hover:shadow-md transition-all flex items-start justify-between group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {sec.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                    {sec.description}
                  </p>
                  <span className="inline-block font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mt-2">
                    {sec.badge}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
