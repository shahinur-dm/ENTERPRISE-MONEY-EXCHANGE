'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Send,
  User,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Coins,
  Wallet,
} from 'lucide-react';

export default function NewRemittancePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [senderName, setSenderName] = useState('Mohammad Rahim');
  const [senderPhone, setSenderPhone] = useState('+60123456789');
  const [senderKyc, setSenderKyc] = useState('PASSPORT-A9842103');
  const [beneficiaryName, setBeneficiaryName] = useState('Rokeya Begum');
  const [payoutMethod, setPayoutMethod] = useState<'BANK' | 'MFS'>('BANK');
  const [bankName, setBankName] = useState('Islami Bank Bangladesh PLC');
  const [accountNumber, setAccountNumber] = useState('205011802938471');
  const [mfsProvider, setMfsProvider] = useState('bKash');
  const [mfsNumber, setMfsNumber] = useState('01712345678');
  const [sourceAmount, setSourceAmount] = useState('2500');
  const [rate] = useState(35.00);
  const [quoteTtl, setQuoteTtl] = useState(892);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const transferFee = 10.00;
  const targetAmount = (parseFloat(sourceAmount || '0') * rate).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const totalPayable = (parseFloat(sourceAmount || '0') + transferFee).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const generatedId = `REM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setSuccessId(generatedId);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create Outward Remittance"
        description="Book guaranteed corridor transfer from Malaysia (MYR) to Bangladesh (BDT) with 15-minute rate lock."
      />

      {successId ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Remittance Order Booked!</h2>
          <p className="text-sm text-slate-600">
            Transaction Reference: <span className="font-mono font-bold text-blue-600">{successId}</span>
          </p>
          <div className="p-4 rounded-xl bg-slate-50 max-w-md mx-auto text-xs text-left space-y-2 border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Sender:</span>
              <span className="font-semibold">{senderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary:</span>
              <span className="font-semibold">{beneficiaryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Payout:</span>
              <span className="font-mono font-bold text-emerald-700">{targetAmount} BDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-blue-600">FUNDS_COLLECTED (Pending AML)</span>
            </div>
          </div>
          <div className="flex justify-center space-x-3 pt-4">
            <button
              onClick={() => router.push(`/remittances/${successId}`)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
            >
              View Voucher Details
            </button>
            <button
              onClick={() => {
                setSuccessId(null);
                setStep(1);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
            >
              Book Another Remittance
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Progress Steps Header */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
            <div className={`p-4 flex items-center space-x-2 border-r border-slate-200 ${step === 1 ? 'text-blue-600 bg-white border-b-2 border-b-blue-600 font-bold' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">1</span>
              <span>Sender & KYC</span>
            </div>
            <div className={`p-4 flex items-center space-x-2 border-r border-slate-200 ${step === 2 ? 'text-blue-600 bg-white border-b-2 border-b-blue-600 font-bold' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">2</span>
              <span>Beneficiary & Payout</span>
            </div>
            <div className={`p-4 flex items-center space-x-2 ${step === 3 ? 'text-blue-600 bg-white border-b-2 border-b-blue-600 font-bold' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">3</span>
              <span>Quote & Settlement</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Sender Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name (as per Passport / NRIC)</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Contact (+60)</label>
                    <input
                      type="text"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">KYC Passport / Work Permit No</label>
                    <input
                      type="text"
                      required
                      value={senderKyc}
                      onChange={(e) => setSenderKyc(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
                  >
                    <span>Proceed to Beneficiary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Beneficiary & Destination Routing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Beneficiary Full Name</label>
                    <input
                      type="text"
                      required
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center space-x-4 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="method"
                        checked={payoutMethod === 'BANK'}
                        onChange={() => setPayoutMethod('BANK')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-800">Commercial Bank Account</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="method"
                        checked={payoutMethod === 'MFS'}
                        onChange={() => setPayoutMethod('MFS')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-800">Mobile Financial Services (MFS)</span>
                    </label>
                  </div>

                  {payoutMethod === 'BANK' ? (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                        >
                          <option>Islami Bank Bangladesh PLC</option>
                          <option>Dutch-Bangla Bank PLC</option>
                          <option>Sonali Bank PLC</option>
                          <option>BRAC Bank PLC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Account Number</label>
                        <input
                          type="text"
                          required
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">MFS Wallet Provider</label>
                        <select
                          value={mfsProvider}
                          onChange={(e) => setMfsProvider(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                        >
                          <option>bKash</option>
                          <option>Nagad</option>
                          <option>Rocket</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Registered Mobile Number (+880)</label>
                        <input
                          type="text"
                          required
                          value={mfsNumber}
                          onChange={(e) => setMfsNumber(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
                  >
                    <span>Proceed to Rate Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                  <div className="flex items-center space-x-2 text-blue-800 font-semibold">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Guaranteed Rate Quote Locked: 1 MYR = {rate.toFixed(2)} BDT</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700">TTL: {quoteTtl}s</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Source Remittance Amount (MYR)</span>
                    <input
                      type="number"
                      required
                      min="50"
                      max="50000"
                      value={sourceAmount}
                      onChange={(e) => setSourceAmount(e.target.value)}
                      className="w-full text-2xl font-bold font-mono text-slate-900 bg-transparent border-b border-slate-300 py-1 outline-none focus:border-blue-600"
                    />
                    <span className="text-[10px] text-slate-400 block pt-1">Service Fee: {transferFee.toFixed(2)} MYR</span>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 space-y-1 border border-emerald-200">
                    <span className="text-xs text-emerald-700 font-semibold">Net Beneficiary Receives (BDT)</span>
                    <div className="text-2xl font-bold font-mono text-emerald-800 py-1">
                      {targetAmount} BDT
                    </div>
                    <span className="text-[10px] text-emerald-600 block pt-1">Total Debit: {totalPayable} MYR</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
                  <div className="font-semibold text-slate-800">Compliance & Accounting Notice</div>
                  <p>
                    Fund collection will automatically post a balanced double-entry voucher debiting Branch Cash Float (1010) and crediting Remittance Clearing Account (1040).
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Committing Voucher...' : 'Confirm & Collect Payment'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
