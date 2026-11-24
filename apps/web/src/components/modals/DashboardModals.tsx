'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  ArrowRight,
  Send,
  ArrowRightLeft,
  Coins,
  Lock,
  Download,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. TRANSACTION TRACKER MODAL (Opens when clicking "Track")                  */
/* -------------------------------------------------------------------------- */
export interface TrackerItem {
  id: string;
  recipient: string;
  recipientSub?: string;
  account: string;
  status: string;
  amount: string;
  sourceAmount?: string;
  dateSent: string;
  rate: string;
  dateCompleted: string;
}

export function TransactionTrackerModal({
  item,
  onClose,
}: {
  item: TrackerItem | null;
  onClose: () => void;
}) {
  if (!item) return null;

  const steps = [
    {
      title: 'Order Created & Funds Reserved',
      time: `${item.dateSent} • 09:15 UTC`,
      desc: `Transfer initiated via ${item.account}. Source funds verified.`,
      done: true,
    },
    {
      title: 'Sanctions & AML Clearance',
      time: `${item.dateSent} • 09:16 UTC`,
      desc: 'Passed automated PEP, OFAC, and Bangladesh Bank sanction screening.',
      done: true,
    },
    {
      title: 'Treasury Conversion Locked',
      time: `${item.dateSent} • 09:18 UTC`,
      desc: `Locked at spot corridor rate ${item.rate}. Inventory cost matched.`,
      done: true,
    },
    {
      title: 'Dispatched to Payout Partner',
      time: `${item.dateSent} • 09:22 UTC`,
      desc: `Sent to partner clearing network: ${item.recipient}.`,
      done: item.dateCompleted !== 'Pending',
      active: item.dateCompleted === 'Pending',
    },
    {
      title: 'Finalized & Credited',
      time: item.dateCompleted !== 'Pending' ? `${item.dateCompleted} • 10:45 UTC` : 'Estimated in 15 mins',
      desc: item.dateCompleted !== 'Pending'
        ? `Funds credited to beneficiary account successfully.`
        : 'Awaiting destination bank settlement confirmation.',
      done: item.dateCompleted !== 'Pending',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Live Audit Trail
              </span>
              <span className="font-mono text-xs text-slate-400">ID: {item.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Transaction Tracker</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Recipient banner */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Beneficiary / Recipient</div>
            <div className="text-sm font-bold text-slate-900">{item.recipient}</div>
            <div className="text-xs text-slate-500 font-mono">{item.recipientSub}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Payout Amount</div>
            <div className="text-base font-extrabold text-blue-600 font-mono">{item.amount}</div>
            <div className="text-[11px] text-slate-400 font-mono">Rate: {item.rate}</div>
          </div>
        </div>

        {/* Timeline steps */}
        <div className="space-y-4 my-5 max-h-[320px] overflow-y-auto pr-2">
          {steps.map((st, idx) => (
            <div key={idx} className="flex items-start space-x-3 relative">
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-[13px] top-[26px] w-[2px] h-[calc(100%-10px)] ${
                    st.done ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  st.done
                    ? 'bg-blue-600 text-white'
                    : st.active
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {st.done ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{st.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographically sealed audit trail</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. SEND REMITTANCE MODAL (Opens when clicking "+ Send")                     */
/* -------------------------------------------------------------------------- */
export function SendRemittanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [sourceAmount, setSourceAmount] = useState('1,000');
  const [sourceCurrency, setSourceCurrency] = useState('MYR');
  const [destCurrency, setDestCurrency] = useState('BDT');
  const [recipient, setRecipient] = useState('Rokeya Begum (Islami Bank BD)');
  const [payoutMethod, setPayoutMethod] = useState('BANK_DEPOSIT');

  if (!isOpen) return null;

  // Rate calculation
  const numericAmount = parseFloat(sourceAmount.replace(/,/g, '')) || 0;
  const rate = 35.0; // 35 BDT per MYR
  const destinationPayout = (numericAmount * rate).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const serviceFee = 10.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Send Remittance</h3>
              <p className="text-xs text-slate-500">Fast, secure cross-border bank & wallet payout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corridor Selection & Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Beneficiary
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500"
            >
              <option value="Rokeya Begum (Islami Bank BD)">
                Rokeya Begum — Islami Bank Bangladesh (AC: 20501180293)
              </option>
              <option value="Amena Khatun (bKash Wallet)">
                Amena Khatun — bKash MFS Wallet (+8801712345678)
              </option>
              <option value="Shahidul Alam (Dutch-Bangla Bank)">
                Shahidul Alam — Dutch-Bangla Bank Ltd (AC: 1151039842)
              </option>
              <option value="FinComp A (Euro Corporate)">
                FinComp A — Citibank Europe (IBAN: DE89370400440532013000)
              </option>
            </select>
          </div>

          {/* Amount inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">You Send</label>
              <div className="relative">
                <input
                  type="text"
                  value={sourceAmount}
                  onChange={(e) => setSourceAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 font-mono"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400 font-mono">
                  {sourceCurrency}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Gets</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={destinationPayout}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-blue-600 outline-none font-mono"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-blue-400 font-mono">
                  {destCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Rate & Fee breakdown summary */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Guaranteed Exchange Rate</span>
              <span className="font-mono font-bold text-slate-900">1 {sourceCurrency} = {rate.toFixed(2)} {destCurrency}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Remittance Service Fee</span>
              <span className="font-mono text-slate-900">{serviceFee.toFixed(2)} {sourceCurrency}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="font-mono text-blue-600">
                {(numericAmount + serviceFee).toLocaleString('en-US', { minimumFractionDigits: 2 })} {sourceCurrency}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert(`Remittance order initiated for ${recipient}: ${destinationPayout} ${destCurrency}`);
              onClose();
            }}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm & Send Funds</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. QUICK CONVERT MODAL (Opens when clicking "15 Convert")                  */
/* -------------------------------------------------------------------------- */
export function QuickConvertModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromAmount, setFromAmount] = useState('1,000');

  if (!isOpen) return null;

  const numericFrom = parseFloat(fromAmount.replace(/,/g, '')) || 0;
  const fxRate = fromCurrency === 'EUR' && toCurrency === 'USD' ? 1.09 : 0.839;
  const toAmount = (numericFrom * fxRate).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Instant Currency Conversion</h3>
              <p className="text-xs text-slate-500">Live institutional spot rates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">You Convert (From)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 font-mono"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none"
              >
                <option value="EUR">EUR (€)</option>
                <option value="MYR">MYR (RM)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center -my-1">
            <button
              onClick={() => {
                const temp = fromCurrency;
                setFromCurrency(toCurrency);
                setToCurrency(temp);
              }}
              className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 shadow-2xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">You Receive (To)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={toAmount}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-emerald-600 outline-none font-mono"
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="BDT">BDT (৳)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-3 text-xs text-blue-900 flex items-center justify-between">
            <span className="font-semibold">Locked Rate (15 min TTL)</span>
            <span className="font-mono font-bold">1 {fromCurrency} = {fxRate} {toCurrency}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert(`Converted ${fromAmount} ${fromCurrency} into ${toAmount} ${toCurrency} successfully.`);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-500/20"
          >
            Execute Conversion
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. MANAGE FX RISK / FORWARD CONTRACT MODAL (Opens from "Manage FX Risk")   */
/* -------------------------------------------------------------------------- */
export function ForwardHedgingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tenor, setTenor] = useState('30_DAYS');
  const [pair, setPair] = useState('EUR/USD');
  const [notional, setNotional] = useState('50,000');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage FX Risk • New Forward</h3>
              <p className="text-xs text-slate-500">Hedge foreign exchange volatility with fixed maturity forwards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Pair</label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
            >
              <option value="EUR/USD">EUR / USD (Euro vs US Dollar)</option>
              <option value="EUR/GBP">EUR / GBP (Euro vs British Pound)</option>
              <option value="MYR/BDT">MYR / BDT (Malaysia Ringgit vs Bangladesh Taka)</option>
              <option value="USD/BDT">USD / BDT (US Dollar vs Bangladesh Taka)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notional Amount</label>
              <input
                type="text"
                value={notional}
                onChange={(e) => setNotional(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold font-mono outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Forward Tenor</label>
              <select
                value={tenor}
                onChange={(e) => setTenor(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
              >
                <option value="30_DAYS">30 Days Forward (Maturity: 24 Dec 2026)</option>
                <option value="60_DAYS">60 Days Forward (Maturity: 24 Jan 2027)</option>
                <option value="90_DAYS">90 Days Forward (Maturity: 24 Feb 2027)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5 space-y-1.5 text-xs text-indigo-950">
            <div className="flex justify-between">
              <span>Lock-in Strike Rate:</span>
              <span className="font-mono font-bold">1.0925 EUR/USD</span>
            </div>
            <div className="flex justify-between">
              <span>Required Margin (10%):</span>
              <span className="font-mono font-bold">5,000 EUR</span>
            </div>
            <p className="text-[11px] text-indigo-700/80 pt-1">
              Guarantees settlement rate on maturity regardless of spot FX market swings.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert(`Forward contract booked: ${notional} ${pair} for ${tenor}`);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/20"
          >
            Book Forward Contract
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. CREATE ALERT MODAL (Opens when clicking "+ Create alert")               */
/* -------------------------------------------------------------------------- */
export function RateAlertModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [pair, setPair] = useState('EUR/USD');
  const [targetRate, setTargetRate] = useState('1.1000');
  const [condition, setCondition] = useState('ABOVE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Rate Alert</h3>
              <p className="text-xs text-slate-500">Get notified when rates cross target</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Pair</label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
            >
              <option value="EUR/USD">EUR / USD</option>
              <option value="EUR/GBP">EUR / GBP</option>
              <option value="MYR/BDT">MYR / BDT</option>
              <option value="USD/BDT">USD / BDT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trigger</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
              >
                <option value="ABOVE">Rate Rises Above</option>
                <option value="BELOW">Rate Drops Below</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Rate</label>
              <input
                type="text"
                value={targetRate}
                onChange={(e) => setTargetRate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold font-mono outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert(`Alert set for ${pair} when rate goes ${condition} ${targetRate}`);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white"
          >
            Save Alert
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. EXPORT DATA MODAL (Opens when clicking "Export data")                   */
/* -------------------------------------------------------------------------- */
export function ExportDataModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export Financial Data</h3>
              <p className="text-xs text-slate-500">Download formatted accounting statements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              alert('Downloading CSV ledger export...');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group"
          >
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">CSV Spreadsheet</div>
                <div className="text-[11px] text-slate-500">Raw rows for Excel or Google Sheets</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={() => {
              window.print();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-rose-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">PDF Executive Report</div>
                <div className="text-[11px] text-slate-500">Board-ready institutional PDF summary</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
