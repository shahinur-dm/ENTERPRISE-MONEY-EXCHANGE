import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DecimalMath } from '@erp/shared';
import { COAAccountType, JournalStatus, SystemStatus } from '@erp/types';
import { ChartOfAccount, ChartOfAccountDocument } from './schemas/coa.schema';
import { JournalEntry, JournalEntryDocument } from './schemas/journal-entry.schema';

export interface CreateJournalEntryDto {
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  businessDate: string;
  sourceModule: string;
  referenceId?: string;
  referenceType?: string;
  narration: string;
  functionalCurrency: string;
  postedBy: string;
  lines: Array<{
    coaId: string;
    coaCode: string;
    coaName: string;
    currency: string;
    nativeAmount: string;
    exchangeRate?: string;
    debit: string;
    credit: string;
    memo?: string;
  }>;
}

@Injectable()
export class AccountingService {
  private readonly logger = new Logger(AccountingService.name);

  constructor(
    @InjectModel(ChartOfAccount.name)
    private readonly coaModel: Model<ChartOfAccountDocument>,
    @InjectModel(JournalEntry.name)
    private readonly journalModel: Model<JournalEntryDocument>,
  ) {}

  /**
   * Post a double-entry Journal Entry with strict BR-001 equilibrium validation
   */
  async postJournalEntry(dto: CreateJournalEntryDto): Promise<JournalEntry> {
    if (!dto.lines || dto.lines.length < 2) {
      throw new BadRequestException('A journal entry must contain at least two balancing lines.');
    }

    let sumDebit = '0';
    let sumCredit = '0';

    for (const line of dto.lines) {
      const d = line.debit || '0';
      const c = line.credit || '0';

      if (DecimalMath.lessThan(d, '0') || DecimalMath.lessThan(c, '0')) {
        throw new BadRequestException('Negative debit or credit amounts are strictly prohibited.');
      }

      sumDebit = DecimalMath.add(sumDebit, d).toString();
      sumCredit = DecimalMath.add(sumCredit, c).toString();
    }

    // BR-001 Invariant Check: Sum(Debit) == Sum(Credit)
    if (!DecimalMath.equals(sumDebit, sumCredit)) {
      throw new BadRequestException(
        `BR-001 VIOLATION: Journal entry is unbalanced. Total Debit (${sumDebit}) != Total Credit (${sumCredit})`,
      );
    }

    // Generate unique sequential entry number
    const count = await this.journalModel.countDocuments();
    const entryNumber = `JE-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    // Create journal entry document
    const created = new this.journalModel({
      entryNumber,
      organizationId: new Types.ObjectId(dto.organizationId),
      legalEntityId: new Types.ObjectId(dto.legalEntityId),
      branchId: new Types.ObjectId(dto.branchId),
      postingDate: new Date(),
      businessDate: dto.businessDate,
      sourceModule: dto.sourceModule || 'MANUAL',
      referenceId: dto.referenceId,
      referenceType: dto.referenceType,
      narration: dto.narration,
      totalDebit: Types.Decimal128.fromString(sumDebit),
      totalCredit: Types.Decimal128.fromString(sumCredit),
      functionalCurrency: dto.functionalCurrency,
      status: JournalStatus.POSTED,
      isReversal: false,
      postedBy: new Types.ObjectId(dto.postedBy),
      lines: dto.lines.map((l) => ({
        coaId: new Types.ObjectId(l.coaId),
        coaCode: l.coaCode,
        coaName: l.coaName,
        currency: l.currency,
        nativeAmount: Types.Decimal128.fromString(l.nativeAmount || '0'),
        exchangeRate: Types.Decimal128.fromString(l.exchangeRate || '1'),
        debit: Types.Decimal128.fromString(l.debit || '0'),
        credit: Types.Decimal128.fromString(l.credit || '0'),
        memo: l.memo,
      })),
    });

    const saved = await created.save();

    // Update Account Head balances atomically
    for (const line of dto.lines) {
      const coa = await this.coaModel.findById(line.coaId);
      if (coa) {
        const currentBal = coa.balance ? coa.balance.toString() : '0';
        const d = line.debit || '0';
        const c = line.credit || '0';

        let newBal = currentBal;
        if (
          coa.accountType === COAAccountType.ASSET ||
          coa.accountType === COAAccountType.EXPENSE
        ) {
          // Assets & Expenses increase with Debit, decrease with Credit
          newBal = DecimalMath.subtract(DecimalMath.add(currentBal, d), c).toString();
        } else {
          // Liabilities, Equity, Revenue increase with Credit, decrease with Debit
          newBal = DecimalMath.subtract(DecimalMath.add(currentBal, c), d).toString();
        }

        coa.balance = Types.Decimal128.fromString(newBal) as any;
        await coa.save();
      }
    }

    this.logger.log(`Posted Journal Entry ${entryNumber} with equilibrium: ${sumDebit} ${dto.functionalCurrency}`);
    return saved;
  }

  /**
   * Reverse an existing posted Journal Entry (BR-002 Immutability rule)
   */
  async reverseJournalEntry(journalId: string, reason: string, userId: string): Promise<JournalEntry> {
    const original = await this.journalModel.findById(journalId);
    if (!original) {
      throw new NotFoundException(`Journal entry ${journalId} not found`);
    }

    if (original.status === JournalStatus.REVERSED) {
      throw new BadRequestException('This journal entry has already been reversed.');
    }

    // Invert lines: Debits become Credits, Credits become Debits
    const invertedLines = original.lines.map((l) => ({
      coaId: l.coaId.toString(),
      coaCode: l.coaCode,
      coaName: l.coaName,
      currency: l.currency,
      nativeAmount: l.nativeAmount.toString(),
      exchangeRate: l.exchangeRate.toString(),
      debit: l.credit.toString(),
      credit: l.debit.toString(),
      memo: `Reversal: ${l.memo || reason}`,
    }));

    const reversalEntry = await this.postJournalEntry({
      organizationId: original.organizationId.toString(),
      legalEntityId: original.legalEntityId.toString(),
      branchId: original.branchId.toString(),
      businessDate: new Date().toISOString().split('T')[0],
      sourceModule: 'REVERSAL',
      referenceId: (original as any)._id.toString(),
      referenceType: 'JOURNAL_REVERSAL',
      narration: `Reversal of ${original.entryNumber}: ${reason}`,
      functionalCurrency: original.functionalCurrency,
      postedBy: userId,
      lines: invertedLines,
    });

    // Mark original as reversed and link reversal
    original.status = JournalStatus.REVERSED;
    original.reversalOfJournalId = (reversalEntry as any)._id;
    await original.save();

    return reversalEntry;
  }

  /**
   * Query Trial Balance and verify system-wide debit-credit equilibrium
   */
  async getTrialBalance(legalEntityId: string) {
    const accounts = await this.coaModel.find({
      legalEntityId: new Types.ObjectId(legalEntityId),
      status: SystemStatus.ACTIVE,
    });

    let totalDebit = '0';
    let totalCredit = '0';

    const items = accounts.map((acc) => {
      const bal = acc.balance ? acc.balance.toString() : '0';
      const isAssetOrExpense =
        acc.accountType === COAAccountType.ASSET ||
        acc.accountType === COAAccountType.EXPENSE;

      const debit = isAssetOrExpense ? (DecimalMath.greaterThan(bal, '0') ? bal : '0') : '0';
      const credit = !isAssetOrExpense ? (DecimalMath.greaterThan(bal, '0') ? bal : '0') : '0';

      totalDebit = DecimalMath.add(totalDebit, debit).toString();
      totalCredit = DecimalMath.add(totalCredit, credit).toString();

      return {
        id: (acc as any)._id,
        code: acc.code,
        name: acc.name,
        accountType: acc.accountType,
        classification: acc.classification,
        currency: acc.currency,
        debit,
        credit,
      };
    });

    const isBalanced = DecimalMath.equals(totalDebit, totalCredit);

    return {
      legalEntityId,
      asOfDate: new Date(),
      totalDebit,
      totalCredit,
      isBalanced,
      variance: DecimalMath.subtract(totalDebit, totalCredit).toString(),
      accounts: items,
    };
  }

  /**
   * Get Chart of Accounts for an entity
   */
  async getChartOfAccounts(legalEntityId: string) {
    return this.coaModel.find({
      legalEntityId: new Types.ObjectId(legalEntityId),
      status: SystemStatus.ACTIVE,
    }).sort({ code: 1 });
  }

  /**
   * Get General Ledger entries
   */
  async getGeneralLedger(legalEntityId: string, limit = 50) {
    return this.journalModel
      .find({ legalEntityId: new Types.ObjectId(legalEntityId) })
      .sort({ postingDate: -1 })
      .limit(limit);
  }

  /**
   * Seed standard institutional Chart of Accounts
   */
  async seedStandardCOA(organizationId: string, legalEntityId: string, functionalCurrency: string) {
    const existing = await this.coaModel.countDocuments({
      legalEntityId: new Types.ObjectId(legalEntityId),
    });

    if (existing > 0) return;

    const standardAccounts = [
      // 1000: ASSETS
      { code: '1010', name: 'Cash on Hand / Vault (Base)', accountType: COAAccountType.ASSET, classification: 'Current Assets', currency: functionalCurrency, balance: '500000.00' },
      { code: '1020', name: 'Foreign Currency Vault (Inventory)', accountType: COAAccountType.ASSET, classification: 'Current Assets', currency: functionalCurrency, balance: '250000.00' },
      { code: '1030', name: 'Operating Bank Account', accountType: COAAccountType.ASSET, classification: 'Current Assets', currency: functionalCurrency, balance: '1200000.00' },
      { code: '1040', name: 'Remittance Clearing Account', accountType: COAAccountType.ASSET, classification: 'Current Assets', currency: functionalCurrency, balance: '150000.00' },
      { code: '1050', name: 'Customer Receivables', accountType: COAAccountType.ASSET, classification: 'Current Assets', currency: functionalCurrency, balance: '0.00' },
      
      // 2000: LIABILITIES
      { code: '2010', name: 'Accounts Payable - FX Suppliers', accountType: COAAccountType.LIABILITY, classification: 'Current Liabilities', currency: functionalCurrency, balance: '100000.00' },
      { code: '2020', name: 'Remittance Payouts Payable', accountType: COAAccountType.LIABILITY, classification: 'Current Liabilities', currency: functionalCurrency, balance: '150000.00' },
      { code: '2030', name: 'Customer Funds Held on Deposit', accountType: COAAccountType.LIABILITY, classification: 'Current Liabilities', currency: functionalCurrency, balance: '50000.00' },

      // 3000: EQUITY
      { code: '3010', name: 'Share Capital', accountType: COAAccountType.EQUITY, classification: 'Equity', currency: functionalCurrency, balance: '1500000.00' },
      { code: '3020', name: 'Retained Earnings', accountType: COAAccountType.EQUITY, classification: 'Equity', currency: functionalCurrency, balance: '300000.00' },

      // 4000: REVENUE
      { code: '4010', name: 'FX Trading Margin & Realized Gain', accountType: COAAccountType.REVENUE, classification: 'Operating Revenue', currency: functionalCurrency, balance: '0.00' },
      { code: '4020', name: 'Remittance Service Fee Income', accountType: COAAccountType.REVENUE, classification: 'Operating Revenue', currency: functionalCurrency, balance: '0.00' },

      // 5000: EXPENSES
      { code: '5010', name: 'Remittance Partner Provider Charges', accountType: COAAccountType.EXPENSE, classification: 'Direct Costs', currency: functionalCurrency, balance: '0.00' },
      { code: '5020', name: 'Bank Charges & Clearing Fees', accountType: COAAccountType.EXPENSE, classification: 'Direct Costs', currency: functionalCurrency, balance: '0.00' },
      { code: '5030', name: 'Compliance & AML Screening Costs', accountType: COAAccountType.EXPENSE, classification: 'Operating Expenses', currency: functionalCurrency, balance: '0.00' },
    ];

    for (const acc of standardAccounts) {
      await this.coaModel.create({
        organizationId: new Types.ObjectId(organizationId),
        legalEntityId: new Types.ObjectId(legalEntityId),
        code: acc.code,
        name: acc.name,
        accountType: acc.accountType,
        classification: acc.classification,
        currency: acc.currency,
        balance: Types.Decimal128.fromString(acc.balance),
        status: SystemStatus.ACTIVE,
      });
    }

    this.logger.log(`Seeded standard Chart of Accounts for Legal Entity ${legalEntityId} (${functionalCurrency})`);
  }
}
