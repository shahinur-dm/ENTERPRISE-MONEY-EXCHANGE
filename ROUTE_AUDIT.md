# ROUTE AUDIT REPORT — DAWAT ENTERPRISE FINANCIAL ERP
**Date:** 2026-11-24  
**Audit Scope:** Next.js App Router Filesystem vs Navigation Registry vs User Specification  

---

## 1. COMPLETE ROUTE DIRECTORY & VERIFICATION STATUS

| # | Route Path | Navigation Group | Physical Page File | Status | Notes |
| :---: | :--- | :--- | :--- | :---: | :--- |
| 1 | `/` | OVERVIEW | `apps/web/src/app/page.tsx` | **PASS** | Financely-style institutional executive dashboard |
| 2 | `/dashboard` | OVERVIEW | `apps/web/src/app/dashboard/page.tsx` | **PASS** | Canonical alias pointing to root dashboard |
| 3 | `/login` | AUTH | `apps/web/src/app/login/page.tsx` | **PASS** | Institutional login with TOTP & Demo Profile switcher |
| 4 | `/exchange/buy` | FOREIGN EXCHANGE | `apps/web/src/app/exchange/buy/page.tsx` | **PASS** | Counter currency purchase with WAC recalculation |
| 5 | `/exchange/sell` | FOREIGN EXCHANGE | `apps/web/src/app/exchange/sell/page.tsx` | **PASS** | Counter currency sale with realized margin recognition |
| 6 | `/exchange/rates` | FOREIGN EXCHANGE | `apps/web/src/app/exchange/rates/page.tsx` | **PASS** | Board rates, spreads, and sparkline trends |
| 7 | `/exchange/purchases` | FOREIGN EXCHANGE | `apps/web/src/app/exchange/purchases/page.tsx` | **PASS** | FX purchase register with invoice tracking |
| 8 | `/exchange/sales` | FOREIGN EXCHANGE | `apps/web/src/app/exchange/sales/page.tsx` | **PASS** | FX sales register with customer details |
| 9 | `/remittance` | CROSS-BORDER | `apps/web/src/app/remittance/page.tsx` | **PASS** | 16-state transfer lifecycle list and creation modal |
| 10 | `/remittances` | CROSS-BORDER | `apps/web/src/app/remittances/page.tsx` | **PASS** | Canonical alias for remittance operations |
| 11 | `/remittances/new` | CROSS-BORDER | `apps/web/src/app/remittances/new/page.tsx` | **PASS** | Dedicated multi-step remittance creation wizard |
| 12 | `/remittances/[id]` | CROSS-BORDER | `apps/web/src/app/remittances/[id]/page.tsx` | **PASS** | Remittance transaction audit detail & receipt view |
| 13 | `/beneficiaries` | CROSS-BORDER | `apps/web/src/app/beneficiaries/page.tsx` | **PASS** | Beneficiary directory and bank verification |
| 14 | `/customers` | CROSS-BORDER | `apps/web/src/app/customers/page.tsx` | **PASS** | Customer directory with KYC tier badges |
| 15 | `/customers/[id]` | CROSS-BORDER | `apps/web/src/app/customers/[id]/page.tsx` | **PASS** | Customer 360 profile, KYC history, ledger statement |
| 16 | `/agents` | CROSS-BORDER | `apps/web/src/app/agents/page.tsx` | **PASS** | Remittance payout agent network management |
| 17 | `/funds` | TREASURY | `apps/web/src/app/funds/page.tsx` | **PASS** | Multi-currency treasury positions & vault balances |
| 18 | `/funds/banks` | TREASURY | `apps/web/src/app/funds/banks/page.tsx` | **PASS** | Operating bank accounts & nostro reconciliations |
| 19 | `/funds/cash` | TREASURY | `apps/web/src/app/funds/cash/page.tsx` | **PASS** | Physical counter cash drawers & teller floats |
| 20 | `/transfers` | TREASURY | `apps/web/src/app/transfers/page.tsx` | **PASS** | Vault-to-vault and bank-to-cash internal transfers |
| 21 | `/treasury/funds` | TREASURY | `apps/web/src/app/treasury/funds/page.tsx` | **PASS** | Canonical alias for fund management |
| 22 | `/treasury/banks` | TREASURY | `apps/web/src/app/treasury/banks/page.tsx` | **PASS** | Canonical alias for bank accounts |
| 23 | `/treasury/cash` | TREASURY | `apps/web/src/app/treasury/cash/page.tsx` | **PASS** | Canonical alias for cash management |
| 24 | `/treasury/transfers` | TREASURY | `apps/web/src/app/treasury/transfers/page.tsx` | **PASS** | Canonical alias for internal transfers |
| 25 | `/accounting/coa` | ACCOUNTING | `apps/web/src/app/accounting/coa/page.tsx` | **PASS** | Standard Chart of Accounts |
| 26 | `/accounting/chart-of-accounts` | ACCOUNTING | `apps/web/src/app/accounting/chart-of-accounts/page.tsx` | **PASS** | Canonical alias for Chart of Accounts |
| 27 | `/accounting/journals` | ACCOUNTING | `apps/web/src/app/accounting/journals/page.tsx` | **PASS** | Double-entry journal voucher creation & posting |
| 28 | `/accounting/ledger` | ACCOUNTING | `apps/web/src/app/accounting/ledger/page.tsx` | **PASS** | General Ledger statement by account |
| 29 | `/accounting/general-ledger` | ACCOUNTING | `apps/web/src/app/accounting/general-ledger/page.tsx` | **PASS** | Canonical alias for General Ledger |
| 30 | `/accounting/trial-balance` | ACCOUNTING | `apps/web/src/app/accounting/trial-balance/page.tsx` | **PASS** | Balanced dynamic Trial Balance ($\Sigma D \equiv \Sigma C$) |
| 31 | `/accounting/profit-loss` | ACCOUNTING | `apps/web/src/app/accounting/profit-loss/page.tsx` | **PASS** | Income statement & realized FX spread reporting |
| 32 | `/accounting/balance-sheet` | ACCOUNTING | `apps/web/src/app/accounting/balance-sheet/page.tsx` | **PASS** | Statement of Financial Position |
| 33 | `/compliance` | RISK & GOV | `apps/web/src/app/compliance/page.tsx` | **PASS** | AML dashboard, transaction alerts, sanction screening |
| 34 | `/compliance/kyc` | RISK & GOV | `apps/web/src/app/compliance/kyc/page.tsx` | **PASS** | Customer identity verification & tier upgrade queue |
| 35 | `/compliance/aml` | RISK & GOV | `apps/web/src/app/compliance/aml/page.tsx` | **PASS** | Sanctions match evaluation & PEP watchlist cases |
| 36 | `/approvals` | RISK & GOV | `apps/web/src/app/approvals/page.tsx` | **PASS** | Maker-Checker dual authorization queue |
| 37 | `/audit-logs` | RISK & GOV | `apps/web/src/app/audit-logs/page.tsx` | **PASS** | Immutable security and transaction event trail |
| 38 | `/suppliers` | BUSINESS | `apps/web/src/app/suppliers/page.tsx` | **PASS** | Wholesale FX supplier accounts & settlement history |
| 39 | `/employees` | BUSINESS | `apps/web/src/app/employees/page.tsx` | **PASS** | Staff roster, roles, and branch assignments |
| 40 | `/payroll` | BUSINESS | `apps/web/src/app/payroll/page.tsx` | **PASS** | Monthly salary disbursement and tax withholding |
| 41 | `/expenses` | BUSINESS | `apps/web/src/app/expenses/page.tsx` | **PASS** | Operating expense tracking and voucher approval |
| 42 | `/reports` | BUSINESS | `apps/web/src/app/reports/page.tsx` | **PASS** | Regulatory and financial report generation suite |
| 43 | `/admin` | SYSTEM ADMIN | `apps/web/src/app/admin/page.tsx` | **PASS** | System Administration suite hub |
| 44 | `/admin/users` | SYSTEM ADMIN | `apps/web/src/app/admin/users/page.tsx` | **PASS** | Operator user accounts & 2FA enforcement |
| 45 | `/admin/roles` | SYSTEM ADMIN | `apps/web/src/app/admin/roles/page.tsx` | **PASS** | Granular RBAC permissions matrix |
| 46 | `/admin/branches` | SYSTEM ADMIN | `apps/web/src/app/admin/branches/page.tsx` | **PASS** | Multi-country operational branches & vaults |
| 47 | `/admin/organization` | SYSTEM ADMIN | `apps/web/src/app/admin/organization/page.tsx` | **PASS** | Legal entities & regulatory licenses |
| 48 | `/admin/settings` | SYSTEM ADMIN | `apps/web/src/app/admin/settings/page.tsx` | **PASS** | System timeouts, Maker-Checker limits, and policies |
| 49 | `/settings` | SYSTEM ADMIN | `apps/web/src/app/settings/page.tsx` | **PASS** | Canonical alias for administration suite |
| 50 | `/settings/languages` | SYSTEM ADMIN | `apps/web/src/app/settings/languages/page.tsx` | **PASS** | Language & localization configuration (English / বাংলা) |
| 51 | `/settings/profile` | SYSTEM ADMIN | `apps/web/src/app/settings/profile/page.tsx` | **PASS** | Authenticated operator profile & security credentials |

---

## 2. ERROR BOUNDARIES & HTTP FALLBACKS
- **`apps/web/src/app/not-found.tsx`**: Custom institutional 404 page with navigation fallback.
- **`apps/web/src/app/error.tsx`**: Global client-side error boundary with recovery action.
- **`apps/web/src/app/loading.tsx`**: Global skeleton loading placeholder.
