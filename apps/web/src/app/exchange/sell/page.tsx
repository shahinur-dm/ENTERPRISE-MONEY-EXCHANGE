'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Coins,
  DollarSign,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DecimalMath } from '@erp/shared';

export default function CurrencySalePage() {
  const [customer, setCustomer] = useState('Rahim Trading Corp');
  const [currency, setCurrency] = useState('MYR');
  const [quantity, setQuantity] = useState('20000');
  const [sellRate, setSellRate] = useState('35.00');
  const [receivedAmount, setReceivedAmount] = useState('700000');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const costBasisRate = '33.00';
  const directExpense = '500.00';

  const grossProceeds = quantity && sellRate ? DecimalMath.mul(quantity, sellRate).toFixed(2) : '0.00';
  const totalCost = quantity && costBasisRate ? DecimalMath.mul(quantity, costBasisRate).toFixed(2) : '0.00';
  const grossProfit = DecimalMath.sub(grossProceeds, totalCost).toFixed(2);
  const netContribution = DecimalMath.sub(grossProfit, directExpense).toFixed(2);
  const dueAmount = DecimalMath.sub(grossProceeds, receivedAmount).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Currency Sale (FX Sell)"
        description="Liquidate foreign currency holding with real-time automated Weighted Average Cost (WAC) derivation and instant realized FX gain recognition."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Min Sell Limit: 34.50 BDT
          </span>
        }
      />

      {isSubmitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Currency Sale Executed & Posted</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Sale invoice <strong>SAL-202611-000883</strong> posted. Realized FX Gain of{' '}
            <strong>৳ {Number(netContribution).toLocaleString()} BDT</strong> recognized in general ledger.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            Record Another Sale
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Customer / Dealer
                </label>
                <input
                  type="text"
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sold Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 bg-white"
                >
                  <option value="MYR">🇲🇾 MYR - Malaysian Ringgit (Stock: 150,000 RM)</option>
                  <option value="USD">🇺🇸 USD - US Dollar (Stock: $25,000)</option>
                  <option value="EUR">🇪🇺 EUR - Euro (Stock: €12,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sale Quantity (Foreign Units)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Selling Rate (BDT per unit)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={sellRate}
                  onChange={(e) => setSellRate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Received Amount (BDT)
                </label>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Customer Due
                </label>
                <input
                  type="text"
                  disabled
                  value={`৳ ${Number(dueAmount).toLocaleString()} BDT`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono font-bold text-rose-600"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Execute Sale & Release Currency
              </button>
            </div>
          </form>

          {/* Realized Profit Live Card */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                WAC Profit Recognition
              </h3>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Gross Sale Proceeds:</span>
                  <strong className="text-slate-900 font-bold">
                    ৳ {Number(grossProceeds).toLocaleString()} BDT
                  </strong>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>WAC Cost Basis (@{costBasisRate}):</span>
                  <span>- ৳ {Number(totalCost).toLocaleString()} BDT</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Direct Transaction Fee:</span>
                  <span>- ৳ {Number(directExpense).toLocaleString()} BDT</span>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex justify-between text-sm font-bold text-emerald-800">
                  <span>Realized FX Gain:</span>
                  <span>+ ৳ {Number(netContribution).toLocaleString()} BDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
