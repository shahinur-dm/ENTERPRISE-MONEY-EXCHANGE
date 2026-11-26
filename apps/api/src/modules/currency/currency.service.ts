import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DecimalMath } from '@erp/shared';
import { TradeStatus, StockMovementType, PartyType, FinancialAccountType, SystemStatus } from '@erp/types';
import { Currency, CurrencyDocument } from './schemas/currency.schema';
import { ExchangeRate, ExchangeRateDocument } from './schemas/exchange-rate.schema';
import { CurrencyCostPool, CurrencyCostPoolDocument } from './schemas/currency-cost-pool.schema';
import { CurrencyPurchase, CurrencyPurchaseDocument } from './schemas/currency-purchase.schema';
import { CurrencySale, CurrencySaleDocument } from './schemas/currency-sale.schema';
import { Party, PartyDocument } from './schemas/party.schema';
import { CurrencyStockMovement, CurrencyStockMovementDocument } from './schemas/currency-stock-movement.schema';
import { FinancialAccount, FinancialAccountDocument } from './schemas/financial-account.schema';
import { FinancialTransaction, FinancialTransactionDocument } from './schemas/financial-transaction.schema';
import { BusinessExpense, BusinessExpenseDocument } from './schemas/business-expense.schema';
import { DailyClosing, DailyClosingDocument } from './schemas/daily-closing.schema';
import { AccountingService } from '../accounting/accounting.service';

export interface ExecutePurchaseDto {
  partyId?: string;
  supplierName: string;
  purchasedCurrency: string;
  quantity: string;
  purchaseRate: string;
  settlementCurrency?: string;
  paidAmount?: string;
  paymentAccountId?: string;
  paymentMethod?: string;
  notes?: string;
  userId: string;
  businessDate?: string;
}

export interface ExecuteSaleDto {
  partyId?: string;
  customerName: string;
  soldCurrency: string;
  quantity: string;
  sellingRate: string;
  receivedAmount?: string;
  receiptAccountId?: string;
  receiptMethod?: string;
  notes?: string;
  userId: string;
  businessDate?: string;
}

export interface CustomerPaymentDto {
  partyId: string;
  purchaseId?: string;
  amountBDT: string;
  paymentAccountId: string;
  paymentMethod?: string;
  notes?: string;
  userId: string;
}

export interface BuyerReceiptDto {
  partyId: string;
  saleId?: string;
  amountBDT: string;
  receiptAccountId: string;
  receiptMethod?: string;
  notes?: string;
  userId: string;
}

export interface AccountTransferDto {
  sourceAccountId: string;
  destinationAccountId: string;
  amountBDT: string;
  notes?: string;
  userId: string;
}

export interface RecordExpenseDto {
  category: string;
  description: string;
  amountBDT: string;
  paymentAccountId: string;
  paidTo?: string;
  notes?: string;
  userId: string;
  date?: string;
}

