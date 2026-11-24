# ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP
## Database Schema & Data Models Specification

**Database Engine:** MongoDB 7.0+ Replica Set  
**ODM:** Mongoose with Strict Schema Validation  
**Precision Standard:** `Decimal128` for all amounts and rates  
**Temporal Standard:** UTC Timestamps (`ISODate`) + Local Business Dates (`YYYY-MM-DD`)

---

### 1. Structural Overview & Tenancy Pattern

All tenant-owned collections enforce organizational multi-tenancy:
```
Organization (1) 
   └── Legal Entity (1..N) 
         ├── Country (1) 
         ├── Branches (1..N) 
         ├── Financial Accounts (1..N) 
         └── Chart of Accounts & General Ledger (1)
```

Every document belonging to a tenant possesses `organizationId`. Operational records additionally possess `legalEntityId` and `branchId` where applicable.

---

### 2. Core Collections Specification

#### A. Organization & Access Management

##### 1. `organizations`
- `_id`: `UUID` / `ObjectId`
- `name`: `String` (Required, Indexed)
- `code`: `String` (Unique, uppercase, e.g. "ME-CORP")
- `baseCurrency`: `String` (ISO 4217, e.g. "USD" or "BDT")
- `status`: `Enum` ("ACTIVE", "SUSPENDED", "INACTIVE")
- `createdAt`, `updatedAt`: `Date`

##### 2. `countries`
- `_id`: `UUID` / `ObjectId`
- `isoCode`: `String` (Unique, e.g. "MYS", "BGD")
- `iso2Code`: `String` (Unique, e.g. "MY", "BD")
- `name`: `String`
- `defaultCurrency`: `String` (ISO 4217)
- `timezone`: `String` (e.g. "Asia/Kuala_Lumpur", "Asia/Dhaka")
- `status`: `Enum` ("ACTIVE", "INACTIVE")
- `regulatorySettings`: `Object` (KYC limits, AML threshold, tax identifiers)

##### 3. `legalEntities`
- `_id`: `UUID` / `ObjectId`
- `organizationId`: `ObjectId` (Ref: `organizations`, Indexed)
- `countryId`: `ObjectId` (Ref: `countries`, Indexed)
- `name`: `String` (e.g. "Dawat Remit SDN BHD")
- `registrationNo`: `String`
- `licenseNo`: `String`
- `functionalCurrency`: `String` (ISO 4217, e.g. "MYR" for Malaysia entity, "BDT" for Bangladesh entity)
- `status`: `Enum` ("ACTIVE", "SUSPENDED")
- `createdAt`, `updatedAt`: `Date`

##### 4. `branches`
- `_id`: `UUID` / `ObjectId`
- `organizationId`: `ObjectId` (Ref: `organizations`, Indexed)
- `legalEntityId`: `ObjectId` (Ref: `legalEntities`, Indexed)
- `code`: `String` (e.g. "KUL-01", "DHK-01", Unique per entity)
- `name`: `String`
- `type`: `Enum` ("HEAD_OFFICE", "RETAIL_BRANCH", "AGENT_OUTLET")
- `address`: `Object` ({ street, city, state, postalCode, countryCode })
- `phone`: `String`
- `email`: `String`
- `status`: `Enum` ("ACTIVE", "INACTIVE")
- `createdAt`, `updatedAt`: `Date`

##### 5. `users`
- `_id`: `UUID` / `ObjectId`
- `organizationId`: `ObjectId` (Ref: `organizations`, Indexed)
- `name`: `String`
- `email`: `String` (Unique, lowercase, Indexed)
- `passwordHash`: `String` (Argon2id)
- `phone`: `String`
- `role`: `String` ("MASTER_ADMIN", "COUNTRY_ADMIN", "BRANCH_ADMIN", "ACCOUNTANT", "AGENT", "COMPLIANCE_OFFICER", "AUDITOR")
- `customRoleId`: `ObjectId` (Ref: `roles`, Optional)
- `twoFactorEnabled`: `Boolean` (Default: false)
- `twoFactorSecret`: `String` (Encrypted)
- `allowedBranches`: `[ObjectId]` (Ref: `branches`)
- `status`: `Enum` ("ACTIVE", "LOCKED", "SUSPENDED")
- `failedLoginAttempts`: `Number` (Default: 0)
- `lockoutUntil`: `Date`
- `lastLoginAt`: `Date`
- `createdAt`, `updatedAt`: `Date`

