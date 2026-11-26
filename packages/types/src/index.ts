// packages/types/src/index.ts

// ==========================================
// 1. Core Common Enums & Identifiers
// ==========================================

export enum SystemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  LOCKED = 'LOCKED',
}

export enum UserRoleType {
  MASTER_ADMIN = 'MASTER_ADMIN',
  COUNTRY_ADMIN = 'COUNTRY_ADMIN',
  BRANCH_ADMIN = 'BRANCH_ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  AGENT = 'AGENT',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  AUDITOR = 'AUDITOR',
  CUSTOM = 'CUSTOM',
}

export enum PermissionModule {
  DASHBOARD = 'DASHBOARD',
  ORGANIZATION = 'ORGANIZATION',
  CURRENCY = 'CURRENCY',
  EXCHANGE_RATE = 'EXCHANGE_RATE',
  TRADING_BUY = 'TRADING_BUY',
  TRADING_SELL = 'TRADING_SELL',
  REMITTANCE = 'REMITTANCE',
  FUND = 'FUND',
  BANK = 'BANK',
  CASH = 'CASH',
  TRANSFERS = 'TRANSFERS',
  ACCOUNTING = 'ACCOUNTING',
  RECEIVABLE_PAYABLE = 'RECEIVABLE_PAYABLE',
  COMPLIANCE = 'COMPLIANCE',
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER',
  BENEFICIARY = 'BENEFICIARY',
  AGENT = 'AGENT',
  HR = 'HR',
  PAYROLL = 'PAYROLL',
  REPORTS = 'REPORTS',
  AUDIT = 'AUDIT',
  SETTINGS = 'SETTINGS',
}

export enum PermissionAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  EXPORT = 'EXPORT',
  PRINT = 'PRINT',
  MANAGE = 'MANAGE',
}

export interface PermissionDefinition {
  module: PermissionModule;
  action: PermissionAction;
  code: string;
  description: string;
}

// ==========================================
// 2. Organization & Entity Types
// ==========================================

export interface IOrganization {
  _id: string;
  name: string;
  code: string;
  baseCurrency: string;
  status: SystemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICountry {
  _id: string;
  isoCode: string; // e.g. "MYS", "BGD"
  iso2Code: string; // e.g. "MY", "BD"
  name: string;
  defaultCurrency: string;
  timezone: string;
  status: SystemStatus;
}

export interface ILegalEntity {
  _id: string;
  organizationId: string;
  countryId: string;
  name: string;
  registrationNo: string;
  licenseNo: string;
  functionalCurrency: string; // e.g. "MYR" or "BDT"
  status: SystemStatus;
}

export enum BranchType {
  HEAD_OFFICE = 'HEAD_OFFICE',
  RETAIL_BRANCH = 'RETAIL_BRANCH',
  AGENT_OUTLET = 'AGENT_OUTLET',
}

export interface IBranch {
  _id: string;
  organizationId: string;
  legalEntityId: string;
  code: string;
  name: string;
  type: BranchType;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    countryCode: string;
  };
  phone: string;
  email: string;
  status: SystemStatus;
}

// ==========================================
// 3. User & Auth Types
// ==========================================

export interface IUser {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRoleType;
  customRoleId?: string;
  twoFactorEnabled: boolean;
  allowedBranches: string[];
  status: SystemStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSessionPayload {
  userId: string;
  email: string;
  role: UserRoleType;
  organizationId: string;
  allowedBranches: string[];
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRoleType;
    organizationId: string;
    allowedBranches: string[];
    permissions: string[];
    twoFactorEnabled: boolean;
  };
}

// ==========================================
// 4. Currency & Exchange Rate Types
// ==========================================

export interface ICurrency {
  _id: string;
  code: string; // ISO 4217, e.g. BDT, MYR, USD
  name: string;
  symbol: string;
  decimalPlaces: number;
  isFiat: boolean;
  status: SystemStatus;
}

export interface ICurrencyPair {
  _id: string;
  baseCurrency: string;
  quoteCurrency: string;
  pairSymbol: string; // e.g. "MYR/BDT"
  minSpread?: string;
  maxSpread?: string;
  minSellRate?: string;
  maxBuyRate?: string;
  status: SystemStatus;
}

export interface IExchangeRate {
  _id: string;
  pairId: string;
  legalEntityId: string;
  buyRate: string; // Decimal representation
  sellRate: string;
  effectiveFrom: Date;
  expiresAt: Date;
  version: number;
  createdBy: string;
  approvedBy?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUPERSEDED';
}

// ==========================================
// 5. Fund & Account Management Types
// ==========================================

export enum FinancialAccountType {
  CASH_REGISTER = 'CASH_REGISTER',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  AUTHORIZED_MFS = 'AUTHORIZED_MFS',
  SETTLEMENT_CLEARING = 'SETTLEMENT_CLEARING',
  VAULT = 'VAULT',
}

