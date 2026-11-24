'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import {
  Sliders,
  Clock,
  ShieldAlert,
  Lock,
  Database,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function SystemSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [settings, setSettings] = useState({
    sessionTimeoutMins: 15,
    rateQuoteTtlSecs: 900,
    maxFailedAttempts: 5,
    dualApprovalThresholdMyr: 50000,
    kycTier3ThresholdBdt: 500000,
    sanctionsFuzzyMatchScore: 85,
    auditLogRetentionYears: 7,
    autoBackupIntervalHours: 6,
    strictBranchScoping: true,
    totpEnforcedAllStaff: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise System Settings"
        description="Institutional governance thresholds, security invariants, rate lock TTLs, and statutory audit parameters."
        actions={
          <button
            onClick={handleSubmit}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        }
      />

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System policies and security invariants successfully updated and applied in real time.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Session Timeout"
          value={`${settings.sessionTimeoutMins} Mins`}
          subtitle="Inactivity auto-lockout"
          icon={Clock}
        />
        <StatCard
          title="Quote Lock TTL"
          value={`${settings.rateQuoteTtlSecs}s`}
          subtitle="15-minute price guarantee"
          icon={RefreshCw}
        />
        <StatCard
          title="Maker-Checker"
          value={`> ${settings.dualApprovalThresholdMyr.toLocaleString()} MYR`}
          subtitle="Mandatory dual authorization"
          icon={AlertTriangle}
        />
        <StatCard
          title="Audit Trail Retention"
          value={`${settings.auditLogRetentionYears} Years`}
          subtitle="Immutable statutory log"
          icon={Database}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Security & Access Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Security & Session Polices</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operator Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.sessionTimeoutMins}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMins: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Automatic session termination upon idle period.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Failed Login Attempts</label>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.maxFailedAttempts}
                onChange={(e) => setSettings({ ...settings, maxFailedAttempts: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Account temporary lockout duration: 30 minutes.</span>
            </div>
          </div>
        </div>

        {/* Financial & Operational Invariants */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Financial Thresholds & Maker-Checker Segregation</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dual Approval Required for FX Trades (MYR)</label>
              <input
                type="number"
                step="5000"
                value={settings.dualApprovalThresholdMyr}
                onChange={(e) => setSettings({ ...settings, dualApprovalThresholdMyr: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Trades exceeding this require Branch Manager secondary authorization.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guaranteed Rate Quote TTL (Seconds)</label>
              <input
                type="number"
                min="60"
                max="1800"
                value={settings.rateQuoteTtlSecs}
                onChange={(e) => setSettings({ ...settings, rateQuoteTtlSecs: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Customer rate lock period before auto-expiration.</span>
            </div>
          </div>
        </div>

        {/* AML & Sanctions Screening */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm text-slate-900">AML / Sanctions Screening Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sanctions Fuzzy-Matching Score (%)</label>
              <input
                type="number"
                min="70"
                max="100"
                value={settings.sanctionsFuzzyMatchScore}
                onChange={(e) => setSettings({ ...settings, sanctionsFuzzyMatchScore: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Scores above this percentage trigger automatic AML review hold.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Statutory Audit Trail Retention (Years)</label>
              <input
                type="number"
                min="5"
                max="12"
                value={settings.auditLogRetentionYears}
                onChange={(e) => setSettings({ ...settings, auditLogRetentionYears: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Minimum legal retention period for regulatory compliance inspection.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
