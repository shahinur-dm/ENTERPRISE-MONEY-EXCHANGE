# ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP
## REST API Specification & Contract (v1)

**Base URL:** `/api/v1`  
**Protocol:** HTTPS / WSS  
**Content-Type:** `application/json`  
**Authentication:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`  
**Idempotency Header:** `X-Idempotency-Key: <UUIDv4>` (Required on all financial POST/PATCH/DELETE mutations)

---

### 1. Global Standard Response & Error Envelope

#### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation executed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  },
  "timestamp": "2026-11-24T17:00:00.000Z"
}
```

#### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "INSUFFICIENT_FUNDS",
  "message": "Available balance (MYR 20,000.00) is insufficient for transaction request (MYR 25,000.00)",
  "errors": [],
  "timestamp": "2026-11-24T17:00:00.000Z",
  "path": "/api/v1/remittances"
}
```

---

### 2. Endpoints Inventory

#### A. Authentication & Session Management
- `POST /api/v1/auth/login` - Authenticate with email & password (returns tokens or 2FA challenge)
- `POST /api/v1/auth/2fa/verify` - Complete login via TOTP code
- `POST /api/v1/auth/refresh` - Rotate refresh token & obtain fresh access token
- `POST /api/v1/auth/logout` - Invalidate active session & revoke refresh token
- `GET /api/v1/auth/me` - Retrieve current user profile, organization, active branch, and permissions matrix

#### B. Dashboard & Operational KPI
- `GET /api/v1/dashboard/summary` - Consolidated financial KPIs (Global, Country, Branch, or Agent scope)
- `GET /api/v1/dashboard/currency-positions` - Real-time currency inventory and carrying valuations
- `GET /api/v1/dashboard/profit-trends` - Realized & unrealized profit time-series for charts
- `GET /api/v1/dashboard/compliance-alerts` - High-risk screening and AML alert summaries

#### C. Currency & Exchange Rates
- `GET /api/v1/currencies` - List active currencies with precision definitions
- `POST /api/v1/currencies` - Register new currency (Master Admin)
- `GET /api/v1/exchange-rates/current` - Active real-time exchange rates for all currency pairs
- `POST /api/v1/exchange-rates` - Publish new exchange rate quote
- `POST /api/v1/exchange-rates/approval` - Maker-checker rate approval for limit exceptions
- `GET /api/v1/exchange-rates/history` - Historical rate quotes and spread audit log

#### D. Currency Trading (Buy & Sell)
- `GET /api/v1/trades/purchases` - List currency purchases with filters
- `POST /api/v1/trades/purchases` - Record new currency purchase from supplier
- `POST /api/v1/trades/purchases/:id/approve` - Authorize purchase and post inventory & AP journal
- `GET /api/v1/trades/sales` - List currency sales
- `POST /api/v1/trades/sales` - Record new currency sale to customer
- `POST /api/v1/trades/sales/:id/approve` - Authorize sale, deduct WAC inventory, post FX profit & AR journal
- `POST /api/v1/trades/:id/reverse` - Request reversal of trade with linked corrective journal

#### E. Remittance Workflow
- `POST /api/v1/remittances/quote` - Generate binding exchange quote with TTL (e.g. 15 minutes)
- `GET /api/v1/remittances` - List remittance orders with multi-status filters
- `POST /api/v1/remittances` - Create remittance order
- `POST /api/v1/remittances/:id/collection` - Record funds collection from sender (Cash/Bank)
- `POST /api/v1/remittances/:id/compliance-check` - Trigger Sanctions & AML screening review
- `POST /api/v1/remittances/:id/approve` - Approve transaction following compliance clearance
- `POST /api/v1/remittances/:id/assign` - Assign destination agent
- `POST /api/v1/remittances/:id/payout` - Record verified beneficiary payout (Bank / MFS / Cash)
- `POST /api/v1/remittances/:id/reconcile` - Reconcile payout with provider settlement
- `POST /api/v1/remittances/:id/refund` - Authorize refund to sender with reversal journal

#### F. Fund Management & Financial Accounts
- `GET /api/v1/accounts` - List financial accounts (Bank, Cash, MFS, Settlement)
- `GET /api/v1/accounts/:id/balance` - 7-balance breakdown (Opening, Current, Available, Reserved, Blocked, In-transit, Closing)
- `POST /api/v1/fund-transfers` - Request internal branch/account fund transfer
- `POST /api/v1/fund-transfers/:id/approve` - Maker-checker approval of fund dispatch
- `POST /api/v1/fund-transfers/:id/receive` - Confirm receipt and update destination balance
- `POST /api/v1/fund-adjustments` - Submit fund adjustment request with evidence

#### G. Accounting Engine
- `GET /api/v1/accounting/chart-of-accounts` - Hierarchical COA tree
- `POST /api/v1/accounting/chart-of-accounts` - Create new ledger account head
- `GET /api/v1/accounting/journals` - List posted journal entries with lines
- `POST /api/v1/accounting/journals` - Post manual adjusting journal entry (balanced)
- `POST /api/v1/accounting/journals/:id/reverse` - Reverse existing journal entry
- `GET /api/v1/accounting/general-ledger` - Account-wise general ledger inquiry
- `GET /api/v1/accounting/trial-balance` - Real-time balanced Trial Balance
- `GET /api/v1/accounting/financial-statements` - Balance Sheet, P&L, Cash Flow
- `POST /api/v1/accounting/periods/close` - Lock accounting period against future postings

#### H. Compliance & Parties
- `GET /api/v1/parties` - Customer and Supplier directory
- `POST /api/v1/parties` - Register party with KYC metadata
- `POST /api/v1/parties/:id/documents` - Upload encrypted KYC document
- `GET /api/v1/compliance/screenings` - Sanctions & PEP screening audit log
- `POST /api/v1/compliance/cases/:id/resolve` - Clear or freeze compliance hold

#### I. Audit & System Administration
- `GET /api/v1/audit-logs` - Query immutable audit logs with diff snapshots
- `GET /api/v1/users` - User management
- `POST /api/v1/users` - Create user with role assignment and branch scoping
- `GET /api/v1/roles` - Role-based permissions matrix