##### 6. `roles` & `permissions`
- `roles`: `{ _id, organizationId, name, description, isSystem, permissions: [String] }`
- `permissions`: `{ code: String, module: String, action: String, description: String }`

---

#### B. Currency & Exchange Rate Management

##### 7. `currencies`
- `_id`: `UUID` / `ObjectId`
- `code`: `String` (Unique, ISO 4217, e.g. "BDT", "MYR", "USD")
- `name`: `String`
- `symbol`: `String`
- `decimalPlaces`: `Number` (Default: 2, e.g. BDT: 2, USD: 2, KWD: 3)
- `isFiat`: `Boolean` (Default: true)
- `status`: `Enum` ("ACTIVE", "INACTIVE")

##### 8. `currencyPairs`
- `_id`: `UUID` / `ObjectId`
- `baseCurrency`: `String` (e.g. "MYR")
- `quoteCurrency`: `String` (e.g. "BDT")
- `pairSymbol`: `String` (Unique, e.g. "MYR/BDT")
- `minSpread`: `Decimal128`
- `maxSpread`: `Decimal128`
- `minSellRate`: `Decimal128`
- `maxBuyRate`: `Decimal128`
- `status`: `Enum` ("ACTIVE", "INACTIVE")

##### 9. `exchangeRates`
- `_id`: `UUID` / `ObjectId`
- `pairId`: `ObjectId` (Ref: `currencyPairs`, Indexed)
- `legalEntityId`: `ObjectId` (Ref: `legalEntities`, Indexed)
- `buyRate`: `Decimal128` (Precision 24, 8)
- `sellRate`: `Decimal128` (Precision 24, 8)
- `effectiveFrom`: `Date` (Indexed)
- `expiresAt`: `Date` (Indexed)
- `version`: `Number`
- `createdBy`: `ObjectId` (Ref: `users`)
- `approvedBy`: `ObjectId` (Ref: `users`, Maker-Checker required for limit exceptions)
- `status`: `Enum` ("ACTIVE", "EXPIRED", "SUPERSEDED")

##### 10. `currencyCostPools` (Weighted Average Cost Inventory)
- `_id`: `UUID` / `ObjectId`
- `legalEntityId`: `ObjectId` (Ref: `legalEntities`, Indexed)
- `branchId`: `ObjectId` (Ref: `branches`, Indexed)
- `currency`: `String` (ISO 4217)
- `totalQuantity`: `Decimal128` (Available units)
- `totalCarryingValue`: `Decimal128` (In entity functional currency)
- `weightedAverageRate`: `Decimal128` ($\frac{\text{CarryingValue}}{\text{Quantity}}$)
- `updatedAt`: `Date`

---

#### C. Financial Accounts & Fund Management

##### 11. `financialAccounts`
- `_id`: `UUID` / `ObjectId`
- `organizationId`: `ObjectId` (Indexed)
- `legalEntityId`: `ObjectId` (Indexed)
- `branchId`: `ObjectId` (Indexed)
- `accountType`: `Enum` ("CASH_REGISTER", "BANK_ACCOUNT", "AUTHORIZED_MFS", "SETTLEMENT_CLEARING", "VAULT")
- `accountName`: `String`
- `accountNumber`: `String` (Encrypted / Masked for display)
- `bankName`: `String`
- `currency`: `String` (ISO 4217, Indexed)
- `openingBalance`: `Decimal128` (Immutable once initialized)
- `currentBalance`: `Decimal128` (Posted ledger balance)
- `availableBalance`: `Decimal128` ($\text{Current} - (\text{Reserved} + \text{Blocked})$)
- `reservedBalance`: `Decimal128` (Committed to ongoing remittances/trades)
- `blockedBalance`: `Decimal128` (Regulatory/compliance hold)
- `inTransitBalance`: `Decimal128` (Dispatched transfers awaiting receipt)
- `status`: `Enum` ("ACTIVE", "FROZEN", "CLOSED")
- `createdAt`, `updatedAt`: `Date`

