'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ApiClient } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@moneyexchange.com');
  const [password, setPassword] = useState('Admin@123456');
  const [totpCode, setTotpCode] = useState('');
  const [requires2Fa, setRequires2Fa] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await ApiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Invalid institutional credentials');
      return;
    }

    if (res.data?.requires2fa) {
      setRequires2Fa(true);
      setTempUserId(res.data.userId);
      return;
    }

    if (res.data?.accessToken) {
      ApiClient.setTokens(res.data.accessToken, res.data.refreshToken);
      router.push('/');
    }
  };

  const handleVerify2Fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUserId) return;
    setLoading(true);
    setError(null);

    const res = await ApiClient.request('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ userId: tempUserId, token: totpCode }),
    });

    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Invalid or expired 2FA code');
      return;
    }

    if (res.data?.accessToken) {
      ApiClient.setTokens(res.data.accessToken, res.data.refreshToken);
      router.push('/');
    }
  };

  const fillCredential = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6">
      <div className="w-full max-w-md">
        {/* Institutional Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            DAWAT ERP
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mt-1">
            Enterprise Money Exchange & International Remittance
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 flex items-start space-x-2.5 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {!requires2Fa ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@moneyexchange.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit TLS Encrypted</span>
                </span>
                <span className="text-[11px] text-slate-500">Auto-lock after 5 fails</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer mt-4"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to ERP Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify2Fa} className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-400 mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter the 6-digit code from your authenticator application.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full tracking-[0.5em] text-center font-mono text-xl font-extrabold rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Confirm TOTP Code'}
              </button>
            </form>
          )}

          {/* Institutional Role Quick Select for Demonstration */}
          <div className="mt-8 pt-5 border-t border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Institutional Demonstration Profiles:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredential('admin@moneyexchange.com', 'Admin@123456')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">Master Admin</div>
                <div className="text-[10px] text-slate-400">admin@moneyexchange.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredential('accountant@moneyexchange.com', 'Accountant@123456')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">Accountant</div>
                <div className="text-[10px] text-slate-400">accountant@moneyexchange.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredential('agent.kul@moneyexchange.com', 'Agent@123456')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">KUL Agent</div>
                <div className="text-[10px] text-slate-400">agent.kul@moneyexchange.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredential('compliance@moneyexchange.com', 'Compliance@123456')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">Compliance</div>
                <div className="text-[10px] text-slate-400">compliance@moneyexchange.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>Dawat IT & Consultancy • Product Engineering</p>
          <p className="mt-1 text-[11px] text-slate-600">Strict Maker-Checker Authorization Enforced</p>
        </div>
      </div>
    </div>
  );
}
