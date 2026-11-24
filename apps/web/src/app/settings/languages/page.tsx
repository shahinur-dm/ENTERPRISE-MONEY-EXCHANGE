'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Globe2,
  CheckCircle2,
  Save,
  Languages,
  DollarSign,
  Calendar,
  Clock,
} from 'lucide-react';

export default function LanguageSettingsPage() {
  const [selectedLang, setSelectedLang] = useState<'en' | 'bn'>('en');
  const [currency, setCurrency] = useState('MYR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('erp_lang', selectedLang);
      localStorage.setItem('erp_currency', currency);
      localStorage.setItem('erp_date_format', dateFormat);
      window.dispatchEvent(new Event('language-change'));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Language & Localization Settings"
        description="Bilingual English and বাংলা (Bengali) interface configuration, number formatting, and timezone settings."
      />

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Language and localization preferences successfully saved and applied.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        {/* Language Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Languages className="w-4 h-4 text-blue-600" />
            Interface Display Language (ইন্টারফেস ভাষা)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setSelectedLang('en')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedLang === 'en'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">English (Institutional Default)</div>
                  <div className="text-xs text-slate-500 mt-0.5">International Banking & Accounting Standard</div>
                </div>
                {selectedLang === 'en' && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
              </div>
            </div>

            <div
              onClick={() => setSelectedLang('bn')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedLang === 'bn'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">বাংলা (Bengali Localization)</div>
                  <div className="text-xs text-slate-500 mt-0.5">বাংলাদেশ করিডোর ও রেমিট্যান্স অপারেশনস</div>
                </div>
                {selectedLang === 'bn' && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Regional Formats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default Base Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
            >
              <option value="MYR">MYR — Malaysian Ringgit (Kuala Lumpur HQ)</option>
              <option value="BDT">BDT — Bangladeshi Taka (Dhaka Hub)</option>
              <option value="USD">USD — US Dollar (International Settlement)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 outline-none"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 24/11/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY (e.g. Nov 24, 2026)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Apply Localization Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
