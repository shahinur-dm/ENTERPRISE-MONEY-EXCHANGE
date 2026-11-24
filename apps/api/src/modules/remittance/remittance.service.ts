import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DecimalMath } from '@erp/shared';
import { RemittanceStatus } from '@erp/types';
import { Remittance, RemittanceDocument } from './schemas/remittance.schema';
import { AccountingService } from '../accounting/accounting.service';

export interface CreateRemittanceDto {
  organizationId: string;
  sourceEntityId: string;
  sourceBranchId: string;
  destinationEntityId: string;
  senderName: string;
  senderPhone: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryBank: string;
  sourceCurrency: string;
  sourceAmount: string;
  exchangeRate: string;
  destinationCurrency: string;
  serviceFee?: string;
  providerCharge?: string;
  userId: string;
}

// Valid transition graph for 16-state machine
const VALID_TRANSITIONS: Record<RemittanceStatus, RemittanceStatus[]> = {
  [RemittanceStatus.DRAFT]: [RemittanceStatus.PENDING_COLLECTION, RemittanceStatus.CANCELLED],
  [RemittanceStatus.PENDING_COLLECTION]: [RemittanceStatus.COLLECTED, RemittanceStatus.CANCELLED],
  [RemittanceStatus.COLLECTED]: [RemittanceStatus.COMPLIANCE_REVIEW, RemittanceStatus.REFUNDED],
  [RemittanceStatus.COMPLIANCE_REVIEW]: [RemittanceStatus.APPROVED, RemittanceStatus.ON_HOLD, RemittanceStatus.REJECTED],
  [RemittanceStatus.APPROVED]: [RemittanceStatus.ASSIGNED, RemittanceStatus.PROCESSING, RemittanceStatus.ON_HOLD],
  [RemittanceStatus.ASSIGNED]: [RemittanceStatus.PROCESSING, RemittanceStatus.ON_HOLD],
  [RemittanceStatus.PROCESSING]: [RemittanceStatus.PARTIALLY_PAID, RemittanceStatus.PAID, RemittanceStatus.ON_HOLD],
  [RemittanceStatus.PARTIALLY_PAID]: [RemittanceStatus.PAID, RemittanceStatus.ON_HOLD],
  [RemittanceStatus.PAID]: [RemittanceStatus.RECONCILED],
  [RemittanceStatus.RECONCILED]: [RemittanceStatus.COMPLETED],
  [RemittanceStatus.COMPLETED]: [RemittanceStatus.REVERSED],
  [RemittanceStatus.ON_HOLD]: [RemittanceStatus.APPROVED, RemittanceStatus.REJECTED, RemittanceStatus.REFUNDED],
  [RemittanceStatus.REJECTED]: [RemittanceStatus.REFUNDED],
  [RemittanceStatus.CANCELLED]: [],
  [RemittanceStatus.REFUNDED]: [],
  [RemittanceStatus.REVERSED]: [],
};

@Injectable()
export class RemittanceService {
  private readonly logger = new Logger(RemittanceService.name);

  constructor(
    @InjectModel(Remittance.name)
    private readonly remittanceModel: Model<RemittanceDocument>,
    private readonly accountingService: AccountingService,
  ) {}

