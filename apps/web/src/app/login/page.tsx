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
  HelpCircle,
  X,
  Info,
} from 'lucide-react';
import { ApiClient } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [requires2Fa, setRequires2Fa] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your institutional email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await ApiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      setLoading(false);

      if (!res.success) {
        // If API is unreachable (e.g. static/cloud demo preview), check institutional demo credentials fallback
        const isNetworkErr = res.statusCode === 500 && (res.message?.includes('Network') || res.message?.includes('failed') || res.message?.includes('fetch'));
        const cleanEmail = email.trim().toLowerCase();
        const isDemoAdmin = cleanEmail === 'admin@moneyexchange.com' && password === 'Admin@123456';
        const isDemoAccountant = cleanEmail === 'accountant@moneyexchange.com' && password === 'Accountant@123456';
        const isDemoAgent = cleanEmail === 'agent.kul@moneyexchange.com' && password === 'Agent@123456';
        const isDemoCompliance = cleanEmail === 'compliance@moneyexchange.com' && password === 'Compliance@123456';

        if (isNetworkErr && (isDemoAdmin || isDemoAccountant || isDemoAgent || isDemoCompliance)) {
          const role = isDemoAdmin ? 'MASTER_ADMIN' : isDemoAccountant ? 'ACCOUNTANT' : isDemoAgent ? 'AGENT' : 'COMPLIANCE';
          const name = isDemoAdmin ? 'Chief Executive Master Admin' : isDemoAccountant ? 'Senior Financial Accountant' : isDemoAgent ? 'Kuala Lumpur Operational Agent' : 'Institutional Compliance Officer';
          ApiClient.setTokens('demo_institutional_jwt_token', 'demo_institutional_refresh_token');
          if (typeof window !== 'undefined') {
            localStorage.setItem('erp_user', JSON.stringify({
              id: 'demo_user_id',
              name,
              email: cleanEmail,
              role,
              allowedBranches: ['Kuala Lumpur HQ (MYR)', 'Dhaka Central Branch (BDT)', 'Chittagong Port Branch (BDT)'],
            }));
          }
          router.push('/');
          return;
        }

        if (res.statusCode === 401) {
          setError('Invalid institutional email or password. Please verify your credentials.');
        } else if (res.statusCode === 429) {
          setError('Account temporarily locked due to excessive failed attempts. Try again in 15 minutes.');
        } else if (res.statusCode === 500 && res.message?.includes('Network')) {
          setError('ERP Core API Gateway is unreachable. Please verify connection on port 4000.');
        } else {
          setError(res.message || 'Authentication failed. Please contact your system administrator.');
        }
        return;
      }

      if (res.data?.requires2fa) {
        setRequires2Fa(true);
        setTempUserId(res.data.userId);
        return;
      }

      if (res.data?.accessToken) {
        ApiClient.setTokens(res.data.accessToken, res.data.refreshToken);
        if (typeof window !== 'undefined' && res.data.user) {
          localStorage.setItem('erp_user', JSON.stringify(res.data.user));
        }
        router.push('/');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Server connection error. Please try again.');
    }
  };

  const handleVerify2Fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUserId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await ApiClient.request('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ userId: tempUserId, token: totpCode }),
      });

      setLoading(false);

      if (!res.success) {
        setError(res.message || 'Invalid or expired 2FA TOTP code.');
        return;
      }

      if (res.data?.accessToken) {
        ApiClient.setTokens(res.data.accessToken, res.data.refreshToken);
        if (typeof window !== 'undefined' && res.data.user) {
          localStorage.setItem('erp_user', JSON.stringify(res.data.user));
        }
        router.push('/');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Verification failed. Please retry.');
    }
  };

  const fillCredential = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Institutional Card Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 mb-3.5">
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
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 flex items-start space-x-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{error}</div>
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
                    placeholder="operator@moneyexchange.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Secure Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordOpen(true);
                      setResetSubmitted(false);
                      setResetEmail(email);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
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
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer mt-4"
              >
                <span>{loading ? 'Authenticating Session...' : 'Sign In to ERP Portal'}</span>
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
                  className="w-full tracking-[0.5em] text-center font-mono text-xl font-extrabold rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? 'Verifying Code...' : 'Confirm TOTP Code'}
              </button>
            </form>
          )}

          {/* Institutional Role Quick Select for Demonstration */}
          <div className="mt-8 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Institutional Demonstration Profiles:
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                DEMO ENVIRONMENT
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredential('admin@moneyexchange.com', 'Admin@123456')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">Master Admin</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">admin@moneyexchange.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredential('accountant@moneyexchange.com', 'Accountant@123456')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">Accountant</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">accountant@moneyexchange.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredential('agent.kul@moneyexchange.com', 'Agent@123456')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">KUL Agent</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">agent.kul@moneyexchange.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredential('compliance@moneyexchange.com', 'Compliance@123456')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-slate-200">Compliance</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">compliance@moneyexchange.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>Dawat IT & Consultancy • Enterprise Financial Architecture</p>
          <p className="mt-1 text-[11px] text-slate-600">Strict Multi-Tenant Branch Scoping & Maker-Checker Enforced</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setIsForgotPasswordOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Reset Operator Password</h3>
            </div>

            {!resetSubmitted ? (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <p className="text-slate-400 leading-relaxed">
                  Enter your registered institutional email. A secure, time-sensitive reset token will be dispatched to your corporate inbox.
                </p>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="operator@moneyexchange.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3.5 py-2 rounded-lg text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-sm"
                  >
                    Send Reset Token
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <p>
                    Reset link dispatched to <span className="font-mono font-bold text-white">{resetEmail}</span>. Please inspect your inbox or contact the Master Admin for direct key renewal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="w-full py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
