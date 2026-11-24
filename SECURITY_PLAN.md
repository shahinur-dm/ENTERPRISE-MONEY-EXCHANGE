# ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP
## Security & Data Protection Specification

**Standard Compliance:** OWASP ASVS 4.0 Level 3 / ISO 27001 / SOC 2 Type II Reference  
**Classification:** Financial Confidential  
**Version:** 1.0.0

---

### 1. Identity, Authentication & Session Security

1. **Password Storage**: Passwords hashed using `Argon2id` (m=65536, t=3, p=4) or high-factor `bcrypt` (rounds=12). Plain-text passwords are never logged or stored in memory longer than the request cycle.
2. **JWT & Token Lifecycle**:
   - Access Token: Short-lived (15 minutes), digitally signed with RS256/ES256 or HMAC-SHA256 with high-entropy secret.
   - Refresh Token: Long-lived (7 days), stored in encrypted database collection with unique token family identifier, rotated upon every consumption (Token Rotation). Replay of an old refresh token instantly invalidates the entire token family.
3. **Time-Based One-Time Password (TOTP 2FA)**:
   - Mandatory for all administrators, compliance officers, accountants, and agents.
   - RFC 6238 compliant TOTP using QR enrollment with stored AES-256-GCM encrypted secret.
4. **Brute-Force & Credential Stuffing Defense**:
   - Account locks for 15 minutes after 5 consecutive failed attempts.
   - IP-level and User-level rate limiting via Redis (`express-rate-limit` / NestJS `ThrottlerModule`).
   - Audit event logged on every failed attempt with client IP, user agent, and timestamp.

---

### 2. Authorization, RBAC & Scoping Boundary

1. **Role-Based Access Control (RBAC)**:
   - Permissions are discrete codes: `MODULE:ACTION` (e.g. `TRADING:BUY`, `ACCOUNTING:POST_JOURNAL`, `REMITTANCE:APPROVE`).
   - Roles aggregate permissions. Dynamic roles can be defined per organization.
2. **Multi-Tenant & Branch Scoping**:
   - Every request is resolved to an authenticated user context `{ userId, organizationId, legalEntityId, allowedBranchIds, role }`.
   - Backend guards verify that any mutated entity or account belongs to the user's tenant and allowed branches.
   - Master Admin can view consolidated data across entities, but cannot bypass Maker-Checker rules for their own created transactions.
3. **Maker-Checker Segregation of Duties**:
   - Rule: `transaction.createdBy != request.user._id` for all approval actions (`APPROVE`, `REJECT`, `REVERSE`, `PERIOD_CLOSE`, `FUND_ADJUST`).
   - If creator attempts to approve their own request, the API throws `403 FORBIDDEN: MAKER_CHECKER_VIOLATION`.

---

### 3. Data Protection, Encryption & Financial Integrity

1. **Data at Rest**:
   - Sensitive fields (bank account numbers, national identity IDs, passport numbers, TOTP secrets) are encrypted before insertion into MongoDB using AES-256-GCM with envelope encryption.
   - Document attachments (KYC identity scans, invoices) are stored in S3-compatible private buckets with server-side encryption (SSE-S3 / SSE-KMS).
2. **Data in Transit**:
   - Enforced TLS 1.3 / HTTPS across all internal and public network boundaries.
   - Secure HTTP response headers managed via `Helmet`: CSP, HSTS, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`).
3. **Tamper-Evident Audit Trails**:
   - Every state change writes an append-only document in `auditLogs` containing `userId`, `action`, `module`, `beforeState`, `afterState`, and a cryptographically generated `changeHash` = `HMAC-SHA256(beforeState + afterState + timestamp, audit_secret)`.
   - Tamper-evident: audits cannot be updated or dropped.

---

### 4. Injection & Input Validation Defense

1. **Schema Validation**:
   - Every incoming payload is validated using NestJS `ValidationPipe` with `class-validator` / `zod`.
   - `whitelist: true` and `forbidNonWhitelisted: true` strip and reject unexpected attributes, preventing mass assignment.
2. **NoSQL / MongoDB Query Injection**:
   - Strict sanitization preventing operator injection (`$gt`, `$ne`, `$where`).
   - Mongoose strictly cast queries against strongly-typed schemas.
3. **Idempotency**:
   - Financial mutations require `X-Idempotency-Key`.
   - If a duplicate key is presented within the TTL window (24 hours), the server returns the cached response without re-executing business logic.