##### 12. `fundReservations`
- `_id`: `UUID` / `ObjectId`
- `accountId`: `ObjectId` (Ref: `financialAccounts`, Indexed)
- `transactionType`: `Enum` ("REMITTANCE_PAYOUT", "INTERNAL_TRANSFER", "TRADE_COLLECTION")
- `referenceId`: `ObjectId` (Indexed)
- `amount`: `Decimal128`
- `status`: `Enum` ("ACTIVE", "COMMITTED", "RELEASED", "CANCELLED")
- `expiresAt`: `Date`
- `createdAt`: `Date`

##### 13. `fundTransfers` (Internal / Inter-branch)
- `_id`: `UUID` / `ObjectId`
- `transferNo`: `String` (Unique, e.g. "TRF-202611-0001")
- `organizationId`: `ObjectId`
- `sourceBranchId`: `ObjectId`
- `sourceAccountId`: `ObjectId`
- `destinationBranchId`: `ObjectId`
- `destinationAccountId`: `ObjectId`
- `currency`: `String`
- `amount`: `Decimal128`
- `status`: `Enum` ("REQUESTED", "APPROVED", "DISPATCHED", "RECEIVED", "REJECTED", "CANCELLED")
- `requestedBy`: `ObjectId`
- `approvedBy`: `ObjectId`
- `dispatchedAt`: `Date`
- `receivedAt`: `Date`

---

#### D. Accounting Engine (Double-Entry General Ledger)

##### 14. `chartOfAccounts`
- `_id`: `UUID` / `ObjectId`
- `organizationId`: `ObjectId` (Indexed)
- `legalEntityId`: `ObjectId` (Indexed)
- `code`: `String` (e.g. "1100", "1200", "2100", "4100")
- `name`: `String`
- `accountType`: `Enum` ("ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE")
- `classification`: `String` ("CURRENT_ASSET", "CASH_EQUIVALENT", "CURRENT_LIABILITY", etc.)
- `currency`: `String` (ISO 4217, or "ANY")
- `parentId`: `ObjectId` (Ref: `chartOfAccounts`, Optional for sub-accounts)
- `isReconciliation`: `Boolean` (True for bank/cash clearing accounts)
- `status`: `Enum` ("ACTIVE", "DISABLED")

##### 15. `journalEntries`
- `_id`: `UUID` / `ObjectId`
- `entryNumber`: `String` (Unique, e.g. "JRN-202611-00001")
- `organizationId`: `ObjectId` (Indexed)
- `legalEntityId`: `ObjectId` (Indexed)
- `branchId`: `ObjectId` (Indexed)
- `accountingPeriodId`: `ObjectId` (Ref: `accountingPeriods`, Indexed)
- `postingDate`: `Date` (Indexed)
- `businessDate`: `String` ("YYYY-MM-DD")
- `sourceModule`: `Enum` ("TRADING_BUY", "TRADING_SELL", "REMITTANCE", "TRANSFER", "EXPENSE", "PAYROLL", "MANUAL")
- `referenceId`: `ObjectId` (Ref to trade, remittance, transfer)
- `referenceType`: `String`
- `narration`: `String`
- `totalDebit`: `Decimal128`
- `totalCredit`: `Decimal128` ($\text{totalDebit} \equiv \text{totalCredit}$)
- `functionalCurrency`: `String`
- `status`: `Enum` ("DRAFT", "POSTED", "REVERSED")
- `isReversal`: `Boolean`
- `reversalOfJournalId`: `ObjectId` (Ref: `journalEntries`, Optional)
- `postedBy`: `ObjectId`
- `postedAt`: `Date`

##### 16. `journalLines`
- `_id`: `UUID` / `ObjectId`
- `journalId`: `ObjectId` (Ref: `journalEntries`, Indexed)
- `coaId`: `ObjectId` (Ref: `chartOfAccounts`, Indexed)
- `financialAccountId`: `ObjectId` (Ref: `financialAccounts`, Optional)
- `currency`: `String` (ISO 4217, Native currency of transaction)
- `nativeAmount`: `Decimal128` (Original amount)
- `exchangeRate`: `Decimal128` (Rate to functional currency)
- `debit`: `Decimal128` (In entity functional currency)
- `credit`: `Decimal128` (In entity functional currency)
- `memo`: `String`

