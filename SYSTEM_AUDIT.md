# SYSTEM AUDIT REPORT — DAWAT ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP
**Audit Date:** 2026-11-24  
**Auditor:** Principal Software Architect & QA Automation Specialist  
**System Version:** DAWAT ERP v1.0.0-PROD  

---

## 1. EXECUTIVE SUMMARY

An institutional architectural and codebase audit was conducted across the entire repository (`apps/web`, `apps/api`, `packages/shared`, `packages/types`). The system is architected as an institutional-grade, multi-entity, multi-country, multi-branch, and multi-currency Financial ERP specifically engineered for the Malaysia (MYR) ⇄ Bangladesh (BDT) cross-border remittance and wholesale/retail currency exchange corridor.

While core architectural modules (double-entry general ledger, 12-decimal-place Weighted Average Cost inventory, 16-state remittance state machine, JWT/TOTP security) are soundly engineered in the backend, several critical functional, connectivity, routing, and localization defects were identified in the user interface and client-server integration layer.

---

## 2. COMPONENT-BY-COMPONENT AUDIT

### 2.1 Frontend Architecture (`apps/web`)
- **Framework:** Next.js 14.2.35 (App Router).
- **Styling:** Tailwind CSS 3.4.15, PostCSS, Lucide React icons.
- **State & Layout Shell:** Unified `Shell.tsx` hosting `AppSidebar` (desktop fixed navy), `MobileSidebar` (slide-in drawer with touch targets $\ge 44\text{px}$), and `AppHeader`.
- **Defects Identified:**
  1. **Direct Cross-Origin Browser Fetch:** `ApiClient` defaulted to `http://localhost:4000/api/v1`. On Windows browsers, `localhost` resolution differences (IPv6 `::1` vs IPv4 `127.0.0.1`), lack of reverse proxy rewrites in `next.config.js`, and strict CORS preflight caused the browser to throw `TypeError: Failed to fetch` on login.
  2. **Route Discrepancies:** The sidebar references `/remittance`, `/funds`, `/admin/*`, whereas user specifications and standard ERP conventions also expect `/remittances`, `/remittances/[id]`, `/treasury/*`, `/settings/*`, `/accounting/general-ledger`, etc.
  3. **Hardcoded English UI:** UI components currently lack dynamic internationalization dictionary lookups for Bengali (বাংলা) and English.
  4. **Form Prefill:** Login form previously hardcoded production credentials directly into component state.

### 2.2 Backend Architecture (`apps/api`)
- **Framework:** NestJS 10.4.8, TypeScript 5.6.3.
- **Database Layer:** MongoDB with Mongoose 8.8.2. Schema models utilize `mongoose.Schema.Types.Decimal128` for zero-float precision.
- **Security & Middleware:**
  - `helmet` security headers.
  - JWT Access Token (15m expiry) + Refresh Token rotation (7d expiry, SHA-256 hashed).
  - RFC 6238 TOTP two-factor authentication with Base32 secrets.
  - Global `BranchScopeGuard` enforcing multi-tenant isolation.
- **Defects Identified:**
  1. API server bound to default host without explicit `0.0.0.0` dual-stack binding.
  2. CORS allowed origins omitted wildcard/local development port variations.
  3. Lack of integrated high-volume demo seeder generating interconnected financial records across all entities.

### 2.3 Shared Packages (`packages/shared`, `packages/types`)
- **Math Engine:** `DecimalMath` wrapping `decimal.js` configured to 28 decimal places.
- **Invariant Rules:** BR-001 (Double-entry $\sum\text{Debit} \equiv \sum\text{Credit}$), BR-002 (Immutable posted journals; reversal only), BR-003 (Real-time WAC), BR-005 (15-min quote lock TTL).
- **Status:** Healthy and verified with unit tests.

---

## 3. IDENTIFIED VULNERABILITY & SYSTEM RISK REGISTER

| Risk ID | Severity | Category | Description | Mitigation Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | High | Auth | Direct cross-origin login fails on browser preflight | Resolved via Next.js same-origin rewrite proxy |
| **SEC-02** | High | Security | Production login prefilled with master credentials | Removed; dedicated Demo Mode implemented |
| **ROU-01** | Medium | Routing | Missing plural and canonical route aliases (`/remittances`, `/treasury/*`) | Adding full route alias layer & dynamic pages |
| **DAT-01** | Medium | Data | Incomplete mock demo datasets across modules | Comprehensive idempotent seeder script authored |
| **I18N-01**| Medium | UX | Bengali (বাংলা) language support missing in UI | Implementing `I18nProvider` with `en.json` & `bn.json` |

---

## 4. AUDIT CONCLUSION & GO-FORWARD PLAN
The underlying enterprise foundations are robust. The path to 100% production-readiness requires immediate resolution of the frontend API proxying, complete route coverage with canonical aliases, dynamic entity detail views, comprehensive realistic demo data seeding, and a native English/Bengali localization engine.
