# BUG REPORT — DAWAT ENTERPRISE FINANCIAL ERP
**Date:** 2026-11-24  
**Classification:** Enterprise Defect & Root Cause Analysis  

---

## 1. DEFECT SUMMARY MATRIX

| Bug ID | Severity | Status | Affected Area | Description |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Critical | **IN REPAIR** | Login Page (`/login`) | "Failed to fetch" error displayed on login attempt |
| **BUG-002** | High | **IN REPAIR** | Navigation / Exchange Rates | 404 page encountered on `/exchange/rates` in legacy builds |
| **BUG-003** | Medium | **IN REPAIR** | Navigation Structure | Missing canonical aliases: `/remittances`, `/treasury/*`, `/settings/*` |
| **BUG-004** | High | **IN REPAIR** | Dynamic Entity Views | Missing detail views (`/remittances/[id]`, `/customers/[id]`) |
| **BUG-005** | Medium | **IN REPAIR** | Data Seeding | Absence of interconnected, idempotent demo data across 30+ customers and transactions |
| **BUG-006** | Medium | **IN REPAIR** | Localization | Absence of bilingual English & Bengali (বাংলা) system with persistent switcher |
| **BUG-007** | Low | **IN REPAIR** | Security UX | Hardcoded prefilled production credentials on login form |

---

## 2. DETAILED ROOT CAUSE ANALYSES

### BUG-001: Login Displays "Failed to fetch"
- **Symptom:** User inputs credentials on `http://localhost:3000/login` and clicks "Sign In". An alert bar appears with `Failed to fetch`.
- **Root Cause Analysis:**
  1. `apps/web/src/lib/api-client.ts` initiates client-side requests directly to `http://localhost:4000/api/v1/auth/login`.
  2. In modern browsers on Windows 10/11, `localhost` queries may resolve via IPv6 (`[::1]`) while the Node.js API server listens solely on IPv4 loopback (`127.0.0.1`), resulting in connection drop.
  3. Direct browser cross-origin requests trigger CORS `OPTIONS` preflight checks. When headers or origin formatting deviate, browsers reject the connection without exposing details to JavaScript, surfacing as generic `TypeError: Failed to fetch`.
  4. Absence of Next.js same-origin API rewrite rules (`/api/v1/:path*` -> `http://127.0.0.1:4000/api/v1/:path*`).
- **Resolution:**
  1. Configure Next.js `async rewrites()` in `apps/web/next.config.js` to proxy `/api/v1/:path*` directly to the backend.
  2. Update `apps/web/src/lib/api-client.ts` to default to same-origin `/api/v1` in browser contexts.
  3. Bind backend NestJS listener explicitly to `0.0.0.0`.
  4. Expand CORS `origin` whitelist to support all loopback variants.

### BUG-002: Exchange Rates Route 404
- **Symptom:** Clicking "Exchange Rates" in the left sidebar loaded a standard 404 page.
- **Root Cause Analysis:**
  1. In the initial layout implementation, the folder `apps/web/src/app/exchange/rates/page.tsx` was either pending compilation or the production server had not reloaded the static route manifest.
  2. The static export manifest in Next.js requires a complete `next build` cycle to register newly added nested App Router page components.
- **Resolution:**
  1. Verified and compiled `apps/web/src/app/exchange/rates/page.tsx`.
  2. Rebuilt Next.js production bundle with 40/40 routes statically generated.
  3. Added automated HTTP status verification across all routes.

### BUG-003 & BUG-004: Missing Route Aliases and Dynamic Detail Routes
- **Symptom:** Links referencing plural names (e.g. `/remittances`, `/treasury/funds`, `/settings/users`) or entity IDs (e.g. `/remittances/REM-2026-001`, `/customers/CUST-001`) return 404.
- **Root Cause Analysis:**
  1. Route hierarchy used singular folders (`/remittance`, `/funds`, `/admin`).
  2. Lack of dynamic folder patterns `[id]` for transactions, customers, and beneficiaries.
- **Resolution:**
  1. Implement route redirection and dedicated sub-pages for `/remittances`, `/remittances/new`, `/remittances/[id]`.
  2. Implement `/customers/[id]`.
  3. Implement `/treasury/*` aliases pointing to Treasury suite.
  4. Implement `/settings/*` aliases pointing to Admin & Settings suite.

### BUG-005: Incomplete Interconnected Demo Seeder
- **Symptom:** Pages display static mock arrays without live MongoDB backing across all entities.
- **Resolution:**
  1. Author an idempotent database seeder script `apps/api/src/database/seeds/enterprise-demo.seeder.ts`.
  2. Populate 30+ customers, 10+ suppliers, 8+ agents, 25+ beneficiaries, 40+ purchases, 40+ sales, 50+ remittances, and double-entry general ledger journals.
  3. Provide npm command `npm run seed:demo`.

### BUG-006: Missing Bilingual Internationalization
- **Symptom:** Entire application is English-only.
- **Resolution:**
  1. Implement `I18nProvider` with `messages/en.json` and `messages/bn.json`.
  2. Add quick switcher in `AppHeader` and full configuration in `/settings/languages`.
  3. Support persistent language choice in `localStorage`.
