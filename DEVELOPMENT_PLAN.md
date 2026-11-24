# ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP
## Comprehensive Development Plan & System Architecture

**Document Version:** 1.0.0  
**Date:** November 2026  
**Status:** Approved Architectural Blueprint  
**Standard:** Enterprise Financial Grade (ISO 20022 / Double-Entry Standard / OWASP ASVS Level 3)

---

### 1. Executive Summary & Architecture Philosophy

The **Enterprise Money Exchange & International Remittance ERP** is an institutional-grade, multi-tenant financial management and cross-border settlement system designed for regulated money exchange and licensed remittance operations. 

#### Core Guiding Principles:
1. **Mathematical Invariance & Financial Precision**: Never use JavaScript floating-point numbers (`IEEE 754`) for monetary values or exchange rates. All calculations strictly utilize `decimal.js` with minimum 24-digit precision and 8 to 12 decimal places, persisted as `Decimal128` in MongoDB.
2. **Double-Entry Balance Guarantee**: Every financial movement (cash in, cash out, exchange, transfer, remittance collection, payout, fee accrual) must produce balanced journal lines ($\sum \text{Debit} \equiv \sum \text{Credit}$) in the entity's functional currency.
3. **Immutability of Financial Records**: Posted journals, exchange rate transactions, and completed audits cannot be modified or hard-deleted. Corrective actions require auditable linked reversal entries.
4. **Maker-Checker Governance**: Critical operations (limit exceptions, custom rate overrides, high-value transfers, period closing, fund adjustments) require two-party authorization. The creator cannot approve their own sensitive transaction under any circumstances (including Master Admin).
5. **Multi-Tenant & Multi-Entity Isolation**: Data partitioning across Organization $\rightarrow$ Legal Entity $\rightarrow$ Country $\rightarrow$ Branch $\rightarrow$ Account with server-enforced scoping.
6. **Regulatory Compliance by Design**: Real-time Sanctions/PEP screening, transaction threshold monitoring, source-of-funds verification, KYC document lifecycle management, and automated regulatory reporting (e.g., Bangladesh Bank & Bank Negara Malaysia guidelines).

---

### 2. High-Level System Architecture

The system is constructed as a high-performance **Modular Monolith** with clear bounded contexts, structured for eventual microservices extraction only if high-throughput requirements dictate.

```
                           +---------------------------------------------------+
                           |            Next.js 15+ (App Router)               |
                           |  TypeScript, Tailwind CSS, shadcn/ui, Recharts   |
                           |    TanStack Table, React Hook Form, Zod           |
                           +-------------------------+-------------------------+
                                                     | HTTPS / WSS / REST
                                                     v
                           +---------------------------------------------------+
                           |             NestJS Enterprise API Gateway         |
                           |         OpenAPI / Swagger / Rate Limiter          |
                           |   JWT Auth Guard / RBAC / Branch Scoping Guard    |
                           +-------------------------+-------------------------+
                                                     |
        +-----------------------+--------------------+-----------------------+
        |                       |                    |                       |
        v                       v                    v                       v
+---------------+       +---------------+    +---------------+       +---------------+
| Trading & FX  |       |  Remittance   |    |  Accounting   |       |  Compliance   |
| Engine        |       |  Workflow     |    |  Engine       |       |  & Screening  |
| - Buy / Sell  |       | - State Mach. |    | - COA Tree    |       | - Sanctions   |
| - WAC Pools   |       | - Assignment  |    | - Journals    |       | - KYC Expiry  |
| - Rate Quoting|       | - Payout Sync |    | - Trial Bal.  |       | - AML Audits  |
+-------+-------+       +-------+-------+    +-------+-------+       +-------+-------+
        |                       |                    |                       |
        +-----------------------+--------------------+-----------------------+
                                                     |
                                                     v
                                    +---------------------------------+
                                    |    Domain Event Outbox Engine   |
                                    +----------------+----------------+
                                                     |
                         +---------------------------+---------------------------+
                         v                                                       v
        +---------------------------------+                     +---------------------------------+
        |      MongoDB 7.0+ Replica Set   |                     |     Redis & BullMQ Engine       |
        |  - ACID Multi-Doc Transactions  |                     |  - High-Speed Rate Cache        |
        |  - Decimal128 Native Fields     |                     |  - Asynchronous Webhook Outbox  |
        |  - Compound Indexed Tenancy     |                     |  - Real-Time Socket.IO Cluster  |
        +---------------------------------+                     +---------------------------------+
```

---

### 3. Monorepo Organization Structure