##### 17. `accountingPeriods`
- `_id`: `UUID` / `ObjectId`
- `legalEntityId`: `ObjectId` (Indexed)
- `year`: `Number`
- `month`: `Number` (1-12)
- `startDate`: `Date`
- `endDate`: `Date`
- `status`: `Enum` ("OPEN", "CLOSING_IN_PROGRESS", "CLOSED")
- `closedBy`: `ObjectId`
- `closedAt`: `Date`

---

#### E. Currency Trading (Buy / Sell Operations)

##### 18. `currencyPurchases`
- `_id`: `UUID` / `ObjectId`
- `purchaseNo`: `String` (Unique, e.g. "PUR-202611-0001")
- `organizationId`: `ObjectId`
- `legalEntityId`: `ObjectId`
- `branchId`: `ObjectId`
- `supplierPartyId`: `ObjectId` (Ref: `parties`, Indexed)
- `purchasedCurrency`: `String` (e.g. "MYR")
- `quantity`: `Decimal128`
- `purchaseRate`: `Decimal128` (Rate in settlement currency, e.g. 33.00 BDT)
- `settlementCurrency`: `String` (Functional or local, e.g. "BDT")
- `totalSettlementAmount`: `Decimal128` ($\text{quantity} \times \text{purchaseRate}$)
- `paidAmount`: `Decimal128`
- `dueAmount`: `Decimal128` ($\text{total} - \text{paid}$)
- `receivingAccountId`: `ObjectId` (Ref: `financialAccounts`, foreign currency account)
- `paymentAccountId`: `ObjectId` (Ref: `financialAccounts`, bank/cash)
- `journalId`: `ObjectId` (Ref: `journalEntries`)
- `status`: `Enum` ("DRAFT", "APPROVED", "RECEIVED", "SETTLED", "REVERSED")
- `createdBy`: `ObjectId`
- `approvedBy`: `ObjectId`

##### 19. `currencySales`
- `_id`: `UUID` / `ObjectId`
- `saleNo`: `String` (Unique, e.g. "SAL-202611-0001")
- `organizationId`: `ObjectId`
- `legalEntityId`: `ObjectId`
- `branchId`: `ObjectId`
- `customerPartyId`: `ObjectId` (Ref: `parties`, Indexed)
- `soldCurrency`: `String`
- `quantity`: `Decimal128`
- `sellingRate`: `Decimal128`
- `grossProceeds`: `Decimal128` ($\text{quantity} \times \text{sellingRate}$)
- `costBasisRate`: `Decimal128` (Pulled from `currencyCostPools` at transaction time)
- `totalCostBasis`: `Decimal128` ($\text{quantity} \times \text{costBasisRate}$)
- `realizedFxGain`: `Decimal128` ($\text{grossProceeds} - \text{totalCostBasis}$)
- `receivedAmount`: `Decimal128`
- `dueAmount`: `Decimal128`
- `sourceAccountId`: `ObjectId` (Foreign currency account holding stock)
- `receivingAccountId`: `ObjectId` (Bank/cash receiving proceeds)
- `journalId`: `ObjectId`
- `status`: `Enum` ("DRAFT", "APPROVED", "DELIVERED", "SETTLED", "REVERSED")

---

#### F. Remittance Operations & State Machine

