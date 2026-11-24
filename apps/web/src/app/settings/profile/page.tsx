'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import {
  User,
  KeyRound,
  ShieldCheck,
  Building2,
  Mail,
  Lock,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function OperatorProfilePage() {
  const [success, setSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Operator Profile & Security"
        description="Manage your institutional operator credentials, active session tokens, and multi-factor authentication."
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Security credentials updated successfully. Please re-authenticate on your other devices.</span>
        </div>
      )}

      {/* Profile Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            AD
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Chief Executive Master Admin</h3>
            <p className="text-xs text-slate-500 font-mono">admin@moneyexchange.com</p>
            <div className="flex items-center space-x-2 mt-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                MASTER_ADMIN
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                KUL-01 Head Office
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 rounded-xl p-3">
            <span className="text-slate-400 block text-[11px]">Assigned Role</span>
            <span className="font-semibold text-slate-800">Master Administrator</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <span className="text-slate-400 block text-[11px]">Two-Factor Authentication</span>
            <span className="font-semibold text-emerald-700">Enforced (RFC 6238 TOTP)</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordUpdate} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <Lock className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">Update Secure Password</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password (Min 8 characters)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </div>
  );
}