export interface DailyClosingDto {
  closingDate: string; // YYYY-MM-DD
  actualCashCounted: string;
  currencyStockCounts: Array<{
    currencyCode: string;
    actualStock: string;
  }>;
  differenceReasons?: string;
  userId: string;
}

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>,
    @InjectModel(ExchangeRate.name)
    private readonly rateModel: Model<ExchangeRateDocument>,
    @InjectModel(CurrencyCostPool.name)
    private readonly poolModel: Model<CurrencyCostPoolDocument>,
    @InjectModel(CurrencyPurchase.name)
    private readonly purchaseModel: Model<CurrencyPurchaseDocument>,
    @InjectModel(CurrencySale.name)
    private readonly saleModel: Model<CurrencySaleDocument>,
    @InjectModel(Party.name)
    private readonly partyModel: Model<PartyDocument>,
    @InjectModel(CurrencyStockMovement.name)
    private readonly movementModel: Model<CurrencyStockMovementDocument>,
    @InjectModel(FinancialAccount.name)
    private readonly accountModel: Model<FinancialAccountDocument>,
    @InjectModel(FinancialTransaction.name)
    private readonly transactionModel: Model<FinancialTransactionDocument>,
    @InjectModel(BusinessExpense.name)
    private readonly expenseModel: Model<BusinessExpenseDocument>,
    @InjectModel(DailyClosing.name)
    private readonly closingModel: Model<DailyClosingDocument>,
    private readonly accountingService: AccountingService,
  ) {}

  /* ========================================================================== */
  /* 1. CURRENCIES & EXCHANGE RATES                                             */
  /* ========================================================================== */

  async getCurrencies() {
    let list = await this.currencyModel.find({ status: SystemStatus.ACTIVE }).sort({ code: 1 });
    if (list.length === 0) {
      await this.seedInitialCurrencies();
      list = await this.currencyModel.find({ status: SystemStatus.ACTIVE }).sort({ code: 1 });
    }
    return list;
  }

  async getExchangeRates() {
    const rates = await this.rateModel.find({ status: 'ACTIVE' }).sort({ pairSymbol: 1 });
    if (rates.length === 0) {
      await this.seedInitialRates();
      return this.rateModel.find({ status: 'ACTIVE' }).sort({ pairSymbol: 1 });
    }
    return rates;
  }

  async updateExchangeRate(pairSymbol: string, buyRate: string, sellRate: string, userId: string) {
    const buy = Types.Decimal128.fromString(buyRate);
    const sell = Types.Decimal128.fromString(sellRate);
    const mid = Types.Decimal128.fromString(DecimalMath.add(buyRate, sellRate).dividedBy(2).toFixed(4));
    const spread = Types.Decimal128.fromString(DecimalMath.subtract(sellRate, buyRate).toFixed(4));

    const existing = await this.rateModel.findOne({ pairSymbol, status: 'ACTIVE' });
    if (existing) {
      existing.status = 'SUPERSEDED' as any;
      await existing.save();
    }

    const [base, quote] = pairSymbol.split('/');
    const created = await this.rateModel.create({
      pairSymbol,
      baseCurrency: base,
      quoteCurrency: quote || 'BDT',
      buyRate: buy,
      sellRate: sell,
      midRate: mid,
      spread,
      effectiveFrom: new Date(),
      version: existing ? existing.version + 1 : 1,
      status: 'ACTIVE',
      createdBy: userId,
    });

    this.logger.log(`Updated exchange rate ${pairSymbol}: Buy=${buyRate}, Sell=${sellRate}`);
    return created;
  }

  /* ========================================================================== */
  /* 2. PARTY MANAGEMENT (CUSTOMERS & DEALERS)                                   */
  /* ========================================================================== */

  async getParties(type?: PartyType) {
    const filter: any = { status: SystemStatus.ACTIVE };
    if (type && type !== PartyType.BOTH) {
      filter.$or = [{ partyType: type }, { partyType: PartyType.BOTH }];
    }
    return this.partyModel.find(filter).sort({ name: 1 });
  }

  async getPartyById(id: string) {
    const party = await this.partyModel.findById(id);
    if (!party) throw new NotFoundException(`Party not found with ID ${id}`);
    return party;
  }

  async createParty(dto: {
    name: string;
    partyType: PartyType;
    businessName?: string;
    phone: string;
    altPhone?: string;
    email?: string;
    address?: string;
    nidOrPassport?: string;
    openingBalance?: string;
    notes?: string;
  }) {
    const count = await this.partyModel.countDocuments();
    const prefix = dto.partyType === PartyType.DEALER ? 'DLR' : 'CUST';
    const partyNo = `${prefix}-${String(count + 1).padStart(5, '0')}`;
    const openBal = dto.openingBalance || '0.00';

    const party = await this.partyModel.create({
      partyNo,
      partyType: dto.partyType,
      name: dto.name.trim(),
      businessName: dto.businessName?.trim(),
      phone: dto.phone.trim(),
      altPhone: dto.altPhone?.trim(),
      email: dto.email?.trim(),
      address: dto.address?.trim(),
      nidOrPassport: dto.nidOrPassport?.trim(),
      openingBalanceBDT: Types.Decimal128.fromString(openBal),
      currentBalanceBDT: Types.Decimal128.fromString(openBal),
      advanceBalanceBDT: Types.Decimal128.fromString('0.00'),
      status: SystemStatus.ACTIVE,
      notes: dto.notes,
    });

    if (DecimalMath.greaterThan(openBal, '0') || DecimalMath.lessThan(openBal, '0')) {
      await this.transactionModel.create({
        voucherNo: `OPN-${partyNo}`,
        transactionType: 'OPENING',
        partyId: party._id,
        partyName: party.name,
        amountBDT: Types.Decimal128.fromString(openBal),
        debit: DecimalMath.greaterThan(openBal, '0') ? Types.Decimal128.fromString(openBal) : Types.Decimal128.fromString('0'),
        credit: DecimalMath.lessThan(openBal, '0') ? Types.Decimal128.fromString(DecimalMath.from(openBal).abs().toString()) : Types.Decimal128.fromString('0'),
        runningPartyBalance: Types.Decimal128.fromString(openBal),
        operatorId: 'SYSTEM',
        notes: 'Initial party opening balance',
        date: new Date(),
      });
    }

    return party;
  }

  async getPartyLedger(partyId: string, fromDate?: string, toDate?: string) {
    const party = await this.getPartyById(partyId);
    const filter: any = { partyId: new Types.ObjectId(partyId) };

    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate + 'T23:59:59.999Z');
    }

    const txs = await this.transactionModel.find(filter).sort({ date: 1, createdAt: 1 });
    return {
      party,
      ledger: txs,
      currentBalanceBDT: party.currentBalanceBDT.toString(),
      advanceBalanceBDT: (party.advanceBalanceBDT ? party.advanceBalanceBDT.toString() : '0.00'),
    };
  }

  /* ========================================================================== */
  /* 3. MULTI-CURRENCY INVENTORY & WAC ENGINE                                   */
  /* ========================================================================== */

  async getStockSummary() {
    const currencies = await this.getCurrencies();
    const pools = await this.poolModel.find();
    const poolMap = new Map<string, CurrencyCostPoolDocument>();
    pools.forEach((p) => poolMap.set(p.currencyCode, p));

    // Get today's purchases and sales per currency
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayPurchases = await this.purchaseModel.aggregate([
      { $match: { createdAt: { $gte: todayStart }, status: { $ne: TradeStatus.REVERSED } } },
      { $group: { _id: '$purchasedCurrency', totalQty: { $sum: { $toDouble: '$quantity' } } } },
    ]);
    const purchaseMap = new Map(todayPurchases.map((p) => [p._id, p.totalQty]));

    const todaySales = await this.saleModel.aggregate([
      { $match: { createdAt: { $gte: todayStart }, status: { $ne: TradeStatus.REVERSED } } },
      { $group: { _id: '$soldCurrency', totalQty: { $sum: { $toDouble: '$quantity' } } } },
    ]);
    const salesMap = new Map(todaySales.map((s) => [s._id, s.totalQty]));

    return currencies
      .filter((c) => c.code !== 'BDT')
      .map((curr) => {
        const pool = poolMap.get(curr.code);
        const qty = pool ? pool.totalQuantity.toString() : '0.00';
        const wac = pool ? pool.weightedAverageCostRate.toString() : '0.0000';
        const valuation = pool ? pool.totalCostValuation.toString() : '0.00';

        return {
          code: curr.code,
          name: curr.name,
          symbol: curr.symbol,
          stockQuantity: qty,
          averageCostRateBDT: wac,
          totalValuationBDT: valuation,
          todayPurchased: (purchaseMap.get(curr.code) || 0).toFixed(2),
          todaySold: (salesMap.get(curr.code) || 0).toFixed(2),
        };
      });
  }

  async getStockLedger(currencyCode: string, fromDate?: string, toDate?: string) {
    const filter: any = { currencyCode: currencyCode.toUpperCase() };
    if (fromDate || toDate) {
      filter.timestamp = {};
      if (fromDate) filter.timestamp.$gte = new Date(fromDate);
      if (toDate) filter.timestamp.$lte = new Date(toDate + 'T23:59:59.999Z');
    }
    return this.movementModel.find(filter).sort({ timestamp: -1 });
  }

  /* ========================================================================== */
  /* 4. CURRENCY PURCHASE (FOREIGN CURRENCY BUY FROM CUSTOMER)                  */
  /* ========================================================================== */

  async executePurchase(dto: ExecutePurchaseDto): Promise<CurrencyPurchase> {
    const purchasedCurr = dto.purchasedCurrency.toUpperCase();
    const totalSettlement = DecimalMath.multiply(dto.quantity, dto.purchaseRate).toFixed(2);
    const paid = dto.paidAmount !== undefined ? DecimalMath.from(dto.paidAmount).toFixed(2) : totalSettlement;
    const due = DecimalMath.subtract(totalSettlement, paid).toFixed(2);

    // 1. Get or create Party
    let party: PartyDocument | null = null;
    if (dto.partyId) {
      party = await this.partyModel.findById(dto.partyId);
    }
    if (!party && dto.supplierName) {
      party = await this.partyModel.findOne({ name: dto.supplierName.trim() });
      if (!party) {
        party = await this.createParty({
          name: dto.supplierName.trim(),
          partyType: PartyType.CUSTOMER,
          phone: '+880 1700-000000',
        });
      }
    }

    // 2. Update Currency Cost Pool (Weighted Average Cost)
    let pool = await this.poolModel.findOne({ currencyCode: purchasedCurr });
    if (!pool) {
      pool = new this.poolModel({
        currencyCode: purchasedCurr,
        totalQuantity: Types.Decimal128.fromString('0'),
        weightedAverageCostRate: Types.Decimal128.fromString('0'),
        totalCostValuation: Types.Decimal128.fromString('0'),
      });
    }

    const oldQty = pool.totalQuantity ? pool.totalQuantity.toString() : '0';
    const oldVal = pool.totalCostValuation ? pool.totalCostValuation.toString() : '0';

    const wacCalc = DecimalMath.calculateNewWAC(oldQty, oldVal, dto.quantity, dto.purchaseRate);

    pool.totalQuantity = Types.Decimal128.fromString(wacCalc.newTotalQty) as any;
    pool.weightedAverageCostRate = Types.Decimal128.fromString(wacCalc.newWACRate) as any;
    pool.totalCostValuation = Types.Decimal128.fromString(wacCalc.newCarryingValue) as any;
    await pool.save();

    // 3. Generate Sequential Purchase Number
    const count = await this.purchaseModel.countDocuments();
    const purchaseNo = `FXP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    // 4. Record Immutable Stock Ledger Movement
    await this.movementModel.create({
      movementNo: `STK-${purchaseNo}`,
      movementType: StockMovementType.PURCHASE,
      currencyCode: purchasedCurr,
      openingQuantity: Types.Decimal128.fromString(oldQty),
      inflowQuantity: Types.Decimal128.fromString(dto.quantity),
      outflowQuantity: Types.Decimal128.fromString('0'),
      closingQuantity: Types.Decimal128.fromString(wacCalc.newTotalQty),
      unitCostRate: Types.Decimal128.fromString(wacCalc.newWACRate),
      bdtValuation: Types.Decimal128.fromString(wacCalc.newCarryingValue),
      reference: purchaseNo,
      operatorId: dto.userId,
      memo: `Purchased ${dto.quantity} ${purchasedCurr} @ ${dto.purchaseRate} from ${party?.name || dto.supplierName}`,
      timestamp: dto.businessDate ? new Date(dto.businessDate) : new Date(),
    });

    // 5. Update Cash / Bank Account (deduct paid amount)
    let payAccount: FinancialAccountDocument | null = null;
    if (DecimalMath.greaterThan(paid, '0')) {
      if (dto.paymentAccountId) {
        payAccount = await this.accountModel.findById(dto.paymentAccountId);
      }
      if (!payAccount) {
        payAccount = await this.accountModel.findOne({ accountType: FinancialAccountType.CASH_REGISTER, status: SystemStatus.ACTIVE });
        if (!payAccount) {
          payAccount = await this.accountModel.create({
            accountNo: 'CASH-001',
            accountName: 'Main Cash Register (Counter)',
            accountType: FinancialAccountType.CASH_REGISTER,
            currency: 'BDT',
            currentBalance: Types.Decimal128.fromString('1000000.00'),
            status: SystemStatus.ACTIVE,
          });
        }
      }

      const curBal = payAccount.currentBalance.toString();
      const newBal = DecimalMath.subtract(curBal, paid).toFixed(2);
      payAccount.currentBalance = Types.Decimal128.fromString(newBal) as any;
      await payAccount.save();
    }

    // 6. Update Party Balance & Record Financial Ledger Transactions
    if (party) {
      const curPartyBal = party.currentBalanceBDT.toString();
      // Purchase increases payable to customer (reduces balance) by total, payment increases balance
      const newPartyBal = DecimalMath.subtract(curPartyBal, due).toFixed(2);
      party.currentBalanceBDT = Types.Decimal128.fromString(newPartyBal) as any;
      await party.save();

      // Record transaction
      await this.transactionModel.create({
        voucherNo: purchaseNo,
        transactionType: 'PURCHASE_PAYMENT',
        partyId: party._id,
        partyName: party.name,
        sourceAccountId: payAccount?._id,
        amountBDT: Types.Decimal128.fromString(totalSettlement),
        relatedTransactionNo: purchaseNo,
        credit: Types.Decimal128.fromString(totalSettlement), // Payable credit
        debit: Types.Decimal128.fromString(paid), // Cash paid
        runningPartyBalance: Types.Decimal128.fromString(newPartyBal),
        currencyContext: purchasedCurr,
        foreignAmount: Types.Decimal128.fromString(dto.quantity),
        rate: Types.Decimal128.fromString(dto.purchaseRate),
        operatorId: dto.userId,
        notes: `Purchase ${dto.quantity} ${purchasedCurr} @ ${dto.purchaseRate} BDT. Paid: ${paid}, Due: ${due}`,
        date: dto.businessDate ? new Date(dto.businessDate) : new Date(),
      });
    }

    // 7. Save Purchase Record
    const purchase = new this.purchaseModel({
      purchaseNo,
      partyId: party?._id,
      supplierName: party?.name || dto.supplierName,
      purchasedCurrency: purchasedCurr,
      quantity: Types.Decimal128.fromString(dto.quantity),
      purchaseRate: Types.Decimal128.fromString(dto.purchaseRate),
      settlementCurrency: 'BDT',
      totalSettlementAmount: Types.Decimal128.fromString(totalSettlement),
      paidAmount: Types.Decimal128.fromString(paid),
      dueAmount: Types.Decimal128.fromString(due),
      paymentAccountId: payAccount?._id,
      paymentMethod: dto.paymentMethod || 'CASH',
      status: DecimalMath.greaterThan(due, '0') ? TradeStatus.APPROVED : TradeStatus.SETTLED,
      isReversed: false,
      notes: dto.notes,
      createdBy: Types.ObjectId.isValid(dto.userId) ? new Types.ObjectId(dto.userId) : undefined,
    });

    const saved = await purchase.save();
    this.logger.log(`Executed FX Purchase ${purchaseNo}: ${dto.quantity} ${purchasedCurr} @ ${dto.purchaseRate} BDT. New WAC: ${wacCalc.newWACRate}`);
    return saved;
  }

  /* ========================================================================== */
  /* 5. CURRENCY SALE (FOREIGN CURRENCY SELL TO BUYER / DEALER)                  */
  /* ========================================================================== */

  async executeSale(dto: ExecuteSaleDto): Promise<CurrencySale> {
    const soldCurr = dto.soldCurrency.toUpperCase();

    // 1. Check and validate available inventory stock
    const pool = await this.poolModel.findOne({ currencyCode: soldCurr });
    const currentQty = pool?.totalQuantity ? pool.totalQuantity.toString() : '0';

    if (DecimalMath.lessThan(currentQty, dto.quantity)) {
      throw new BadRequestException(
        `Insufficient stock for ${soldCurr}. Current Available Stock: ${currentQty}, Requested: ${dto.quantity}. Transaction prevented.`,
      );
    }

    // 2. Fetch current WAC rate for COGS calculation
    const currentWAC = pool?.weightedAverageCostRate ? pool.weightedAverageCostRate.toString() : dto.sellingRate;
    const profitCalc = DecimalMath.calculateSaleProfit(dto.quantity, dto.sellingRate, currentWAC);

    const grossProceeds = profitCalc.grossProceeds;
    const totalCostBasis = profitCalc.costBasis;
    const realizedFxGain = profitCalc.realizedGain;

    const received = dto.receivedAmount !== undefined ? DecimalMath.from(dto.receivedAmount).toFixed(2) : grossProceeds;
    const due = DecimalMath.subtract(grossProceeds, received).toFixed(2);

    // 3. Decrement Inventory Stock and Valuation
    const remainingQty = DecimalMath.subtract(currentQty, dto.quantity).toFixed(8);
    const newCarryingVal = DecimalMath.multiply(remainingQty, currentWAC).toFixed(8);

    if (pool) {
      pool.totalQuantity = Types.Decimal128.fromString(remainingQty) as any;
      pool.totalCostValuation = Types.Decimal128.fromString(newCarryingVal) as any;
      await pool.save();
    }

    // 4. Generate Sequential Sale Number
    const count = await this.saleModel.countDocuments();
    const saleNo = `FXS-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    // 5. Record Immutable Stock Movement
    await this.movementModel.create({
      movementNo: `STK-${saleNo}`,
      movementType: StockMovementType.SALE,
      currencyCode: soldCurr,
      openingQuantity: Types.Decimal128.fromString(currentQty),
      inflowQuantity: Types.Decimal128.fromString('0'),
      outflowQuantity: Types.Decimal128.fromString(dto.quantity),
      closingQuantity: Types.Decimal128.fromString(remainingQty),
      unitCostRate: Types.Decimal128.fromString(currentWAC),
      bdtValuation: Types.Decimal128.fromString(newCarryingVal),
      reference: saleNo,
      operatorId: dto.userId,
      memo: `Sold ${dto.quantity} ${soldCurr} @ ${dto.sellingRate} BDT (WAC Cost: ${currentWAC}). Profit: ${realizedFxGain} BDT`,
      timestamp: dto.businessDate ? new Date(dto.businessDate) : new Date(),
    });

    // 6. Update Cash / Bank Account (add received amount)
    let receiptAccount: FinancialAccountDocument | null = null;
    if (DecimalMath.greaterThan(received, '0')) {
      if (dto.receiptAccountId) {
        receiptAccount = await this.accountModel.findById(dto.receiptAccountId);
      }
      if (!receiptAccount) {
        receiptAccount = await this.accountModel.findOne({ accountType: FinancialAccountType.CASH_REGISTER, status: SystemStatus.ACTIVE });
        if (!receiptAccount) {
          receiptAccount = await this.accountModel.create({
            accountNo: 'CASH-001',
            accountName: 'Main Cash Register (Counter)',
            accountType: FinancialAccountType.CASH_REGISTER,
            currency: 'BDT',
            currentBalance: Types.Decimal128.fromString('1000000.00'),
            status: SystemStatus.ACTIVE,
          });
        }
      }

      const curBal = receiptAccount.currentBalance.toString();
      const newBal = DecimalMath.add(curBal, received).toFixed(2);
      receiptAccount.currentBalance = Types.Decimal128.fromString(newBal) as any;
      await receiptAccount.save();
    }

    // 7. Update Party (Buyer/Dealer) Balance & Record Ledger Transaction
    let party: PartyDocument | null = null;
    if (dto.partyId) {
      party = await this.partyModel.findById(dto.partyId);
    }
    if (!party && dto.customerName) {
      party = await this.partyModel.findOne({ name: dto.customerName.trim() });
      if (!party) {
        party = await this.createParty({
          name: dto.customerName.trim(),
          partyType: PartyType.DEALER,
          phone: '+880 1700-000000',
        });
      }
    }

    if (party) {
      const curPartyBal = party.currentBalanceBDT.toString();
      // Sale increases receivable from party (adds due amount to current balance)
      const newPartyBal = DecimalMath.add(curPartyBal, due).toFixed(2);
      party.currentBalanceBDT = Types.Decimal128.fromString(newPartyBal) as any;
      await party.save();

      await this.transactionModel.create({
        voucherNo: saleNo,
        transactionType: 'SALE_RECEIPT',
        partyId: party._id,
        partyName: party.name,
        destinationAccountId: receiptAccount?._id,
        amountBDT: Types.Decimal128.fromString(grossProceeds),
        relatedTransactionNo: saleNo,
        debit: Types.Decimal128.fromString(grossProceeds), // Total receivable from sale
        credit: Types.Decimal128.fromString(received), // Received in cash
        runningPartyBalance: Types.Decimal128.fromString(newPartyBal),
        currencyContext: soldCurr,
        foreignAmount: Types.Decimal128.fromString(dto.quantity),
        rate: Types.Decimal128.fromString(dto.sellingRate),
        operatorId: dto.userId,
        notes: `Sale ${dto.quantity} ${soldCurr} @ ${dto.sellingRate} BDT. Received: ${received}, Due: ${due}. Profit: ${realizedFxGain}`,
        date: dto.businessDate ? new Date(dto.businessDate) : new Date(),
      });
    }

    // 8. Save Sale Record
    const sale = new this.saleModel({
      saleNo,
      partyId: party?._id,
      customerName: party?.name || dto.customerName,
      soldCurrency: soldCurr,
      quantity: Types.Decimal128.fromString(dto.quantity),
      sellingRate: Types.Decimal128.fromString(dto.sellingRate),
      grossProceeds: Types.Decimal128.fromString(grossProceeds),
      costBasisRate: Types.Decimal128.fromString(currentWAC),
      totalCostBasis: Types.Decimal128.fromString(totalCostBasis),
      realizedFxGain: Types.Decimal128.fromString(realizedFxGain),
      receivedAmount: Types.Decimal128.fromString(received),
      dueAmount: Types.Decimal128.fromString(due),
      receiptAccountId: receiptAccount?._id,
      receiptMethod: dto.receiptMethod || 'CASH',
      status: DecimalMath.greaterThan(due, '0') ? TradeStatus.APPROVED : TradeStatus.SETTLED,
      isReversed: false,
      notes: dto.notes,
      createdBy: Types.ObjectId.isValid(dto.userId) ? new Types.ObjectId(dto.userId) : undefined,
    });

    const saved = await sale.save();
    this.logger.log(`Executed FX Sale ${saleNo}: ${dto.quantity} ${soldCurr} @ ${dto.sellingRate} BDT. Gross Profit: ${realizedFxGain} BDT`);
    return saved;
  }

  /* ========================================================================== */
  /* 6. SETTLEMENT PAYMENTS & RECEIPTS (CUSTOMER & BUYER)                       */
  /* ========================================================================== */

  async executeCustomerPayment(dto: CustomerPaymentDto) {
    const party = await this.getPartyById(dto.partyId);
    const payAmt = DecimalMath.from(dto.amountBDT).toFixed(2);

    // 1. Deduct Cash / Bank
    const account = await this.accountModel.findById(dto.paymentAccountId);
    if (!account) throw new BadRequestException('Selected payment account not found');
    const curAccBal = account.currentBalance.toString();
    account.currentBalance = Types.Decimal128.fromString(DecimalMath.subtract(curAccBal, payAmt).toFixed(2)) as any;
    await account.save();

    // 2. Reduce Customer Payable (adds to party balance towards 0)
    const curPartyBal = party.currentBalanceBDT.toString();
    const newPartyBal = DecimalMath.add(curPartyBal, payAmt).toFixed(2);
    party.currentBalanceBDT = Types.Decimal128.fromString(newPartyBal) as any;
    await party.save();

    // 3. Update Purchase due amount if linked
    if (dto.purchaseId) {
      const purchase = await this.purchaseModel.findById(dto.purchaseId);
      if (purchase) {
        const curPaid = purchase.paidAmount.toString();
        const curDue = purchase.dueAmount.toString();
        const newPaid = DecimalMath.add(curPaid, payAmt).toFixed(2);
        const newDue = DecimalMath.subtract(curDue, payAmt).toFixed(2);
        purchase.paidAmount = Types.Decimal128.fromString(newPaid) as any;
        purchase.dueAmount = Types.Decimal128.fromString(DecimalMath.greaterThan(newDue, '0') ? newDue : '0.00') as any;
        if (DecimalMath.lessThanOrEqualTo(newDue, '0')) {
          purchase.status = TradeStatus.SETTLED;
        }
        await purchase.save();
      }
    }

    // 4. Record Financial Transaction
    const count = await this.transactionModel.countDocuments();
    const voucherNo = `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const tx = await this.transactionModel.create({
      voucherNo,
      transactionType: 'CUSTOMER_PAYMENT',
      partyId: party._id,
      partyName: party.name,
      sourceAccountId: account._id,
      amountBDT: Types.Decimal128.fromString(payAmt),
      relatedTransactionNo: dto.purchaseId,
      debit: Types.Decimal128.fromString(payAmt), // Paid to customer
      credit: Types.Decimal128.fromString('0.00'),
      runningPartyBalance: Types.Decimal128.fromString(newPartyBal),
      operatorId: dto.userId,
      notes: dto.notes || `Payment of ${payAmt} BDT to ${party.name}`,
      date: new Date(),
    });

    return { success: true, voucherNo, newPartyBalance: newPartyBal, transaction: tx };
  }

  async executeBuyerReceipt(dto: BuyerReceiptDto) {
    const party = await this.getPartyById(dto.partyId);
    const recAmt = DecimalMath.from(dto.amountBDT).toFixed(2);

    // 1. Add to Cash / Bank
    const account = await this.accountModel.findById(dto.receiptAccountId);
    if (!account) throw new BadRequestException('Selected receipt account not found');
    const curAccBal = account.currentBalance.toString();
    account.currentBalance = Types.Decimal128.fromString(DecimalMath.add(curAccBal, recAmt).toFixed(2)) as any;
    await account.save();

    // 2. Reduce Dealer Receivable (deducts from party balance towards 0)
    const curPartyBal = party.currentBalanceBDT.toString();
    const newPartyBal = DecimalMath.subtract(curPartyBal, recAmt).toFixed(2);
    party.currentBalanceBDT = Types.Decimal128.fromString(newPartyBal) as any;
    await party.save();

    // 3. Update Sale due amount if linked
    if (dto.saleId) {
      const sale = await this.saleModel.findById(dto.saleId);
      if (sale) {
        const curRec = sale.receivedAmount.toString();
        const curDue = sale.dueAmount.toString();
        const newRec = DecimalMath.add(curRec, recAmt).toFixed(2);
        const newDue = DecimalMath.subtract(curDue, recAmt).toFixed(2);
        sale.receivedAmount = Types.Decimal128.fromString(newRec) as any;
        sale.dueAmount = Types.Decimal128.fromString(DecimalMath.greaterThan(newDue, '0') ? newDue : '0.00') as any;
        if (DecimalMath.lessThanOrEqualTo(newDue, '0')) {
          sale.status = TradeStatus.SETTLED;
        }
        await sale.save();
      }
    }

    // 4. Record Financial Transaction
    const count = await this.transactionModel.countDocuments();
    const voucherNo = `REC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const tx = await this.transactionModel.create({
      voucherNo,
      transactionType: 'BUYER_RECEIPT',
      partyId: party._id,
      partyName: party.name,
      destinationAccountId: account._id,
      amountBDT: Types.Decimal128.fromString(recAmt),
      relatedTransactionNo: dto.saleId,
      debit: Types.Decimal128.fromString('0.00'),
      credit: Types.Decimal128.fromString(recAmt), // Received from dealer
      runningPartyBalance: Types.Decimal128.fromString(newPartyBal),
      operatorId: dto.userId,
      notes: dto.notes || `Receipt of ${recAmt} BDT from ${party.name}`,
      date: new Date(),
    });

    return { success: true, voucherNo, newPartyBalance: newPartyBal, transaction: tx };
  }

  /* ========================================================================== */
  /* 7. TRANSACTION REVERSAL / CANCELLATION                                     */
  /* ========================================================================== */

  async reversePurchase(purchaseId: string, reason: string, userId: string) {
    const purchase = await this.purchaseModel.findById(purchaseId);
    if (!purchase) throw new NotFoundException('Purchase record not found');
    if (purchase.isReversed) throw new BadRequestException('Transaction is already reversed');

    const curr = purchase.purchasedCurrency;
    const qty = purchase.quantity.toString();
    const paid = purchase.paidAmount.toString();
    const due = purchase.dueAmount.toString();
    const total = purchase.totalSettlementAmount.toString();

    // 1. Verify stock availability to reverse purchase
    const pool = await this.poolModel.findOne({ currencyCode: curr });
    const curStock = pool?.totalQuantity ? pool.totalQuantity.toString() : '0';
    if (DecimalMath.lessThan(curStock, qty)) {
      throw new BadRequestException(
        `Cannot reverse purchase: Available stock of ${curr} (${curStock}) is less than purchase quantity (${qty}). Some currency has already been sold.`,
      );
    }

    // 2. Deduct returned currency stock from inventory
    const newQty = DecimalMath.subtract(curStock, qty).toFixed(8);
    const oldVal = pool?.totalCostValuation ? pool.totalCostValuation.toString() : '0';
    const costDeduction = DecimalMath.multiply(qty, purchase.purchaseRate.toString()).toFixed(8);
    const newVal = DecimalMath.greaterThan(oldVal, costDeduction) ? DecimalMath.subtract(oldVal, costDeduction).toFixed(8) : '0.00000000';
    const newWac = DecimalMath.greaterThan(newQty, '0') ? DecimalMath.divide(newVal, newQty).toFixed(12) : '0.000000000000';

    if (pool) {
      pool.totalQuantity = Types.Decimal128.fromString(newQty) as any;
      pool.weightedAverageCostRate = Types.Decimal128.fromString(newWac) as any;
      pool.totalCostValuation = Types.Decimal128.fromString(newVal) as any;
      await pool.save();
    }

    // 3. Record stock movement
    await this.movementModel.create({
      movementNo: `STK-REV-${purchase.purchaseNo}`,
      movementType: StockMovementType.REVERSAL_OUT,
      currencyCode: curr,
      openingQuantity: Types.Decimal128.fromString(curStock),
      inflowQuantity: Types.Decimal128.fromString('0'),
      outflowQuantity: Types.Decimal128.fromString(qty),
      closingQuantity: Types.Decimal128.fromString(newQty),
      unitCostRate: Types.Decimal128.fromString(newWac),
      bdtValuation: Types.Decimal128.fromString(newVal),
      reference: `REV:${purchase.purchaseNo}`,
      operatorId: userId,
      memo: `REVERSAL of purchase ${purchase.purchaseNo}: ${reason}`,
      timestamp: new Date(),
    });

    // 4. Return paid amount to cash/bank
    if (DecimalMath.greaterThan(paid, '0') && purchase.paymentAccountId) {
      const account = await this.accountModel.findById(purchase.paymentAccountId);
      if (account) {
        const curAcc = account.currentBalance.toString();
        account.currentBalance = Types.Decimal128.fromString(DecimalMath.add(curAcc, paid).toFixed(2)) as any;
        await account.save();
      }
    }

    // 5. Reverse party balance
    if (purchase.partyId) {
      const party = await this.partyModel.findById(purchase.partyId);
      if (party) {
        const curPartyBal = party.currentBalanceBDT.toString();
        const newPartyBal = DecimalMath.add(curPartyBal, due).toFixed(2);
        party.currentBalanceBDT = Types.Decimal128.fromString(newPartyBal) as any;
        await party.save();

        await this.transactionModel.create({
          voucherNo: `REV-${purchase.purchaseNo}`,
          transactionType: 'REVERSAL',
          partyId: party._id,
          partyName: party.name,
          amountBDT: Types.Decimal128.fromString(total),
          relatedTransactionNo: purchase.purchaseNo,
          debit: Types.Decimal128.fromString(total),
          credit: Types.Decimal128.fromString(paid),
          runningPartyBalance: Types.Decimal128.fromString(newPartyBal),
          currencyContext: curr,
          foreignAmount: Types.Decimal128.fromString(qty),
          operatorId: userId,
          notes: `REVERSAL of ${purchase.purchaseNo}: ${reason}`,
          date: new Date(),
        });
      }
    }

    // 6. Mark purchase reversed
    purchase.status = TradeStatus.REVERSED;
    purchase.isReversed = true;
    purchase.reversalReason = reason;
    purchase.reversedAt = new Date();
    await purchase.save();

    this.logger.log(`Reversed FX Purchase ${purchase.purchaseNo}. Reason: ${reason}`);
    return { success: true, message: `Purchase ${purchase.purchaseNo} reversed successfully.` };
  }

  async reverseSale(saleId: string, reason: string, userId: string) {
    const sale = await this.saleModel.findById(saleId);
    if (!sale) throw new NotFoundException('Sale record not found');
    if (sale.isReversed) throw new BadRequestException('Transaction is already reversed');

    const curr = sale.soldCurrency;
    const qty = sale.quantity.toString();
    const proceeds = sale.grossProceeds.toString();
    const received = sale.receivedAmount.toString();
    const due = sale.dueAmount.toString();
    const costBasis = sale.costBasisRate.toString();

    // 1. Restore sold stock to inventory pool
    const pool = await this.poolModel.findOne({ currencyCode: curr });
    const curStock = pool?.totalQuantity ? pool.totalQuantity.toString() : '0';
    const oldVal = pool?.totalCostValuation ? pool.totalCostValuation.toString() : '0';

    const restoredCalc = DecimalMath.calculateNewWAC(curStock, oldVal, qty, costBasis);
    if (pool) {
      pool.totalQuantity = Types.Decimal128.fromString(restoredCalc.newTotalQty) as any;
      pool.weightedAverageCostRate = Types.Decimal128.fromString(restoredCalc.newWACRate) as any;
      pool.totalCostValuation = Types.Decimal128.fromString(restoredCalc.newCarryingValue) as any;
      await pool.save();
    }

    // 2. Record stock movement
    await this.movementModel.create({
      movementNo: `STK-REV-${sale.saleNo}`,
      movementType: StockMovementType.REVERSAL_IN,
      currencyCode: curr,
      openingQuantity: Types.Decimal128.fromString(curStock),
      inflowQuantity: Types.Decimal128.fromString(qty),
      outflowQuantity: Types.Decimal128.fromString('0'),
      closingQuantity: Types.Decimal128.fromString(restoredCalc.newTotalQty),
      unitCostRate: Types.Decimal128.fromString(restoredCalc.newWACRate),
      bdtValuation: Types.Decimal128.fromString(restoredCalc.newCarryingValue),
      reference: `REV:${sale.saleNo}`,
      operatorId: userId,
      memo: `REVERSAL of sale ${sale.saleNo}: ${reason}`,
      timestamp: new Date(),
    });

    // 3. Deduct received amount back from cash/bank
    if (DecimalMath.greaterThan(received, '0') && sale.receiptAccountId) {
      const account = await this.accountModel.findById(sale.receiptAccountId);
      if (account) {
        const curAcc = account.currentBalance.toString();
        account.currentBalance = Types.Decimal128.fromString(DecimalMath.subtract(curAcc, received).toFixed(2)) as any;
        await account.save();
      }
    }

    // 4. Reverse party balance
    if (sale.partyId) {
      const party = await this.partyModel.findById(sale.partyId);
      if (party) {
        const curPartyBal = party.currentBalanceBDT.toString();
        const newPartyBal = DecimalMath.subtract(curPartyBal, due).toFixed(2);
        party.currentBalanceBDT = Types.Decimal128.fromString(newPartyBal) as any;
        await party.save();

        await this.transactionModel.create({
          voucherNo: `REV-${sale.saleNo}`,
          transactionType: 'REVERSAL',
          partyId: party._id,
          partyName: party.name,
          amountBDT: Types.Decimal128.fromString(proceeds),
          relatedTransactionNo: sale.saleNo,
          debit: Types.Decimal128.fromString(received),
          credit: Types.Decimal128.fromString(proceeds),
          runningPartyBalance: Types.Decimal128.fromString(newPartyBal),
          currencyContext: curr,
          foreignAmount: Types.Decimal128.fromString(qty),
          operatorId: userId,
          notes: `REVERSAL of ${sale.saleNo}: ${reason}`,
          date: new Date(),
        });
      }
    }

    // 5. Mark sale reversed
    sale.status = TradeStatus.REVERSED;
    sale.isReversed = true;
    sale.reversalReason = reason;
    sale.reversedAt = new Date();
    await sale.save();

    this.logger.log(`Reversed FX Sale ${sale.saleNo}. Reason: ${reason}`);
    return { success: true, message: `Sale ${sale.saleNo} reversed successfully.` };
  }

  /* ========================================================================== */
  /* 8. FINANCIAL ACCOUNTS & CASH/BANK MANAGEMENT                              */
  /* ========================================================================== */

  async getFinancialAccounts() {
    let list = await this.accountModel.find({ status: SystemStatus.ACTIVE });
    if (list.length === 0) {
      await this.seedInitialAccounts();
      list = await this.accountModel.find({ status: SystemStatus.ACTIVE });
    }
    return list;
  }

  async executeAccountTransfer(dto: AccountTransferDto) {
    if (dto.sourceAccountId === dto.destinationAccountId) {
      throw new BadRequestException('Source and destination accounts must be distinct');
    }

    const source = await this.accountModel.findById(dto.sourceAccountId);
    const dest = await this.accountModel.findById(dto.destinationAccountId);

    if (!source || !dest) throw new BadRequestException('Accounts not found');
    const amt = DecimalMath.from(dto.amountBDT).toFixed(2);

    const srcBal = source.currentBalance.toString();
    if (DecimalMath.lessThan(srcBal, amt)) {
      throw new BadRequestException(`Insufficient funds in source account ${source.accountName}. Available: ${srcBal} BDT`);
    }

    // Update balances
    source.currentBalance = Types.Decimal128.fromString(DecimalMath.subtract(srcBal, amt).toFixed(2)) as any;
    dest.currentBalance = Types.Decimal128.fromString(DecimalMath.add(dest.currentBalance.toString(), amt).toFixed(2)) as any;

    await source.save();
    await dest.save();

    const count = await this.transactionModel.countDocuments();
    const voucherNo = `TRF-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    await this.transactionModel.create({
      voucherNo,
      transactionType: 'TRANSFER',
      sourceAccountId: source._id,
      destinationAccountId: dest._id,
      amountBDT: Types.Decimal128.fromString(amt),
      operatorId: dto.userId,
      notes: dto.notes || `Inter-account transfer from ${source.accountName} to ${dest.accountName}`,
      date: new Date(),
    });

    return { success: true, voucherNo, sourceBalance: source.currentBalance.toString(), destBalance: dest.currentBalance.toString() };
  }

  /* ========================================================================== */
  /* 9. BUSINESS EXPENSES                                                       */
  /* ========================================================================== */

  async recordExpense(dto: RecordExpenseDto) {
    const account = await this.accountModel.findById(dto.paymentAccountId);
    if (!account) throw new BadRequestException('Payment account not found');

    const amt = DecimalMath.from(dto.amountBDT).toFixed(2);
    const curBal = account.currentBalance.toString();

    // Deduct from account
    account.currentBalance = Types.Decimal128.fromString(DecimalMath.subtract(curBal, amt).toFixed(2)) as any;
    await account.save();

    const count = await this.expenseModel.countDocuments();
    const expenseNo = `EXP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const expense = await this.expenseModel.create({
      expenseNo,
      date: dto.date ? new Date(dto.date) : new Date(),
      category: dto.category,
      description: dto.description,
      amountBDT: Types.Decimal128.fromString(amt),
      paymentAccountId: account._id,
      paymentAccountName: account.accountName,
      paidTo: dto.paidTo,
      operatorId: dto.userId,
      notes: dto.notes,
      status: 'PAID',
    });

    // Record in financial transaction ledger
    await this.transactionModel.create({
      voucherNo: expenseNo,
      transactionType: 'EXPENSE',
      sourceAccountId: account._id,
      amountBDT: Types.Decimal128.fromString(amt),
      operatorId: dto.userId,
      notes: `Expense [${dto.category}]: ${dto.description}`,
      date: expense.date,
    });

    return expense;
  }

  async getExpenses(fromDate?: string, toDate?: string, category?: string) {
    const filter: any = {};
    if (category) filter.category = category;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate + 'T23:59:59.999Z');
    }
    return this.expenseModel.find(filter).sort({ date: -1 });
  }

  /* ========================================================================== */
  /* 10. DAILY CLOSING & RECONCILIATION                                         */
  /* ========================================================================== */

  async getDailyClosingStatus(dateStr: string) {
    const closing = await this.closingModel.findOne({ closingDate: dateStr });
    if (closing) {
      return { isClosed: true, closing };
    }

    // Aggregate expected amounts for the date
    const dStart = new Date(dateStr + 'T00:00:00.000Z');
    const dEnd = new Date(dateStr + 'T23:59:59.999Z');

    const purchases = await this.purchaseModel.find({
      createdAt: { $gte: dStart, $lte: dEnd },
      status: { $ne: TradeStatus.REVERSED },
    });
    const totalPurchaseBDT = purchases.reduce((acc, p) => DecimalMath.add(acc, p.totalSettlementAmount.toString()).toFixed(2), '0.00');

    const sales = await this.saleModel.find({
      createdAt: { $gte: dStart, $lte: dEnd },
      status: { $ne: TradeStatus.REVERSED },
    });
    const totalSalesBDT = sales.reduce((acc, s) => DecimalMath.add(acc, s.grossProceeds.toString()).toFixed(2), '0.00');
    const grossProfitBDT = sales.reduce((acc, s) => DecimalMath.add(acc, s.realizedFxGain.toString()).toFixed(2), '0.00');

    const expenses = await this.expenseModel.find({
      date: { $gte: dStart, $lte: dEnd },
      status: 'PAID',
    });
    const totalExpensesBDT = expenses.reduce((acc, e) => DecimalMath.add(acc, e.amountBDT.toString()).toFixed(2), '0.00');
    const netProfitBDT = DecimalMath.subtract(grossProfitBDT, totalExpensesBDT).toFixed(2);

    const cashAccount = await this.accountModel.findOne({ accountType: FinancialAccountType.CASH_REGISTER });
    const expectedCash = cashAccount ? cashAccount.currentBalance.toString() : '0.00';

    const stockSummary = await this.getStockSummary();

    return {
      isClosed: false,
      date: dateStr,
      totalPurchaseBDT,
      totalSalesBDT,
      grossProfitBDT,
      totalExpensesBDT,
      netProfitBDT,
      expectedCash,
      currencyStocks: stockSummary,
    };
  }

  async performDailyClosing(dto: DailyClosingDto) {
    const existing = await this.closingModel.findOne({ closingDate: dto.closingDate });
    if (existing && existing.isClosed) {
      throw new BadRequestException(`Business day ${dto.closingDate} has already been closed.`);
    }

    const preview = await this.getDailyClosingStatus(dto.closingDate);
    const expectedCash = (preview as any).expectedCash || '0.00';
    const totalPurchaseBDT = (preview as any).totalPurchaseBDT || '0.00';
    const totalSalesBDT = (preview as any).totalSalesBDT || '0.00';
    const grossProfitBDT = (preview as any).grossProfitBDT || '0.00';
    const totalExpensesBDT = (preview as any).totalExpensesBDT || '0.00';
    const netProfitBDT = (preview as any).netProfitBDT || '0.00';
    const currencyStocks = (preview as any).currencyStocks || [];
    const cashDiff = DecimalMath.subtract(dto.actualCashCounted, expectedCash).toFixed(2);

    const stockSummaryItems = currencyStocks.map((curr: any) => {
      const reported = dto.currencyStockCounts?.find((c) => c.currencyCode === curr.code);
      const actual = reported ? reported.actualStock : curr.stockQuantity;
      const diff = DecimalMath.subtract(actual, curr.stockQuantity).toFixed(2);

      return {
        currencyCode: curr.code,
        systemStock: Types.Decimal128.fromString(curr.stockQuantity),
        actualStock: Types.Decimal128.fromString(actual),
        difference: Types.Decimal128.fromString(diff),
        averageCost: Types.Decimal128.fromString(curr.averageCostRateBDT),
      };
    });

    const closing = await this.closingModel.create({
      closingDate: dto.closingDate,
      totalPurchaseBDT: Types.Decimal128.fromString(totalPurchaseBDT),
      totalSalesBDT: Types.Decimal128.fromString(totalSalesBDT),
      grossProfitBDT: Types.Decimal128.fromString(grossProfitBDT),
      totalExpensesBDT: Types.Decimal128.fromString(totalExpensesBDT),
      netProfitBDT: Types.Decimal128.fromString(netProfitBDT),
      systemExpectedCash: Types.Decimal128.fromString(expectedCash),
      actualCashCounted: Types.Decimal128.fromString(dto.actualCashCounted),
      cashDifference: Types.Decimal128.fromString(cashDiff),
      currencyStockSummary: stockSummaryItems,
      differenceReasons: dto.differenceReasons,
      isClosed: true,
      closedBy: dto.userId,
      closedAt: new Date(),
    });

    this.logger.log(`Completed Daily Closing for ${dto.closingDate}. Net Profit: ${preview.netProfitBDT} BDT. Cash Diff: ${cashDiff}`);
    return closing;
  }

  /* ========================================================================== */
  /* 11. REPORTS & FINANCIAL DASHBOARD AGGREGATIONS                             */
  /* ========================================================================== */

  async getDashboardMetrics() {
    // 1. Cash and Bank Balances
    const accounts = await this.getFinancialAccounts();
    const totalCash = accounts
      .filter((a) => a.accountType === FinancialAccountType.CASH_REGISTER || a.accountType === FinancialAccountType.VAULT)
      .reduce((sum, a) => DecimalMath.add(sum, a.currentBalance.toString()).toFixed(2), '0.00');

    const totalBank = accounts
      .filter((a) => a.accountType === FinancialAccountType.BANK_ACCOUNT)
      .reduce((sum, a) => DecimalMath.add(sum, a.currentBalance.toString()).toFixed(2), '0.00');

    // 2. Today's figures
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayPurchases = await this.purchaseModel.find({
      createdAt: { $gte: startOfDay },
      status: { $ne: TradeStatus.REVERSED },
    });
    const todayPurchaseBDT = todayPurchases.reduce((sum, p) => DecimalMath.add(sum, p.totalSettlementAmount.toString()).toFixed(2), '0.00');

    const todaySales = await this.saleModel.find({
      createdAt: { $gte: startOfDay },
      status: { $ne: TradeStatus.REVERSED },
    });
    const todaySalesBDT = todaySales.reduce((sum, s) => DecimalMath.add(sum, s.grossProceeds.toString()).toFixed(2), '0.00');
    const todayGrossProfit = todaySales.reduce((sum, s) => DecimalMath.add(sum, s.realizedFxGain.toString()).toFixed(2), '0.00');

    const todayExpenses = await this.expenseModel.find({
      date: { $gte: startOfDay },
      status: 'PAID',
    });
    const todayExpenseBDT = todayExpenses.reduce((sum, e) => DecimalMath.add(sum, e.amountBDT.toString()).toFixed(2), '0.00');
    const todayNetProfit = DecimalMath.subtract(todayGrossProfit, todayExpenseBDT).toFixed(2);

    // 3. Total Payables and Receivables
    const parties = await this.partyModel.find({ status: SystemStatus.ACTIVE });
    let totalReceivable = '0.00';
    let totalPayable = '0.00';

    parties.forEach((p) => {
      const bal = p.currentBalanceBDT.toString();
      if (DecimalMath.greaterThan(bal, '0')) {
        totalReceivable = DecimalMath.add(totalReceivable, bal).toFixed(2);
      } else if (DecimalMath.lessThan(bal, '0')) {
        totalPayable = DecimalMath.add(totalPayable, DecimalMath.from(bal).abs().toString()).toFixed(2);
      }
    });

    // 4. Stock valuation
    const stockSummary = await this.getStockSummary();
    const totalStockValuationBDT = stockSummary.reduce((sum, s) => DecimalMath.add(sum, s.totalValuationBDT).toFixed(2), '0.00');

    return {
      totalCashBDT: totalCash,
      totalBankBDT: totalBank,
      totalStockValuationBDT,
      todayPurchaseBDT,
      todaySalesBDT,
      todayGrossProfitBDT: todayGrossProfit,
      todayExpenseBDT,
      todayNetProfitBDT: todayNetProfit,
      totalReceivableBDT: totalReceivable,
      totalPayableBDT: totalPayable,
      currencies: stockSummary,
    };
  }

  async getPurchasesReport(fromDate?: string, toDate?: string, currency?: string) {
    const filter: any = {};
    if (currency) filter.purchasedCurrency = currency.toUpperCase();
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate + 'T23:59:59.999Z');
    }
    return this.purchaseModel.find(filter).sort({ createdAt: -1 });
  }

  async getSalesReport(fromDate?: string, toDate?: string, currency?: string) {
    const filter: any = {};
    if (currency) filter.soldCurrency = currency.toUpperCase();
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate + 'T23:59:59.999Z');
    }
    return this.saleModel.find(filter).sort({ createdAt: -1 });
  }

  /* ========================================================================== */
  /* 12. SEED INITIAL CURRENCIES & ACCOUNTS                                      */
  /* ========================================================================== */

  private async seedInitialCurrencies() {
    const initial = [
      { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', decimalPlaces: 2, isFiat: true },
      { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimalPlaces: 2, isFiat: true },
      { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2, isFiat: true },
      { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', decimalPlaces: 2, isFiat: true },
      { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimalPlaces: 2, isFiat: true },
      { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2, isFiat: true },
      { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2, isFiat: true },
      { code: 'AED', name: 'UAE Dirham', symbol: 'AED', decimalPlaces: 2, isFiat: true },
    ];

    for (const c of initial) {
      await this.currencyModel.findOneAndUpdate(
        { code: c.code },
        { ...c, status: SystemStatus.ACTIVE },
        { upsert: true, new: true }
      );
    }
  }

  private async seedInitialAccounts() {
    const initial = [
      { accountNo: 'CASH-001', accountName: 'Cash Counter Register (Front Desk)', accountType: FinancialAccountType.CASH_REGISTER, currency: 'BDT', currentBalance: Types.Decimal128.fromString('1500000.00') },
      { accountNo: 'VAULT-001', accountName: 'Main Vault (Head Office BDT)', accountType: FinancialAccountType.VAULT, currency: 'BDT', currentBalance: Types.Decimal128.fromString('5000000.00') },
      { accountNo: 'BANK-001', accountName: 'Islami Bank Bangladesh PLC (A/C: 20501180293)', bankName: 'Islami Bank Bangladesh PLC', branchName: 'Motijheel Corporate', accountType: FinancialAccountType.BANK_ACCOUNT, currency: 'BDT', currentBalance: Types.Decimal128.fromString('8500000.00') },
      { accountNo: 'BANK-002', accountName: 'Dutch-Bangla Bank PLC (A/C: 1151039842)', bankName: 'Dutch-Bangla Bank PLC', branchName: 'Gulshan Corporate', accountType: FinancialAccountType.BANK_ACCOUNT, currency: 'BDT', currentBalance: Types.Decimal128.fromString('4200000.00') },
    ];

    for (const acc of initial) {
      await this.accountModel.findOneAndUpdate(
        { accountNo: acc.accountNo },
        { ...acc, status: SystemStatus.ACTIVE },
        { upsert: true, new: true }
      );
    }
  }

  async seedInitialRates() {
    const count = await this.rateModel.countDocuments();
    if (count > 0) return;

    const pairs = [
      { pairSymbol: 'MYR/BDT', baseCurrency: 'MYR', quoteCurrency: 'BDT', buyRate: '33.00', sellRate: '35.00', midRate: '34.00', spread: '2.00' },
      { pairSymbol: 'USD/BDT', baseCurrency: 'USD', quoteCurrency: 'BDT', buyRate: '119.50', sellRate: '121.20', midRate: '120.35', spread: '1.70' },
      { pairSymbol: 'SAR/BDT', baseCurrency: 'SAR', quoteCurrency: 'BDT', buyRate: '31.50', sellRate: '32.80', midRate: '32.15', spread: '1.30' },
      { pairSymbol: 'SGD/BDT', baseCurrency: 'SGD', quoteCurrency: 'BDT', buyRate: '90.00', sellRate: '92.50', midRate: '91.25', spread: '2.50' },
      { pairSymbol: 'EUR/BDT', baseCurrency: 'EUR', quoteCurrency: 'BDT', buyRate: '130.50', sellRate: '132.50', midRate: '131.50', spread: '2.00' },
      { pairSymbol: 'GBP/BDT', baseCurrency: 'GBP', quoteCurrency: 'BDT', buyRate: '153.00', sellRate: '156.00', midRate: '154.50', spread: '3.00' },
    ];

    for (const p of pairs) {
      await this.rateModel.create({
        pairSymbol: p.pairSymbol,
        baseCurrency: p.baseCurrency,
        quoteCurrency: p.quoteCurrency,
        buyRate: Types.Decimal128.fromString(p.buyRate),
        sellRate: Types.Decimal128.fromString(p.sellRate),
        midRate: Types.Decimal128.fromString(p.midRate),
        spread: Types.Decimal128.fromString(p.spread),
        effectiveFrom: new Date(),
        version: 1,
        status: 'ACTIVE',
      });
    }
  }
}
