'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  User,
  Users,
  Lock,
  GitBranch,
  Building,
  Globe2,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function SettingsIndexPage() {
  const sections = [
    {
      title: 'Language & Localization',
      description: 'Switch between English and বাংলা (Bengali), configure date formats, and set base currencies.',
      href: '/settings/languages',
      icon: Globe2,
      badge: 'English / বাংলা',
    },
    {
      title: 'Operator Profile & Security',
      description: 'Manage password, view active session tokens, and configure RFC 6238 TOTP two-factor security.',
      href: '/settings/profile',
      icon: User,
      badge: 'TOTP Enforced',
    },
    {
      title: 'User Management',
      description: 'Provision staff accounts, configure branch bindings, and oversee system operator access.',
      href: '/settings/users',
      icon: Users,
      badge: '14 Operators',
    },
    {
      title: 'Roles & Permissions',
      description: 'Granular Role-Based Access Control (RBAC) with hardcoded Maker-Checker segregation of duties.',
      href: '/settings/roles',
      icon: Lock,
      badge: '6 Roles Active',
    },
    {
      title: 'Branch Management',
      description: 'Multi-country branch locations, cash vaults, teller desks, and operating licenses.',
      href: '/settings/branches',
      icon: GitBranch,
      badge: '4 Branches',
    },
    {
      title: 'System Invariants & Policies',
      description: 'Maker-Checker monetary thresholds, rate quote TTL timers, session timeouts, and audit rules.',
      href: '/settings/system',
      icon: Sliders,
      badge: 'ISO 27001 Compliant',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Configuration"
        description="Configure enterprise system parameters, operator credentials, localization, and multi-tenant branches."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => {
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
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {sec.title}
                  </h3>
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
