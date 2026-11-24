# ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP

Institutional Multi-Entity, Multi-Currency Financial Management & Cross-Border Settlement ERP Software.

Designed for regulated money exchanges and licensed remittance service providers (Initial corridor: **Malaysia ⇄ Bangladesh**).

---

## 🏛️ System Architecture Overview

- **Architecture:** Modular Monolith with bounded domains
- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Decimal-safe formatters
- **Backend:** NestJS 10, TypeScript, OpenAPI/Swagger (`/api/docs`), JWT Authentication with Refresh Token Rotation, TOTP 2FA
- **Database:** MongoDB 7.0+ Replica Set, Mongoose with Decimal128 schema precision, MongoDB Multi-Document Transactions
- **Math Engine:** Strict Decimal.js calculations (28-digit precision, no floating-point arithmetic)

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Locally
```bash
# Start Backend API Gateway (Port 4000)
npm run dev:api

# Start Frontend Web Portal (Port 3000)
npm run dev:web
```

- **Frontend Portal:** [http://localhost:3000](http://localhost:3000)
- **API Documentation:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 📋 Documentation
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Master 10-Phase Roadmap & Quality Gates
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - MongoDB Schema & Indexing Matrix
- [BUSINESS_RULES.md](./BUSINESS_RULES.md) - Financial & Invariant Business Rules (BR-001 - BR-020)
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - REST API Endpoints Specification
- [SECURITY_PLAN.md](./SECURITY_PLAN.md) - RBAC, Scoping & Security Specifications
- [TASK_TRACKER.md](./TASK_TRACKER.md) - Implementation Status & Progress Tracker

---

## 🔐 Demonstration Credentials
- **Master Admin:** `admin@moneyexchange.com` / `Admin@123456`
- **Senior Accountant:** `accountant@moneyexchange.com` / `Accountant@123456`
- **KUL Agent:** `agent.kul@moneyexchange.com` / `Agent@123456`
- **Compliance Officer:** `compliance@moneyexchange.com` / `Compliance@123456`

---
*Developed by Dawat IT & Consultancy • Product Engineering*
