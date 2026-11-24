'use client';

import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, CheckCircle2, ShieldAlert } from 'lucide-react';
import { DecimalMath } from '@erp/shared';

export default function CurrencySalePage() {
  const [customer, setCustomer] = useState('Rahim Trading Corp');
  const [currency, setCurrency] = useState('MYR');
  const [quantity, setQuantity] = useState('20000');
  const [sellRate, setSellRate] = useState('35.00');
  const [receivedAmount, setReceivedAmount] = useState('700000');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // System-derived WAC cost basis (PRD rule: cost basis from system; agent cannot edit)
  const costBasisRate = '33.00';
  const directExpense = '500.00';

  // Institutional profit calculation
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            <span>New Currency Sale (FX Sell)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sell foreign currency with automated cost-basis retrieval and real-time realized profit calculation.
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-mono text-emerald-800">
          <span>Min Allowed Sell Rate: </span>
          <strong>34.50 BDT</strong>
        </div>
      </div>

      {isSubmitted ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Currency Sale Executed & Posted</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Sale invoice <strong>SAL-202611-000883</strong> posted. Realized FX Gain of <strong>৳ {Number(netContribution).toLocaleString()} BDT</strong> recognized in general ledger.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          >
            Record Another Sale
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Customer / Dealer
              </label>
              <input
                type="text"
                required
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Sold Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
              >
                <option value="MYR">MYR - Malaysian Ringgit (Available: 150,000 RM)</option>
                <option value="USD">USD - United States Dollar (Available: $25,000)</option>
                <option value="EUR">EUR - Euro (Available: €12,000)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Sale Quantity (Foreign Units)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Selling Rate (BDT per unit)
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={sellRate}
                onChange={(e) => setSellRate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Institutional Cost-Basis & Realized Profit Preview (PRD Formula) */}
          <div className="rounded-lg bg-emerald-50/50 p-4 border border-emerald-200/80 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Gross Sale Proceeds:</span>
              <strong className="text-slate-900 font-bold">৳ {Number(grossProceeds).toLocaleString()} BDT</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>System WAC Cost Basis (Locked @ {costBasisRate}):</span>
              <span>- ৳ {Number(totalCost).toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Direct Transaction Processing Expense:</span>
              <span>- ৳ {Number(directExpense).toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between text-emerald-800 pt-2 border-t border-emerald-200 text-sm font-bold">
              <span>Net Transaction Contribution (Realized Profit):</span>
              <span>+ ৳ {Number(netContribution).toLocaleString()} BDT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Received Settlement Amount (BDT)
              </label>
              <input
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Customer Receivable (Due)
              </label>
              <input
                type="text"
                disabled
                value={`৳ ${Number(dueAmount).toLocaleString()} BDT`}
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs font-mono font-bold text-rose-600"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 shadow-sm cursor-pointer"
            >
              Confirm Sale & Release Currency
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
