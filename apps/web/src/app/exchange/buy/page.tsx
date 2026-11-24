'use client';

import React, { useState } from 'react';
import {
  ArrowDownLeft,
  Building2,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  TrendingDown,
  Coins,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DecimalMath } from '@erp/shared';

export default function CurrencyPurchasePage() {
  const [supplier, setSupplier] = useState('Metro Forex Wholesale Ltd');
  const [currency, setCurrency] = useState('MYR');
  const [quantity, setQuantity] = useState('100000');
  const [rate, setRate] = useState('33.00');
  const [paidAmount, setPaidAmount] = useState('3000000');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalValue = quantity && rate ? DecimalMath.mul(quantity, rate).toFixed(2) : '0.00';
  const dueAmount = totalValue && paidAmount ? DecimalMath.sub(totalValue, paidAmount).toFixed(2) : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Currency Purchase (FX Buy)"
        description="Procure foreign currency from authorized wholesale suppliers or interbank counters with weighted average cost inventory updates."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Max Buy Limit: 33.50 BDT
          </span>
        }
      />

      {isSubmitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Currency Purchase Booked & Posted</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Order <strong>PUR-202611-000483</strong> recorded. Stock will be credited to WAC cost pool upon confirmation of currency receipt.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            Record Another Purchase
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Purchase Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Wholesale Supplier
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Metro Forex Wholesale Ltd">Metro Forex Wholesale Ltd</option>
                  <option value="Amanah Bullion & FX Sdn Bhd">Amanah Bullion & FX Sdn Bhd</option>
                  <option value="Standard Chartered Treasury Desk">Standard Chartered Treasury Desk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Purchased Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="MYR">🇲🇾 MYR - Malaysian Ringgit</option>
                  <option value="USD">🇺🇸 USD - United States Dollar</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                  <option value="SAR">🇸🇦 SAR - Saudi Riyal</option>
                  <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Quantity (Units)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Agreed Purchase Rate (BDT)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Receiving Vault / Account
                </label>
                <input
                  type="text"
                  disabled
                  value="Kuala Lumpur Central Vault (MYR)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Disbursing Bank Account
                </label>
                <input
                  type="text"
                  disabled
                  value="Maybank Corporate Clearing Account"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600 font-medium"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Confirm Purchase & Post Journal
              </button>
            </div>
          </form>

          {/* Real-time Financial Breakdown Panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Financial Calculation
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Valuation:</span>
                  <strong className="text-slate-900 font-bold">
                    ৳ {Number(totalValue).toLocaleString()} BDT
                  </strong>
                </div>

                <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-100">
                  <span>Settlement Paid:</span>
                  <div className="flex items-center space-x-1">
                    <span>৳</span>
                    <input
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      className="w-32 rounded-lg border border-slate-300 p-1 text-right font-mono font-bold text-slate-900 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-slate-600 pt-1">
                  <span>Supplier Due:</span>
                  <strong className="text-rose-600 font-bold">
                    ৳ {Number(dueAmount).toLocaleString()} BDT
                  </strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900 font-medium leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
                Double-entry journal will debit Foreign Currency Holdings (1300) and credit Bank / Accounts Payable (2100).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
