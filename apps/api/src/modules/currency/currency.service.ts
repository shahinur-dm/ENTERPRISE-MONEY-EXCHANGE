import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DecimalMath } from '@erp/shared';
import { TradeStatus } from '@erp/types';
import { Currency, CurrencyDocument } from './schemas/currency.schema';
import { ExchangeRate, ExchangeRateDocument } from './schemas/exchange-rate.schema';
import { CurrencyCostPool, CurrencyCostPoolDocument } from './schemas/currency-cost-pool.schema';
import { CurrencyPurchase, CurrencyPurchaseDocument } from './schemas/currency-purchase.schema';
import { CurrencySale, CurrencySaleDocument } from './schemas/currency-sale.schema';
import { AccountingService } from '../accounting/accounting.service';

export interface ExecutePurchaseDto {
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  supplierName: string;
  purchasedCurrency: string;
  quantity: string;
  purchaseRate: string;
  settlementCurrency: string;
  paidAmount: string;
  userId: string;
}

export interface ExecuteSaleDto {
  organizationId: string;
  legalEntityId: string;
  branchId: string;
  customerName: string;
  soldCurrency: string;
  quantity: string;
  sellingRate: string;
  receivedAmount: string;
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
    private readonly accountingService: AccountingService,
  ) {}

  /**
   * Get active exchange rates
   */
  async getExchangeRates() {
    return this.rateModel.find({ status: 'ACTIVE' }).sort({ pairSymbol: 1 });
  }

  /**
   * Execute foreign currency purchase, update inventory WAC, and post journal entry
   */
  async executePurchase(dto: ExecutePurchaseDto): Promise<CurrencyPurchase> {
    const totalSettlement = DecimalMath.multiply(dto.quantity, dto.purchaseRate).toString();
    const paid = dto.paidAmount || totalSettlement;
    const due = DecimalMath.subtract(totalSettlement, paid).toString();

    // 1. Update or create Currency Cost Pool and recalculate Weighted Average Cost (WAC)
    let pool = await this.poolModel.findOne({
      legalEntityId: new Types.ObjectId(dto.legalEntityId),
      branchId: new Types.ObjectId(dto.branchId),
      currencyCode: dto.purchasedCurrency.toUpperCase(),
    });

    if (!pool) {
      pool = new this.poolModel({
        legalEntityId: new Types.ObjectId(dto.legalEntityId),
        branchId: new Types.ObjectId(dto.branchId),
        currencyCode: dto.purchasedCurrency.toUpperCase(),
        totalQuantity: Types.Decimal128.fromString('0'),
        weightedAverageCostRate: Types.Decimal128.fromString('0'),
        totalCostValuation: Types.Decimal128.fromString('0'),
      });
    }

    const existingQty = pool.totalQuantity ? pool.totalQuantity.toString() : '0';
    const existingValuation = pool.totalCostValuation ? pool.totalCostValuation.toString() : '0';

    // Apply strict PRD Section 13 WAC Formula
    const wacResult = DecimalMath.calculateNewWAC(
      existingQty,
      existingValuation,
      dto.quantity,
      dto.purchaseRate,
    );

    pool.totalQuantity = Types.Decimal128.fromString(wacResult.newTotalQty) as any;
    pool.weightedAverageCostRate = Types.Decimal128.fromString(wacResult.newWACRate) as any;
    pool.totalCostValuation = Types.Decimal128.fromString(wacResult.newCarryingValue) as any;
    await pool.save();

    // 2. Post balancing Double-Entry Journal Entry
    const coas = await this.accountingService.getChartOfAccounts(dto.legalEntityId);
    const inventoryCoa = coas.find((c) => c.code === '1020') || coas[0];
    const cashCoa = coas.find((c) => c.code === '1010') || coas[0];
    const payableCoa = coas.find((c) => c.code === '2010') || coas[0];

    const journalLines = [
      {
        coaId: (inventoryCoa as any)._id.toString(),
        coaCode: inventoryCoa.code,
        coaName: inventoryCoa.name,
        currency: dto.settlementCurrency,
        nativeAmount: dto.quantity,
        exchangeRate: dto.purchaseRate,
        debit: totalSettlement,
        credit: '0',
        memo: `FX Purchase: ${dto.quantity} ${dto.purchasedCurrency} @ ${dto.purchaseRate}`,
      },
      {
        coaId: (cashCoa as any)._id.toString(),
        coaCode: cashCoa.code,
        coaName: cashCoa.name,
        currency: dto.settlementCurrency,
        nativeAmount: paid,
        exchangeRate: '1',
        debit: '0',
        credit: paid,
        memo: `Settlement payment to ${dto.supplierName}`,
      },
    ];

    if (DecimalMath.greaterThan(due, '0')) {
      journalLines.push({
        coaId: (payableCoa as any)._id.toString(),
        coaCode: payableCoa.code,
        coaName: payableCoa.name,
        currency: dto.settlementCurrency,
        nativeAmount: due,
        exchangeRate: '1',
        debit: '0',
        credit: due,
        memo: `Accounts Payable due to ${dto.supplierName}`,
      });
    }

    const journal = await this.accountingService.postJournalEntry({
      organizationId: dto.organizationId,
      legalEntityId: dto.legalEntityId,
      branchId: dto.branchId,
      businessDate: new Date().toISOString().split('T')[0],
      sourceModule: 'FX_PURCHASE',
      narration: `Wholesale FX Purchase: ${dto.quantity} ${dto.purchasedCurrency} from ${dto.supplierName}`,
      functionalCurrency: dto.settlementCurrency,
      postedBy: dto.userId,
      lines: journalLines,
    });

    // 3. Save Currency Purchase Record
    const count = await this.purchaseModel.countDocuments();
    const purchaseNo = `FXP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    const purchase = new this.purchaseModel({
      purchaseNo,
      organizationId: new Types.ObjectId(dto.organizationId),
      legalEntityId: new Types.ObjectId(dto.legalEntityId),
      branchId: new Types.ObjectId(dto.branchId),
      supplierName: dto.supplierName,
      purchasedCurrency: dto.purchasedCurrency.toUpperCase(),
      quantity: Types.Decimal128.fromString(dto.quantity),
      purchaseRate: Types.Decimal128.fromString(dto.purchaseRate),
      settlementCurrency: dto.settlementCurrency.toUpperCase(),
      totalSettlementAmount: Types.Decimal128.fromString(totalSettlement),
      paidAmount: Types.Decimal128.fromString(paid),
      dueAmount: Types.Decimal128.fromString(due),
      journalId: (journal as any)._id,
      status: TradeStatus.SETTLED,
      createdBy: new Types.ObjectId(dto.userId),
    });

    const saved = await purchase.save();
    this.logger.log(`Executed FX Purchase ${purchaseNo}: ${dto.quantity} ${dto.purchasedCurrency} @ ${dto.purchaseRate}. New WAC: ${wacResult.newWACRate}`);
    return saved;
  }

  /**
   * Execute foreign currency sale, cost COGS via WAC, recognize realized profit, post journal
   */
  async executeSale(dto: ExecuteSaleDto): Promise<CurrencySale> {
    // 1. Verify available inventory stock
    const pool = await this.poolModel.findOne({
      legalEntityId: new Types.ObjectId(dto.legalEntityId),
      branchId: new Types.ObjectId(dto.branchId),
      currencyCode: dto.soldCurrency.toUpperCase(),
    });

    const currentQty = pool?.totalQuantity ? pool.totalQuantity.toString() : '0';
    if (DecimalMath.lessThan(currentQty, dto.quantity)) {
      throw new BadRequestException(
        `Insufficient inventory for ${dto.soldCurrency}. Available: ${currentQty}, Requested: ${dto.quantity}`,
      );
    }

    const wacRate = pool?.weightedAverageCostRate ? pool.weightedAverageCostRate.toString() : dto.sellingRate;
    const grossProceeds = DecimalMath.multiply(dto.quantity, dto.sellingRate).toString();
    const totalCostBasis = DecimalMath.multiply(dto.quantity, wacRate).toString();
    const realizedFxGain = DecimalMath.subtract(grossProceeds, totalCostBasis).toString();

    const received = dto.receivedAmount || grossProceeds;
    const due = DecimalMath.subtract(grossProceeds, received).toString();

    // Decrement inventory quantity
    const remainingQty = DecimalMath.subtract(currentQty, dto.quantity).toString();
    const newValuation = DecimalMath.multiply(remainingQty, wacRate).toString();
    if (pool) {
      pool.totalQuantity = Types.Decimal128.fromString(remainingQty) as any;
      pool.totalCostValuation = Types.Decimal128.fromString(newValuation) as any;
      await pool.save();
    }

    // 2. Post balancing Double-Entry Journal Entry
    const coas = await this.accountingService.getChartOfAccounts(dto.legalEntityId);
    const cashCoa = coas.find((c) => c.code === '1010') || coas[0];
    const inventoryCoa = coas.find((c) => c.code === '1020') || coas[0];
    const revenueCoa = coas.find((c) => c.code === '4010') || coas[0];
    const receivableCoa = coas.find((c) => c.code === '1050') || coas[0];

    const journalLines = [
      {
        coaId: (cashCoa as any)._id.toString(),
        coaCode: cashCoa.code,
        coaName: cashCoa.name,
        currency: 'MYR',
        nativeAmount: received,
        exchangeRate: '1',
        debit: received,
        credit: '0',
        memo: `Collection from ${dto.customerName}`,
      },
      {
        coaId: (inventoryCoa as any)._id.toString(),
        coaCode: inventoryCoa.code,
        coaName: inventoryCoa.name,
        currency: 'MYR',
        nativeAmount: dto.quantity,
        exchangeRate: wacRate,
        debit: '0',
        credit: totalCostBasis,
        memo: `Inventory reduction for ${dto.quantity} ${dto.soldCurrency} @ WAC ${wacRate}`,
      },
      {
        coaId: (revenueCoa as any)._id.toString(),
        coaCode: revenueCoa.code,
        coaName: revenueCoa.name,
        currency: 'MYR',
        nativeAmount: realizedFxGain,
        exchangeRate: '1',
        debit: '0',
        credit: realizedFxGain,
        memo: `Realized FX Trading Gain on sale of ${dto.soldCurrency}`,
      },
    ];

    if (DecimalMath.greaterThan(due, '0')) {
      journalLines.push({
        coaId: (receivableCoa as any)._id.toString(),
        coaCode: receivableCoa.code,
        coaName: receivableCoa.name,
        currency: 'MYR',
        nativeAmount: due,
        exchangeRate: '1',
        debit: due,
        credit: '0',
        memo: `Customer Receivable from ${dto.customerName}`,
      });
    }

    const journal = await this.accountingService.postJournalEntry({
      organizationId: dto.organizationId,
      legalEntityId: dto.legalEntityId,
      branchId: dto.branchId,
      businessDate: new Date().toISOString().split('T')[0],
      sourceModule: 'FX_SALE',
      narration: `FX Sale: ${dto.quantity} ${dto.soldCurrency} to ${dto.customerName} @ ${dto.sellingRate}`,
      functionalCurrency: 'MYR',
      postedBy: dto.userId,
      lines: journalLines,
    });

    // 3. Save Currency Sale Record
    const count = await this.saleModel.countDocuments();
    const saleNo = `FXS-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    const sale = new this.saleModel({
      saleNo,
      organizationId: new Types.ObjectId(dto.organizationId),
      legalEntityId: new Types.ObjectId(dto.legalEntityId),
      branchId: new Types.ObjectId(dto.branchId),
      customerName: dto.customerName,
      soldCurrency: dto.soldCurrency.toUpperCase(),
      quantity: Types.Decimal128.fromString(dto.quantity),
      sellingRate: Types.Decimal128.fromString(dto.sellingRate),
      grossProceeds: Types.Decimal128.fromString(grossProceeds),
      costBasisRate: Types.Decimal128.fromString(wacRate),
      totalCostBasis: Types.Decimal128.fromString(totalCostBasis),
      realizedFxGain: Types.Decimal128.fromString(realizedFxGain),
      receivedAmount: Types.Decimal128.fromString(received),
      dueAmount: Types.Decimal128.fromString(due),
      journalId: (journal as any)._id,
      status: TradeStatus.SETTLED,
      createdBy: new Types.ObjectId(dto.userId),
    });

    const saved = await sale.save();
    this.logger.log(`Executed FX Sale ${saleNo}: ${dto.quantity} ${dto.soldCurrency}. Realized Profit: ${realizedFxGain} MYR`);
    return saved;
  }

  /**
   * Seed standard exchange rates for all 8 supported currencies
   */
  async seedInitialRates() {
    const existing = await this.rateModel.countDocuments();
    if (existing > 0) return;

    const pairs = [
      { pairSymbol: 'MYR/BDT', baseCurrency: 'MYR', quoteCurrency: 'BDT', buyRate: '33.00', sellRate: '35.00', midRate: '34.00', spread: '2.00' },
      { pairSymbol: 'USD/BDT', baseCurrency: 'USD', quoteCurrency: 'BDT', buyRate: '119.50', sellRate: '121.20', midRate: '120.35', spread: '1.70' },
      { pairSymbol: 'EUR/BDT', baseCurrency: 'EUR', quoteCurrency: 'BDT', buyRate: '130.50', sellRate: '132.50', midRate: '131.50', spread: '2.00' },
      { pairSymbol: 'GBP/BDT', baseCurrency: 'GBP', quoteCurrency: 'BDT', buyRate: '153.00', sellRate: '156.00', midRate: '154.50', spread: '3.00' },
      { pairSymbol: 'SGD/BDT', baseCurrency: 'SGD', quoteCurrency: 'BDT', buyRate: '90.00', sellRate: '92.50', midRate: '91.25', spread: '2.50' },
      { pairSymbol: 'SAR/BDT', baseCurrency: 'SAR', quoteCurrency: 'BDT', buyRate: '31.50', sellRate: '32.80', midRate: '32.15', spread: '1.30' },
      { pairSymbol: 'AED/BDT', baseCurrency: 'AED', quoteCurrency: 'BDT', buyRate: '32.00', sellRate: '33.30', midRate: '32.65', spread: '1.30' },
      { pairSymbol: 'EUR/USD', baseCurrency: 'EUR', quoteCurrency: 'USD', buyRate: '1.085', sellRate: '1.095', midRate: '1.090', spread: '0.010' },
      { pairSymbol: 'EUR/GBP', baseCurrency: 'EUR', quoteCurrency: 'GBP', buyRate: '0.835', sellRate: '0.842', midRate: '0.839', spread: '0.007' },
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

    this.logger.log('Seeded standard exchange rates for all initial corridor pairs.');
  }
}