##### 20. `remittances`
- `_id`: `UUID` / `ObjectId`
- `transactionNo`: `String` (Unique, e.g. "REM-202611-00001")
- `organizationId`: `ObjectId` (Indexed)
- `sourceEntityId`: `ObjectId` (e.g. Malaysia legal entity)
- `sourceBranchId`: `ObjectId` (Indexed)
- `destinationEntityId`: `ObjectId` (e.g. Bangladesh legal entity)
- `destinationBranchId`: `ObjectId` (Indexed)
- `senderPartyId`: `ObjectId` (Ref: `parties`, Indexed)
- `beneficiaryId`: `ObjectId` (Ref: `beneficiaries`, Indexed)
- `sourceCurrency`: `String` (e.g. "MYR")
- `sourceAmount`: `Decimal128` (Principal)
- `exchangeRate`: `Decimal128` (Locked quote rate)
- `destinationCurrency`: `String` (e.g. "BDT")
- `destinationAmount`: `Decimal128` (Beneficiary payout amount)
- `serviceFee`: `Decimal128`
- `providerCharge`: `Decimal128`
- `totalCollectedAmount`: `Decimal128` ($\text{sourceAmount} + \text{serviceFee}$)
- `assignedAgentId`: `ObjectId` (Ref: `users`, Indexed)
- `payoutProviderId`: `ObjectId` (Ref: `paymentProviders`, Optional)
- `status`: `Enum` (
  "draft", "pending_collection", "collected", "compliance_review", 
  "approved", "assigned", "processing", "partially_paid", "paid", 
  "reconciled", "completed", "on_hold", "rejected", "cancelled", 
  "refunded", "reversed"
)
- `collectionJournalId`: `ObjectId` (Ref: `journalEntries`)
- `payoutJournalId`: `ObjectId` (Ref: `journalEntries`)
- `createdAt`, `updatedAt`: `Date`

##### 21. `remittanceStatusHistory`
- `_id`: `UUID` / `ObjectId`
- `remittanceId`: `ObjectId` (Ref: `remittances`, Indexed)
- `oldStatus`: `String`
- `newStatus`: `String`
- `reason`: `String`
- `changedBy`: `ObjectId` (Ref: `users`)
- `timestamp`: `Date`

---

#### G. Compliance, Screening & Audit

##### 22. `complianceScreenings`
- `_id`: `UUID` / `ObjectId`
- `partyId`: `ObjectId` (Ref: `parties`, Indexed)
- `remittanceId`: `ObjectId` (Optional)
- `screeningType`: `Enum` ("SANCTIONS", "PEP", "ADVERSE_MEDIA", "TRANSACTION_THRESHOLD")
- `matchedList`: `String` (e.g. "UN_SANCTIONS", "OFAC", "CENTRAL_BANK_WATCHLIST")
- `score`: `Number` (0 - 100)
- `decision`: `Enum` ("CLEAR", "POTENTIAL_MATCH", "BLOCKED", "FALSE_POSITIVE")
- `reviewedBy`: `ObjectId`
- `reviewedAt`: `Date`

##### 23. `auditLogs`
- `_id`: `UUID` / `ObjectId`
- `organizationId`: `ObjectId` (Indexed)
- `userId`: `ObjectId` (Ref: `users`, Indexed)
- `action`: `String` (e.g. "CREATE", "UPDATE", "APPROVE", "REVERSE", "LOGIN", "EXPORT")
- `module`: `String` (e.g. "REMITTANCE", "TRADING", "ACCOUNTING")
- `entityId`: `String`
- `ipAddress`: `String`
- `userAgent`: `String`
- `beforeState`: `Object`
- `afterState`: `Object`
- `changeHash`: `String` (SHA-256 tamper-evident integrity signature)
- `timestamp`: `Date` (Indexed)

---

### 3. Database Indexes Matrix

| Collection | Compound / Unique Indexes | Purpose |
| :--- | :--- | :--- |
| `organizations` | `{ code: 1 }` (Unique) | Tenant lookup |
| `users` | `{ email: 1 }` (Unique), `{ organizationId: 1, role: 1 }` | Fast authentication & RBAC resolution |
| `financialAccounts` | `{ branchId: 1, currency: 1, status: 1 }` | Fast balance & fund lookups |
| `journalEntries` | `{ legalEntityId: 1, postingDate: -1 }`, `{ entryNumber: 1 }` (Unique) | Ledger ordering and uniqueness |
| `journalLines` | `{ journalId: 1, coaId: 1 }`, `{ coaId: 1, createdAt: -1 }` | Account general ledger generation |
| `remittances` | `{ transactionNo: 1 }` (Unique), `{ sourceEntityId: 1, status: 1 }`, `{ assignedAgentId: 1, status: 1 }` | Agent queues and compliance pipeline |
| `auditLogs` | `{ organizationId: 1, timestamp: -1 }`, `{ entityId: 1 }` | Audit trails & compliance inquiries |