export interface IFinancialAccount {
  _id: string;
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  accountType: FinancialAccountType;
  accountName: string;
  accountNumber: string;
  bankName?: string;
  currency: string;
  openingBalance: string;
  currentBalance: string;
  availableBalance: string;
  reservedBalance: string;
  blockedBalance: string;
  inTransitBalance: string;
  status: SystemStatus;
}

export enum FundReservationStatus {
  ACTIVE = 'ACTIVE',
  COMMITTED = 'COMMITTED',
  RELEASED = 'RELEASED',
  CANCELLED = 'CANCELLED',
}

// ==========================================
// 6. Accounting Engine Types
// ==========================================

export enum COAAccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export interface IChartOfAccount {
  _id: string;
  organizationId: string;
  legalEntityId: string;
  code: string; // e.g. "1100", "1200", "2100", "4100"
  name: string;
  accountType: COAAccountType;
  classification: string;
  currency: string;
  parentId?: string;
  isReconciliation: boolean;
  status: SystemStatus;
}

export enum JournalStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
}

export interface IJournalLine {
  _id?: string;
  coaId: string;
  coaCode?: string;
  coaName?: string;
  financialAccountId?: string;
  currency: string;
  nativeAmount: string;
  exchangeRate: string;
  debit: string; // In functional currency
  credit: string; // In functional currency
  memo?: string;
}

export interface IJournalEntry {
  _id: string;
  entryNumber: string;
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  accountingPeriodId: string;
  postingDate: Date;
  businessDate: string;
  sourceModule: string;
  referenceId?: string;
  referenceType?: string;
  narration: string;
  totalDebit: string;
  totalCredit: string;
  functionalCurrency: string;
  status: JournalStatus;
  isReversal: boolean;
  reversalOfJournalId?: string;
  lines: IJournalLine[];
  postedBy: string;
  postedAt: Date;
}

// ==========================================
// 7. Currency Trading (Buy / Sell) Types
// ==========================================

export enum TradeStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  DELIVERED = 'DELIVERED',
  SETTLED = 'SETTLED',
  REVERSED = 'REVERSED',
}

export interface ICurrencyPurchase {
  _id: string;
  purchaseNo: string;
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  supplierPartyId: string;
  purchasedCurrency: string;
  quantity: string;
  purchaseRate: string;
  settlementCurrency: string;
  totalSettlementAmount: string;
  paidAmount: string;
  dueAmount: string;
  receivingAccountId: string;
  paymentAccountId: string;
  journalId?: string;
  status: TradeStatus;
  createdBy: string;
  approvedBy?: string;
}

export interface ICurrencySale {
  _id: string;
  saleNo: string;
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  customerPartyId: string;
  soldCurrency: string;
  quantity: string;
  sellingRate: string;
  grossProceeds: string;
  costBasisRate: string;
  totalCostBasis: string;
  realizedFxGain: string;
  receivedAmount: string;
  dueAmount: string;
  sourceAccountId: string;
  receivingAccountId: string;
  journalId?: string;
  status: TradeStatus;
  createdBy: string;
  approvedBy?: string;
}

// ==========================================
// 8. Remittance State Machine Types
// ==========================================

export enum RemittanceStatus {
  DRAFT = 'draft',
  PENDING_COLLECTION = 'pending_collection',
  COLLECTED = 'collected',
  COMPLIANCE_REVIEW = 'compliance_review',
  APPROVED = 'approved',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  RECONCILED = 'reconciled',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  REVERSED = 'reversed',
}

export interface IRemittance {
  _id: string;
  transactionNo: string;
  organizationId: string;
  sourceEntityId: string;
  sourceBranchId: string;
  destinationEntityId: string;
  destinationBranchId: string;
  senderPartyId: string;
  beneficiaryId: string;
  sourceCurrency: string;
  sourceAmount: string;
  exchangeRate: string;
  destinationCurrency: string;
  destinationAmount: string;
  serviceFee: string;
  providerCharge: string;
  totalCollectedAmount: string;
  assignedAgentId?: string;
  payoutProviderId?: string;
  status: RemittanceStatus;
  collectionJournalId?: string;
  payoutJournalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 9. Compliance & Screening Types
// ==========================================

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  PROHIBITED = 'PROHIBITED',
}

export enum ScreeningDecision {
  CLEAR = 'CLEAR',
  POTENTIAL_MATCH = 'POTENTIAL_MATCH',
  BLOCKED = 'BLOCKED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export interface IComplianceScreening {
  _id: string;
  partyId: string;
  remittanceId?: string;
  screeningType: 'SANCTIONS' | 'PEP' | 'ADVERSE_MEDIA' | 'TRANSACTION_THRESHOLD';
  matchedList?: string;
  score: number;
  decision: ScreeningDecision;
  reviewedBy?: string;
  reviewedAt?: Date;
}