```
/money-exchange-erp
├── apps/
│   ├── web/                     # Enterprise Next.js App Router Frontend
│   │   ├── src/
│   │   │   ├── app/             # App Router pages & route handlers
│   │   │   ├── components/      # Design system, shadcn/ui, DataTables, charts
│   │   │   ├── hooks/           # Custom React hooks (auth, rates, permissions)
│   │   │   ├── lib/             # API client, Decimal utils, formatters
│   │   │   ├── stores/          # Zustand state stores (session, active context)
│   │   │   └── types/           # Web-specific UI types
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                     # NestJS Core Enterprise Backend
│       ├── src/
│       │   ├── common/          # Filters, interceptors, guards, decorators
│       │   ├── config/          # Environment validation & configuration
│       │   ├── database/        # Mongoose connection & transaction manager
│       │   ├── modules/         # Bounded Domain Modules:
│       │   │   ├── auth/        # JWT, Refresh Tokens, TOTP 2FA, Sessions
│       │   │   ├── organization/# Organizations, Legal Entities, Countries, Branches
│       │   │   ├── rbac/        # Roles, Permissions, User Access scopes
│       │   │   ├── currency/    # Currencies, Pairs, Rates, Cost Pools (WAC)
│       │   │   ├── trading/     # Currency Purchase & Sales (with accounting hooks)
│       │   │   ├── remittance/  # Quotes, Orders, Assignments, Payouts, Settlement
│       │   │   ├── fund/        # Multi-currency Account Balances, Reservations
│       │   │   ├── accounting/  # COA, Journals, General Ledger, Period Closing
│       │   │   ├── compliance/  # KYC, AML alerts, Sanctions screening
│       │   │   ├── party/       # Customers, Suppliers, Beneficiaries
│       │   │   ├── hr-payroll/  # Staff, Attendance, Commissions, Payroll
│       │   │   ├── reports/     # Financial statements, operational analytics
│       │   │   └── audit/       # Immutable audit logs & system events
│       │   ├── main.ts
│       │   └── app.module.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/                  # Common utilities, Decimal math, constants
│   ├── config/                  # ESLint, Prettier, Tailwind & TS configurations
│   └── types/                   # Shared TypeScript models, Enums, DTO interfaces
├── infrastructure/
│   ├── docker/                  # Dockerfiles & docker-compose configurations
│   ├── mongo-init/              # Replica set initialization scripts
│   └── k8s/                     # Deployment blueprints
└── docs/                        # Architectural documentation, schemas & guides
```

---

### 4. 10-Phase Implementation Roadmap

| Phase | Title | Core Deliverables | Verification Milestone |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Project Foundation, Architecture, UI/UX, Authentication & RBAC** | Monorepo scaffolding, NestJS bootstrap, Next.js UI theme, JWT + Refresh Token Rotation, TOTP 2FA, Granular Permissions (Module/Action/Scope), Maker-Checker framework. | Passing Auth/RBAC automated tests, login flow with TOTP, UI dashboard layout rendering. |
| **Phase 2** | **MongoDB Database Design, Accounting Engine & Ledgers** | Mongoose schemas with Decimal128, Chart of Accounts tree, Double-Entry posting engine, Atomic journal posting, Trial Balance generation, Period closing. | Automated accounting verification: $\sum \text{Debit} = \sum \text{Credit}$, immutability tests, period lock tests. |
| **Phase 3** | **Currency Management, FX Rates, Purchase & Sales** | Currency registry, Currency Pairs, Real-time Rate limits & Approvals, Weighted Average Cost (WAC) pool, Currency Purchase, Currency Sales, Cost basis & Realized FX gain. | Multi-currency buy/sell execution tests, automated WAC cost calculations, realized gain ledger postings. |
| **Phase 4** | **Fund Management, Banking, Cash & Internal Transfers** | 7-state fund management (Opening, Current, Available, Reserved, Blocked, In-transit, Closing), Cash registers, Bank reconciliations, Branch-to-branch transfers. | Concurrency tests preventing double-spending, atomic reservation and release tests. |
| **Phase 5** | **Remittance Engine, Beneficiaries, Payout & Settlement** | Quote generation with TTL, 16-state server-enforced state machine, Agent assignment, Provider webhook sync, Split payout limits, Refund workflows. | End-to-end remittance lifecycle test: quote $\rightarrow$ collect $\rightarrow$ approve $\rightarrow$ assign $\rightarrow$ payout $\rightarrow$ reconcile. |
| **Phase 6** | **KYC, AML, Sanctions Screening, Approvals & Audit** | Party KYC document storage, Sanctions/PEP fuzzy screening, Transaction limit checks, Maker-checker queue, Tamper-evident audit log trail. | Compliance hold simulation, blocked payout upon sanctions match, maker-checker authorization tests. |
| **Phase 7** | **HR, Payroll Processing, Agent Commissions & Expenses** | Employee records, Branch assignments, Commission tier engine, Expense classification, Automated salary and commission journal postings. | Commission calculation verification, automated payroll run with double-entry salary payable entries. |
| **Phase 8** | **Reports, Operational Analytics, Notifications & Settings** | Real-time Global/Country/Branch KPI dashboards, Financial statements (P&L, Balance Sheet, Cash Flow), Multi-format export (PDF/Excel/CSV). | Financial report reconciliation against raw journal lines, multi-currency conversion accuracy check. |
| **Phase 9** | **Automated Testing, Security Hardening & Performance** | Vitest/Jest unit & integration suites, Playwright E2E flows, concurrency stress testing, rate-limiting & OWASP vulnerability scans. | 100% critical-path test pass rate, zero float-point leakage, zero concurrency anomalies. |
| **Phase 10** | **UAT, Backup/Restore Verification & Production Readiness** | Backup restoration testing, disaster recovery blueprints, production Docker images, documentation sign-off. | Disaster recovery drill pass, final architectural review sign-off. |

---

### 5. Architectural Quality Standards & Verification Gates

1. **Precision Rule**: Strict prohibition of `number` for monetary calculations. Every financial operation uses `Decimal` from `decimal.js` or `mongoose.Schema.Types.Decimal128`.
2. **Atomic Transactions**: All mutations affecting multi-document balances (e.g. remittance payout + account reservation + journal entry) run inside MongoDB sessions (`withTransaction`).
3. **Idempotency**: All mutation endpoints accept an `X-Idempotency-Key` header, caching request hashes and responses in MongoDB/Redis to prevent duplicate charges or transfers.
4. **Zero Trust Scoping**: User authorization resolves to specific `{ organizationId, legalEntityId, branchId, accountIds }`. Any cross-tenant or unassigned branch access returns `403 Forbidden`.
