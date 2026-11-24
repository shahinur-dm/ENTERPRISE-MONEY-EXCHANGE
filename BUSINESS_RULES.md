# ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP
## Core Business Rules & Invariants Specification

**Document Reference:** BR-DOC-1.0  
**Effective Date:** November 2026  
**Audience:** Financial Engineers, Backend Architects, Compliance Officers, Auditors

---

### 1. Invariant System Business Rules

| Rule ID | Rule Title | Formal Specification & Enforcement Mechanism |
| :--- | :--- | :--- |
| **BR-001** | **Posted Transaction Immutability** | A transaction (Currency Purchase, Sale, Remittance, Journal Entry) once status = `POSTED` or `COMPLETED` can NEVER be edited or hard-deleted. Modifying records in database triggers audit violation. |
| **BR-002** | **Corrections Via Linked Reversals** | All financial corrections must be executed by creating a new linked reversal journal entry (`isReversal: true`, `reversalOfJournalId: <ID>`), restoring exact previous account balances. |
| **BR-003** | **Insufficient Available Funds Block** | Payment execution, fund transfer, or remittance payout must fail immediately if `amount > availableBalance`. `availableBalance = currentBalance - (reservedBalance + blockedBalance)`. No negative balances permitted. |
| **BR-004** | **Double-Entry Equilibrium** | Every journal entry must have $\sum \text{Debit} \equiv \sum \text{Credit}$ in the entity's functional currency. Postings with discrepancy $> 0.00000001$ are rejected at the database transaction layer. |
| **BR-005** | **Historical Rate Immutability** | Exchange rates applied to historical trades and remittances are captured as an immutable rate snapshot. Future adjustments to current exchange rates never alter past transaction valuations. |
| **BR-006** | **Single Active Agent Assignment** | A remittance transaction can have at most one active assigned agent (`assignedAgentId`) at any given moment. Reassignment is strictly logged in audit history with justification. |
| **BR-007** | **Payout & Reservation Ceiling** | The sum of completed payouts plus active reserved payout allocations for a remittance must never exceed the approved destination amount: $\text{Paid} + \text{Reserved} \le \text{ApprovedPayoutAmount}$. |
| **BR-008** | **Duplicate Provider Reference Block** | An external payout provider reference or bank transaction ID can only be associated with exactly one payout/collection record. Repetitions are rejected via unique compound indexes. |
| **BR-009** | **Closed Accounting Period Lock** | No journal entry may be created or posted with a `postingDate` falling within an accounting period whose status is `CLOSED`. Transactions must be posted in the active open period. |
| **BR-010** | **Tenant & Branch Scoping Boundary** | Non-Master Admin users can only query, view, or mutate financial data for branches explicitly assigned in their `user_branches` profile. Cross-branch access without authorization yields `403 Forbidden`. |
| **BR-011** | **Compliance Hold Payout Freeze** | If a customer, beneficiary, or transaction triggers a Sanctions/PEP screening match or compliance alert, status transitions to `on_hold`. All payout disbursements are strictly blocked until cleared by a Compliance Officer. |
| **BR-012** | **Fund Adjustment Maker-Checker** | Manual fund adjustments (e.g., cash count discrepancy, bank fee adjustment) require a formal request with reason and evidence, approved by an independent manager. Direct ledger adjustments are disallowed. |
| **BR-013** | **Remittance Completion Requisites** | Remittance status may only advance to `completed` after verified provider payout confirmation and general ledger bank clearing reconciliation are complete. |
| **BR-014** | **Internal Transfers are Non-Revenue** | Branch-to-branch or account-to-account transfers are balance sheet asset relocations and must never touch revenue or expense accounts. Intercompany transfers utilize reciprocal due-to/due-from clearing accounts. |
| **BR-015** | **Strict Currency Segregation** | Each financial account has one immutable ISO 4217 currency. Cross-currency balances are never aggregated directly without explicit valuation exchange rates. |
| **BR-016** | **Atomic Concurrency Defense** | Double-spending is prevented via MongoDB session transactions (`session.withTransaction`) paired with optimistic concurrency checks (`version` tag or conditional balance update `$inc` with `$gte` check). |
| **BR-017** | **Refund Traceability & Reciprocal Journals** | Any remittance refund must be explicitly linked to the parent remittance ID. Refund returns principal to sender and reverses remittance liability via journal entry. Service fees are non-refundable unless authorized. |
| **BR-018** | **Auto-Calculated Partial Payments** | In partial currency purchase or sales payments, remaining due is automatically derived: $\text{Due} = \text{TotalAmount} - \text{TotalPaidSoFar}$. Accounts receivable or payable is booked accordingly. |
| **BR-019** | **Reproducible Historical Reports** | Balance sheets, P&L, and general ledgers generated for any past timestamp must be 100% reproducible by replaying journal entries up to that cutoff date. |
| **BR-020** | **Master Admin Credential Isolation** | Master Admin credentials must never be shared across individuals. Every user must have an individual identity with full audit log attribution. Maker-checker prevents Master Admin from approving their own financial writes. |

---

### 2. Weighted Average Cost (WAC) Inventory Rules

For foreign currency physical and account inventory:
1. When new currency is purchased:
   $$\text{NewQuantity} = Q_{\text{old}} + Q_{\text{purchased}}$$
   $$\text{NewCarryingValue} = V_{\text{old}} + (Q_{\text{purchased}} \times \text{PurchaseRate})$$
   $$\text{NewWACRate} = \frac{\text{NewCarryingValue}}{\text{NewQuantity}}$$
2. When currency is sold:
   $$\text{CostBasis} = Q_{\text{sold}} \times \text{CurrentWACRate}$$
   $$\text{GrossProceeds} = Q_{\text{sold}} \times \text{SellingRate}$$
   $$\text{RealizedFXGain} = \text{GrossProceeds} - \text{CostBasis}$$
   $$\text{RemainingCarryingValue} = V_{\text{old}} - \text{CostBasis}$$
   $$\text{RemainingQuantity} = Q_{\text{old}} - Q_{\text{sold}}$$

---

### 3. Remittance State Machine Transitions

```
[draft] 
   │
   ▼
[pending_collection] ──(funds collected)──► [collected]
                                                │
                                                ▼
                                      [compliance_review]
                                         │            │
                           (AML/PEP flag)│            │(clear)
                                         ▼            ▼
                                     [on_hold]    [approved]
                                         │            │
                                         │(cleared)   ▼
                                         └───────► [assigned]
                                                      │
                                                      ▼
                                                 [processing]
                                                 │          │
                                   (partial pay) │          │(full payout)
                                                 ▼          ▼
                                        [partially_paid]  [paid]
                                                           │
                                                           ▼
                                                     [reconciled]
                                                           │
                                                           ▼
                                                      [completed]
```
Terminal / Cancellation states:
- `[rejected]`: Failed compliance or regulatory criteria.
- `[cancelled]`: Customer cancelled prior to payout processing.
- `[refunded]`: Reimbursed back to customer with reversal journal.
- `[reversed]`: Post-completion audit correction.
