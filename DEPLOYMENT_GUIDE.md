# DEPLOYMENT & PRODUCTION RUNBOOK — DAWAT ERP
**Target System:** DAWAT Enterprise Money Exchange & International Remittance  
**Architecture:** Next.js Frontend + NestJS Modular Monolith API + MongoDB Replica Set  

---

## 1. PREREQUISITES & ENVIRONMENT SETUP

### System Requirements:
- Node.js v20.x or v22.x LTS
- MongoDB v6.0+ (Replica Set enabled for ACID transactions)
- Redis v7.x (for BullMQ queues and rate limiting)

### Environment Configuration:
Create `.env` at root or within `apps/api`:
```bash
# Network & Server
PORT=4000
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Database
MONGO_URI=mongodb://127.0.0.1:27017/money_exchange_erp?replicaSet=rs0
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Authentication & Security
JWT_SECRET=super_secret_enterprise_jwt_key_2026_dawat_erp
JWT_EXPIRATION=900
JWT_REFRESH_SECRET=super_secret_refresh_key_2026_dawat_erp
JWT_REFRESH_EXPIRATION=604800
TOTP_APP_NAME="DAWAT ERP"

# Financial Operational Limits
RATE_QUOTE_TTL_SECONDS=900
MAKER_CHECKER_MYR_THRESHOLD=50000
KYC_TIER3_BDT_THRESHOLD=1500000
```

---

## 2. PRODUCTION BUILD & START PROCEDURES

### 2.1 Building Shared Packages & Backend API
```bash
# 1. Compile shared types and decimal math
node node_modules/typescript/bin/tsc -p packages/types/tsconfig.json
node node_modules/typescript/bin/tsc -p packages/shared/tsconfig.json

# 2. Compile NestJS API Gateway
node node_modules/typescript/bin/tsc -p apps/api/tsconfig.json

# 3. Compile Next.js Web Frontend
node node_modules/next/dist/bin/next build apps/web
```

### 2.2 Starting Production Services
```bash
# Start Backend API Daemon (Port 4000)
node apps/api/dist/main.js

# Start Next.js Web Server (Port 3000)
node node_modules/next/dist/bin/next start apps/web -p 3000
```

---

## 3. SEEDING & DATABASE INITIALIZATION
To initialize institutional hierarchy, legal entities, branches, and sample demo records:
```bash
# Seed initial organization and exchange rates
node -e "const { seedEnterpriseDemo } = require('./apps/api/dist/database/seeds/enterprise-demo.seeder.js');"
```

---

## 4. HEALTH CHECK & MONITORING ENDPOINTS
- **API Health & Gateway:** `http://localhost:4000/api/v1/health`
- **Swagger Documentation:** `http://localhost:4000/api/docs`
- **Web Application Portal:** `http://localhost:3000`
- **Route Audit Verification:** `node scripts/verify-all-routes.js`