  /**
   * Create a new cross-border remittance order with quote lock
   */
  async createRemittance(dto: CreateRemittanceDto): Promise<Remittance> {
    const fee = dto.serviceFee || '10.00';
    const providerFee = dto.providerCharge || '5.00';
    const destinationAmount = DecimalMath.multiply(dto.sourceAmount, dto.exchangeRate).toString();
    const totalCollected = DecimalMath.add(dto.sourceAmount, fee).toString();

    const count = await this.remittanceModel.countDocuments();
    const transactionNo = `REM-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
    const quoteExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins TTL per BR-005

    const remittance = new this.remittanceModel({
      transactionNo,
      organizationId: new Types.ObjectId(dto.organizationId),
      sourceEntityId: new Types.ObjectId(dto.sourceEntityId),
      sourceBranchId: new Types.ObjectId(dto.sourceBranchId),
      destinationEntityId: new Types.ObjectId(dto.destinationEntityId),
      senderName: dto.senderName,
      senderPhone: dto.senderPhone,
      beneficiaryName: dto.beneficiaryName,
      beneficiaryAccount: dto.beneficiaryAccount,
      beneficiaryBank: dto.beneficiaryBank,
      sourceCurrency: dto.sourceCurrency.toUpperCase(),
      sourceAmount: Types.Decimal128.fromString(dto.sourceAmount),
      exchangeRate: Types.Decimal128.fromString(dto.exchangeRate),
      destinationCurrency: dto.destinationCurrency.toUpperCase(),
      destinationAmount: Types.Decimal128.fromString(destinationAmount),
      serviceFee: Types.Decimal128.fromString(fee),
      providerCharge: Types.Decimal128.fromString(providerFee),
      totalCollectedAmount: Types.Decimal128.fromString(totalCollected),
      status: RemittanceStatus.PENDING_COLLECTION,
      quoteExpiresAt,
      timeline: [
        {
          status: RemittanceStatus.PENDING_COLLECTION,
          timestamp: new Date(),
          memo: `Order created. Quote locked at ${dto.exchangeRate} until ${quoteExpiresAt.toISOString()}`,
          updatedBy: new Types.ObjectId(dto.userId) as any,
        },
      ],
      createdBy: new Types.ObjectId(dto.userId),
    });

    const saved = await remittance.save();
    this.logger.log(`Created Remittance Order ${transactionNo}: ${dto.sourceAmount} ${dto.sourceCurrency} -> ${destinationAmount} ${dto.destinationCurrency}`);
    return saved;
  }

  /**
   * Collect funds from customer and post double-entry collection journal
   */
  async collectFunds(remittanceId: string, userId: string): Promise<Remittance> {
    const order = await this.remittanceModel.findById(remittanceId);
    if (!order) {
      throw new NotFoundException(`Remittance ${remittanceId} not found`);
    }

    if (order.status !== RemittanceStatus.PENDING_COLLECTION) {
      throw new BadRequestException(`Cannot collect funds in status: ${order.status}`);
    }

    const totalCollected = order.totalCollectedAmount.toString();
    const principal = order.sourceAmount.toString();
    const fee = order.serviceFee.toString();

    // Find accounts for Collection
    const coas = await this.accountingService.getChartOfAccounts(order.sourceEntityId.toString());
    const cashCoa = coas.find((c) => c.code === '1010') || coas[0];
    const payableCoa = coas.find((c) => c.code === '2020') || coas[0];
    const feeCoa = coas.find((c) => c.code === '4020') || coas[0];

    // Double-Entry: DR Cash (Total Collected), CR Remittance Payable (Principal), CR Fee Income (Service Fee)
    const journal = await this.accountingService.postJournalEntry({
      organizationId: order.organizationId.toString(),
      legalEntityId: order.sourceEntityId.toString(),
      branchId: order.sourceBranchId.toString(),
      businessDate: new Date().toISOString().split('T')[0],
      sourceModule: 'REMITTANCE_COLLECT',
      referenceId: (order as any)._id.toString(),
      referenceType: 'REMITTANCE_ORDER',
      narration: `Collection for Remittance ${order.transactionNo} (${order.senderName} -> ${order.beneficiaryName})`,
      functionalCurrency: order.sourceCurrency,
      postedBy: userId,
      lines: [
        {
          coaId: (cashCoa as any)._id.toString(),
          coaCode: cashCoa.code,
          coaName: cashCoa.name,
          currency: order.sourceCurrency,
          nativeAmount: totalCollected,
          exchangeRate: '1',
          debit: totalCollected,
          credit: '0',
          memo: `Funds received from ${order.senderName}`,
        },
        {
          coaId: (payableCoa as any)._id.toString(),
          coaCode: payableCoa.code,
          coaName: payableCoa.name,
          currency: order.sourceCurrency,
          nativeAmount: principal,
          exchangeRate: '1',
          debit: '0',
          credit: principal,
          memo: `Remittance Payout Liability for ${order.beneficiaryName}`,
        },
        {
          coaId: (feeCoa as any)._id.toString(),
          coaCode: feeCoa.code,
          coaName: feeCoa.name,
          currency: order.sourceCurrency,
          nativeAmount: fee,
          exchangeRate: '1',
          debit: '0',
          credit: fee,
          memo: `Remittance Service Fee Income`,
        },
      ],
    });

    order.status = RemittanceStatus.COLLECTED;
    order.collectionJournalId = (journal as any)._id;
    order.timeline.push({
      status: RemittanceStatus.COLLECTED,
      timestamp: new Date(),
      memo: `Funds of ${totalCollected} ${order.sourceCurrency} collected. Journal: ${journal.entryNumber}`,
      updatedBy: new Types.ObjectId(userId) as any,
    });

    // Auto-advance to compliance review
    order.status = RemittanceStatus.COMPLIANCE_REVIEW;
    order.timeline.push({
      status: RemittanceStatus.COMPLIANCE_REVIEW,
      timestamp: new Date(),
      memo: 'Automated AML & Sanctions screening initiated.',
      updatedBy: new Types.ObjectId(userId) as any,
    });

    return order.save();
  }

  /**
   * Transition remittance state according to 16-state server machine
   */
  async transitionStatus(
    remittanceId: string,
    newStatus: RemittanceStatus,
    memo: string,
    userId: string,
  ): Promise<Remittance> {
    const order = await this.remittanceModel.findById(remittanceId);
    if (!order) {
      throw new NotFoundException(`Remittance ${remittanceId} not found`);
    }

    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Illegal state transition: Cannot move from '${order.status}' to '${newStatus}'. Allowed: [${allowed.join(', ')}]`,
      );
    }

    order.status = newStatus;
    order.timeline.push({
      status: newStatus,
      timestamp: new Date(),
      memo: memo || `Status transitioned to ${newStatus}`,
      updatedBy: new Types.ObjectId(userId) as any,
    });

    return order.save();
  }

  /**
   * Record external destination payout
   */
  async recordPayout(
    remittanceId: string,
    externalReference: string,
    userId: string,
  ): Promise<Remittance> {
    const order = await this.remittanceModel.findById(remittanceId);
    if (!order) {
      throw new NotFoundException(`Remittance ${remittanceId} not found`);
    }

    if (order.status !== RemittanceStatus.PROCESSING && order.status !== RemittanceStatus.APPROVED) {
      throw new BadRequestException(`Cannot payout order in status: ${order.status}`);
    }

    order.externalPayoutReference = externalReference;
    order.status = RemittanceStatus.PAID;
    order.timeline.push({
      status: RemittanceStatus.PAID,
      timestamp: new Date(),
      memo: `Payout confirmed via partner network. Ref: ${externalReference}`,
      updatedBy: new Types.ObjectId(userId) as any,
    });

    return order.save();
  }

  /**
   * List remittances with filters
   */
  async listRemittances(filter: any = {}) {
    return this.remittanceModel.find(filter).sort({ createdAt: -1 }).limit(100);
  }
}
