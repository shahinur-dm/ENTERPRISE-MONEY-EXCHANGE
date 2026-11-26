import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TradeStatus } from '@erp/types';

export type CurrencyPurchaseDocument = CurrencyPurchase & Document;

@Schema({ timestamps: true, collection: 'currency_purchases' })
export class CurrencyPurchase {
  @Prop({ required: true, unique: true, index: true })
  purchaseNo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', index: true })
  organizationId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', index: true })
  legalEntityId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', index: true })
  branchId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Party', index: true })
  partyId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, index: true })
  supplierName: string;

  @Prop({ required: true, uppercase: true, index: true })
  purchasedCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  quantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  purchaseRate: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, uppercase: true, default: 'BDT' })
  settlementCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalSettlementAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  paidAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  dueAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FinancialAccount', index: true })
  paymentAccountId?: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'CASH' })
  paymentMethod?: string; // 'CASH' | 'BANK' | 'ADVANCE'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JournalEntry' })
  journalId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: TradeStatus, default: TradeStatus.SETTLED, index: true })
  status: TradeStatus;

  @Prop({ default: false, index: true })
  isReversed: boolean;

  @Prop({ trim: true })
  reversalReason?: string;

  @Prop()
  reversedAt?: Date;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: MongooseSchema.Types.ObjectId;
}

export const CurrencyPurchaseSchema = SchemaFactory.createForClass(CurrencyPurchase);
CurrencyPurchaseSchema.index({ purchasedCurrency: 1, createdAt: -1 });
CurrencyPurchaseSchema.index({ partyId: 1, createdAt: -1 });
