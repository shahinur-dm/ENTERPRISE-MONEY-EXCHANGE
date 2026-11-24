# BILINGUAL LOCALIZATION GUIDE (ENGLISH & বাংলা)
**DAWAT ENTERPRISE FINANCIAL ERP**  
**Supported Locales:** English (`en`, Default) | বাংলা (`bn`, Bengali)  
**Architecture:** Zero-dependency React Context (`I18nProvider`) + JSON translation dictionaries  

---

## 1. ARCHITECTURE OVERVIEW

The bilingual localization engine is designed to meet institutional banking and cross-border remittance needs in the Malaysia ⇄ Bangladesh corridor. It enables instantaneous language switching between English and authentic financial Bengali (বাংলা) without page reloads.

```
/apps/web/src/
  ├── messages/
  │     ├── en.json      # English master dictionary
  │     └── bn.json      # Authentic institutional Bengali dictionary
  └── lib/
        └── i18n.tsx     # Context, useI18n hook & Bengali numeral formatter
```

---

## 2. CORE CAPABILITIES

1. **Instant Toggle:** The top navigation bar (`AppHeader`) hosts an `EN | বাংলা` pill toggle allowing one-click language switching.
2. **Persistent Preferences:** The selected locale is saved to browser `localStorage` (`erp_lang`), surviving page refreshes, tab closures, and operator re-logins.
3. **Bengali Numeral Formatting:** Numbers, amounts, and dates seamlessly format into standard international notation or Bengali numerals (`০, ১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯`).
4. **Institutional Typography:** `apps/web/src/app/globals.css` imports and supports `Noto Sans Bengali` and `Hind Siliguri` fonts for typographic rendering across all display densities.
5. **Data Protection Invariant:** Database identifiers, API keys, internal status codes (`PAID_OUT`, `PENDING_APPROVAL`), and accounting codes (`1010`, `1020`) remain untranslated to preserve backend data integrity.

---

## 3. TRANSLATION TAXONOMY EXAMPLES

| English Term | Bengali Institutional Term (বাংলা) | Context |
| :--- | :--- | :--- |
| **Dashboard** | ড্যাশবোর্ড | Overview & Executive KPIs |
| **Foreign Exchange** | বৈদেশিক মুদ্রা বিনিময় | Spot & Wholesale Trading |
| **Buy Currency** | মুদ্রা ক্রয় | Inventory Inflow |
| **Sell Currency** | মুদ্রা বিক্রয় | Counter P&L Execution |
| **Cross-Border Operations** | আন্তর্জাতিক রেমিট্যান্স | Corridors & Payouts |
| **Beneficiaries** | বেনিফিশিয়ারি / প্রাপক | Destination Payees |
| **Chart of Accounts** | চার্ট অব অ্যাকাউন্টস | General Ledger Hierarchy |
| **General Ledger** | সাধারণ খতিয়ান | Immutable Posting Register |
| **Trial Balance** | রেওয়ামিল | Balancing Statement ($\Sigma D \equiv \Sigma C$) |
| **Profit & Loss** | লাভ ও ক্ষতি হিসাব | Income & Realized Spreads |
| **Balance Sheet** | উদ্বৃত্তপত্র | Financial Position |
| **Compliance & AML** | কমপ্লায়েন্স ও এএমএল | Sanctions & Screening |
| **Maker-Checker** | মেকার-চেকার অনুমোদন | Segregation of Duties |

---

## 4. EXTENDING WITH NEW LANGUAGES

To add an additional corridor language (e.g. Arabic for Middle East corridors or Malay for domestic operations):
1. Create `/apps/web/src/messages/<locale>.json`.
2. Add the dictionary import to `/apps/web/src/lib/i18n.tsx`.
3. Add the locale code to `Locale` type definition.
