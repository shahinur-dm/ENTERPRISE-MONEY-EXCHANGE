# API AUDIT REPORT — DAWAT ENTERPRISE FINANCIAL ERP
**Date:** 2026-11-24  
**Base URL:** `http://localhost:4000/api/v1`  
**Swagger OpenAPI Specification:** `http://localhost:4000/api/docs`  

---

## 1. ENDPOINT INVENTORY & COMPLIANCE

### 1.1 Authentication & Security (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required | Request Body | Response Shape |
| :---: | :--- | :--- | :---: | :--- | :--- |
| `POST` | `/auth/login` | Initial credential verification | No | `{ email, password }` | `{ accessToken, refreshToken, user, requires2fa }` |
| `POST` | `/auth/refresh` | Refresh token rotation | No | `{ refreshToken }` | `{ accessToken, refreshToken, expiresIn }` |
| `POST` | `/auth/2fa/verify` | Verify RFC 6238 TOTP token | No | `{ userId, token }` | `{ accessToken, refreshToken, user }` |
| `GET` | `/auth/me` | Fetch authenticated session profile | Yes (Bearer) | None | User profile, branch scope, permissions |
| `POST` | `/auth/logout` | Revoke active refresh token | Yes (Bearer) | None | `{ success: true }` |

### 1.2 Foreign Exchange & Currency Management (`/api/v1/currency`)
| Method | Endpoint | Description | Auth Required | Parameters / Body |
| :---: | :--- | :--- | :---: | :--- |
| `GET` | `/currency` | List all supported currencies (8 core) | Yes | Filter by `isActive` |
| `GET` | `/currency/rates` | Real-time exchange rate board | Yes | `baseCurrency` query |
| `POST` | `/currency/purchase` | Execute currency purchase (WAC update) | Yes | `{ currency, amount, rate, supplierId, branchId }` |
| `POST` | `/currency/sale` | Execute currency sale (Profit recognition) | Yes | `{ currency, amount, rate, customerId, branchId }` |
| `GET` | `/currency/pools` | Real-time inventory cost pools | Yes | `branchId` query |

### 1.3 Remittance & Cross-Border Settlement (`/api/v1/remittance`)
| Method | Endpoint | Description | Auth Required | Parameters / Body |
| :---: | :--- | :--- | :---: | :--- |
| `POST` | `/remittance/quote` | Lock guaranteed rate quote (15 min TTL) | Yes | `{ sourceCurrency, targetCurrency, amount, isTarget }` |
| `POST` | `/remittance/collect` | Collect funds & post double-entry voucher | Yes | `{ quoteId, senderId, beneficiaryId, paymentMethod }` |
| `GET` | `/remittance` | List remittance transactions | Yes | `status`, `page`, `limit` |
| `GET` | `/remittance/:id` | Get remittance details & audit timeline | Yes | Remittance UUID |
| `POST` | `/remittance/:id/payout` | Authorize external partner bank payout | Yes | Dual-authorization check |

### 1.4 Financial Accounting & General Ledger (`/api/v1/accounting`)
| Method | Endpoint | Description | Auth Required | Parameters / Body |
| :---: | :--- | :--- | :---: | :--- |
| `GET` | `/accounting/coa` | Retrieve Chart of Accounts | Yes | Filter by `type`, `status` |
| `POST` | `/accounting/journals` | Create balanced journal voucher | Yes | `{ lines: [{ accountId, debit, credit }], narrative }` |
| `GET` | `/accounting/trial-balance` | Dynamic Trial Balance report | Yes | `asOfDate`, `branchId` |
| `GET` | `/accounting/general-ledger` | General Ledger extract by account | Yes | `accountId`, `startDate`, `endDate` |

### 1.5 Organization & Branch Management (`/api/v1/organization`)
| Method | Endpoint | Description | Auth Required | Parameters / Body |
| :---: | :--- | :--- | :---: | :--- |
| `GET` | `/organization/entities` | List legal corporate entities | Yes | Malaysia & Bangladesh entities |
| `GET` | `/organization/branches` | List operational branch locations | Yes | KUL-01, DHK-01, CTG-01, JHR-01 |

---

## 2. API INTEGRATION RECOMMENDATIONS
1. **Unified Next.js Proxying:** All browser-originated requests route through `/api/v1/*` same-origin rewrites to eliminate CORS preflight overhead and IPv6 localhost resolution mismatch.
2. **Idempotency Keys:** Enforce `X-Idempotency-Key` headers on all financial mutation endpoints (`/currency/purchase`, `/currency/sale`, `/remittance/collect`, `/accounting/journals`).