// ==========================================
// 11. Party & Money Exchange Business Types
// ==========================================

export enum PartyType {
  CUSTOMER = 'CUSTOMER',
  DEALER = 'DEALER',
  SUPPLIER = 'SUPPLIER',
  AGENT = 'AGENT',
  BOTH = 'BOTH',
}

export interface IParty {
  _id: string;
  partyNo: string;
  name: string;
  businessName?: string;
  partyType: PartyType;
  phone: string;
  altPhone?: string;
  email?: string;
  address?: string;
  nidOrPassport?: string;
  openingBalance: string; // in BDT
  currentBalance: string; // Positive = Receivable from party, Negative = Payable to party
  advanceBalance: string; // BDT advance held
  status: SystemStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum StockMovementType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  REVERSAL_PURCHASE = 'REVERSAL_PURCHASE',
  REVERSAL_SALE = 'REVERSAL_SALE',
  REVERSAL_IN = 'REVERSAL_IN',
  REVERSAL_OUT = 'REVERSAL_OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  OPENING = 'OPENING',
}

export interface IStockMovement {
  _id: string;
  movementNo: string;
  timestamp: Date;
  transactionId?: string;
  movementType: StockMovementType;
  currencyCode: string;
  openingQuantity: string;
  inflowQuantity: string;
  outflowQuantity: string;
  closingQuantity: string;
  unitCostRate: string;
  bdtValuation: string;
  reference: string;
  operatorId: string;
  memo?: string;
}

export interface IBusinessExpense {
  _id: string;
  expenseNo: string;
  date: Date;
  category: string;
  description: string;
  amountBDT: string;
  paymentAccountId: string;
  paidTo?: string;
  voucherRef?: string;
  operatorId: string;
  notes?: string;
  status: 'PAID' | 'CANCELLED';
}

export interface IDailyClosing {
  _id: string;
  closingDate: string; // YYYY-MM-DD
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  totalPurchaseBDT: string;
  totalSalesBDT: string;
  grossProfitBDT: string;
  totalExpensesBDT: string;
  netProfitBDT: string;
  systemExpectedCash: string;
  actualCashCounted: string;
  cashDifference: string;
  currencyStockSummary: Array<{
    currencyCode: string;
    systemStock: string;
    actualStock: string;
    difference: string;
    averageCost: string;
  }>;
  differenceReasons?: string;
  isClosed: boolean;
  closedBy: string;
  closedAt: Date;
}

export interface IStockAdjustment {
  _id: string;
  adjustmentNo: string;
  date: Date;
  currencyCode: string;
  systemStock: string;
  physicalStock: string;
  differenceQty: string;
  adjustmentType: 'SURPLUS' | 'SHORTAGE';
  unitCostRate: string;
  bdtValuationImpact: string;
  reason: string;
  operatorId: string;
  approvedBy?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface IPartyLedgerEntry {
  _id: string;
  partyId: string;
  partyName: string;
  partyType: PartyType;
  date: string;
  voucherNo: string;
  transactionType: 'PURCHASE' | 'SALE' | 'PAYMENT' | 'RECEIPT' | 'ADVANCE' | 'REVERSAL' | 'OPENING';
  currencyContext?: string;
  foreignQuantity?: string;
  rate?: string;
  debitBDT: string; // Increases party balance (receivable from party)
  creditBDT: string; // Decreases party balance (payable to party)
  balanceBDT: string;
  notes?: string;
  operatorId: string;
  timestamp: Date;
}


export interface IPartyLedgerEntry {
  _id: string;
  partyId: string;
  partyName: string;
  partyType: PartyType;
  date: string;
  voucherNo: string;
  transactionType: 'PURCHASE' | 'SALE' | 'PAYMENT' | 'RECEIPT' | 'ADVANCE' | 'REVERSAL' | 'OPENING';
  currencyContext?: string;
  foreignQuantity?: string;
  rate?: string;
  debitBDT: string; // Increases party balance (receivable)
  creditBDT: string; // Decreases party balance (payable)
  balanceBDT: string;
  notes?: string;
  operatorId: string;
  timestamp: Date;
}

export interface IFinancialTransaction {
  _id: string;
  transactionNo: string;
  date: Date;
  accountId: string;
  accountName: string;
  accountType: FinancialAccountType;
  voucherType: 'PURCHASE' | 'SALE' | 'PAYMENT' | 'RECEIPT' | 'TRANSFER' | 'EXPENSE' | 'ADJUSTMENT';
  referenceVoucherNo?: string;
  partyId?: string;
  partyName?: string;
  debitBDT: string; // Inflow
  creditBDT: string; // Outflow
  runningBalanceBDT: string;
  description: string;
  operatorId: string;
  createdAt: Date;
}


