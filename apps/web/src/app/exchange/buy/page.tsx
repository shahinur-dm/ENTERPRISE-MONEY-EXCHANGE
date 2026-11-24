'use client';

import React, { useState } from 'react';
import { ArrowDownLeft, Calculator, Building, Receipt, CheckCircle2 } from 'lucide-react';
import { DecimalMath } from '@erp/shared';

export default function CurrencyPurchasePage() {
  const [supplier, setSupplier] = useState('Metro Forex Wholesale Ltd');
  const [currency, setCurrency] = useState('MYR');
  const [quantity, setQuantity] = useState('100000');
  const [rate, setRate] = useState('33.00');
  const [paidAmount, setPaidAmount] = useState('3000000');
  const [receivingAccount, setReceivingAccount] = useState('Kuala Lumpur Foreign Currency Vault (MYR)');
  const [paymentAccount, setPaymentAccount] = useState('Maybank Corporate Account (MYR)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Decimal calculations matching PRD Section 6 (Currency Purchase)
  // Example: 100,000 MYR @ 33 BDT = 3,300,000 BDT purchase value; Paid: 3,000,000 BDT; Due: 300,000 BDT
  const totalValue = quantity && rate ? DecimalMath.mul(quantity, rate).toFixed(2) : '0.00';
  const dueAmount = totalValue && paidAmount ? DecimalMath.sub(totalValue, paidAmount).toFixed(2) : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ArrowDownLeft className="w-5 h-5 text-blue-600" />
            <span>New Currency Purchase (FX Buy)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Procure foreign currency from authorized wholesale suppliers or interbank counters.
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-mono text-blue-800">
          <span>Max Allowed Buy Rate: </span>
          <strong>33.50 BDT</strong>
        </div>
      </div>

      {isSubmitted ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Purchase Order Submitted Successfully</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Order <strong>PUR-202611-000483</strong> recorded. Stock will be credited to WAC cost pool upon confirmation of currency receipt.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          >
            Record Another Purchase
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Wholesale Supplier
              </label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
              >
                <option value="Metro Forex Wholesale Ltd">Metro Forex Wholesale Ltd</option>
                <option value="Amanah Bullion & FX Sdn Bhd">Amanah Bullion & FX Sdn Bhd</option>
                <option value="Standard Chartered Treasury Desk">Standard Chartered Treasury Desk</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Purchased Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
              >
                <option value="MYR">MYR - Malaysian Ringgit</option>
                <option value="USD">USD - United States Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="SGD">SGD - Singapore Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Quantity (Foreign Units)
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
                Agreed Purchase Rate (BDT per unit)
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Institutional Financial Calculation Box */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Purchase Valuation:</span>
              <strong className="text-slate-900 font-bold">৳ {Number(totalValue).toLocaleString()} BDT</strong>
            </div>
            <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200">
              <span>Settlement Paid Amount:</span>
              <div className="flex items-center space-x-1">
                <span>৳</span>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-36 rounded border border-slate-300 p-1 text-right font-mono font-bold text-slate-900 bg-white"
                />
              </div>
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Remaining Supplier Payable (Due):</span>
              <strong className="text-rose-600 font-bold">৳ {Number(dueAmount).toLocaleString()} BDT</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Receiving Vault / Account
              </label>
              <input
                type="text"
                disabled
                value={receivingAccount}
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Disbursing Bank / Cash Account
              </label>
              <input
                type="text"
                disabled
                value={paymentAccount}
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-600"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              Post Purchase & Authorize
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
