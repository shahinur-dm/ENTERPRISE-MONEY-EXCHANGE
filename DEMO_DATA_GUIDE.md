# DEMO DATA GUIDE — DAWAT ENTERPRISE FINANCIAL ERP
**System:** DAWAT ERP • Institutional Money Exchange & International Remittance  
**Dataset Version:** 2.0.0-DEMO  
**Storage Architecture:** `packages/shared/src/demo-data.ts` & MongoDB Idempotent Seeder  

---

## 1. DATASET COMPOSITION OVERVIEW

The demonstration database has been populated with interconnected, realistic financial, counterparty, and transaction records specifically modeled on the Malaysia (Kuala Lumpur) ⇄ Bangladesh (Dhaka & Chittagong) financial corridor.

```
+---------------------------------------------------------------------------------------------------+
|                                  DAWAT ERP DEMO ENTITY GRAPH                                      |
+---------------------------------------------------------------------------------------------------+
|  [Demo Organization]                                                                              |
|        |                                                                                          |
|        +--> [MYS Entity: Dawat Remit Sdn Bhd] ---> [KUL-01 Central Branch]                        |
|        |                                                                                          |
|        +--> [BGD Entity: Dawat Exchange Ltd] ----> [DHK-01 Dhaka HQ] & [CTG-01 Chittagong]        |
|                                                                                                   |
|  [32 Verified Customers] <===> [30 Beneficiaries] <===> [52 Remittances]                          |
|           |                                                    |                                  |
|           +--> [42 FX Sales]                            [10 Payout Agents]                        |
|                                                                |                                  |
|  [12 Wholesale Suppliers] <===> [42 FX Purchases] =====> [General Ledger Balancing Journals]      |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. DETAILED SEED RECORD BREAKDOWN

### 2.1 Supported Currencies & Exchange Board
| Currency | Description | Demo Spot Buy | Demo Spot Sell | Spread (Bps) |
| :---: | :--- | :---: | :---: | :---: |
| **MYR** | Malaysian Ringgit (KUL Base) | 1.0000 | 1.0000 | 0 |
| **BDT** | Bangladeshi Taka (Settlement) | 33.0000 | 35.0000 | 200 |
| **USD** | United States Dollar | 4.4500 | 4.4800 | 30 |
| **EUR** | Euro | 4.8500 | 4.8900 | 40 |
| **GBP** | British Pound Sterling | 5.6500 | 5.7000 | 50 |
| **AED** | UAE Dirham | 1.2100 | 1.2300 | 20 |
| **SAR** | Saudi Riyal | 1.1800 | 1.2000 | 20 |
| **SGD** | Singapore Dollar | 3.3200 | 3.3500 | 30 |

### 2.2 Counterparty & Entity Counts
1. **Customers (32 Records):** 26 Individual senders (with valid passport numbers, Malaysian mobile formats `+60`, and KYC tier levels) + 6 Corporate trading entities (with SSM company registration numbers and Corporate EDD ratings).
2. **Wholesale Suppliers (12 Records):** Top institutional liquidity desks including Metro Forex Wholesale, CIMB Treasury, Maybank Global Markets, sonali Bank UK, and UAE Exchange.
3. **Payout Agents (10 Records):** Commercial bank branches and MFS settlement hubs (Islami Bank Bangladesh, Dutch-Bangla Bank, bKash Master Distributor, Sonali Bank Sylhet, etc.).
4. **Beneficiaries (30 Records):** 20 Commercial bank accounts with verified routing numbers + 10 bKash / Nagad mobile financial service accounts.
5. **Remittances (52 Records):** Complete 16-state audit trails ranging from `PAID_OUT` (instant API settlement), `DISPATCHED`, `FUNDS_COLLECTED`, to `PENDING_APPROVAL`.
6. **FX Purchases (42 Records):** Wholesale foreign currency acquisitions totaling over 4.8M MYR with 12-decimal-place WAC inventory pool recalculation.
7. **FX Sales (42 Records):** Retail counter sales recognizing realized gross margins posted directly to GL Account 4010.

---

## 3. IDEMPOTENT FINANCIAL INVARIANTS

1. **Double-Entry Equilibrium:** Every seeded transaction is tied to a corresponding journal voucher in `DEMO_BALANCED_JOURNALS` where $\sum\text{Debit} \equiv \sum\text{Credit}$.
2. **Customer Ledger Reconciliation:** Every customer transaction amount precisely matches their statement balance.
3. **Zero Negative Inventory:** FX cost pools never deplete below zero; Weighted Average Cost formulas strictly adhere to BR-003.
4. **Idempotency Guarantee:** Seeder script checks entity codes before insertion; running the seeder repeatedly creates zero duplicates.
