import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TradeStatus } from '@erp/types';

export type CurrencySaleDocument = CurrencySale & Document;

@Schema({ timestamps: true, collection: 'currency_sales' })
export class CurrencySale {
  @Prop({ required: true, unique: true, index: true })
  saleNo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', index: true })
  organizationId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', index: true })
  legalEntityId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', index: true })
  branchId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Party', index: true })
  partyId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, index: true })
  customerName: string;

  @Prop({ required: true, uppercase: true, index: true })
  soldCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  quantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  sellingRate: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  grossProceeds: MongooseSchema.Types.Decimal128; // in BDT

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  costBasisRate: MongooseSchema.Types.Decimal128; // Derived from WAC at moment of sale

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalCostBasis: MongooseSchema.Types.Decimal128; // COGS: quantity * WAC rate in BDT

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  realizedFxGain: MongooseSchema.Types.Decimal128; // grossProceeds - totalCostBasis

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  receivedAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  dueAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FinancialAccount', index: true })
  receiptAccountId?: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'CASH' })
  receiptMethod?: string; // 'CASH' | 'BANK' | 'ADVANCE'

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

export const CurrencySaleSchema = SchemaFactory.createForClass(CurrencySale);
CurrencySaleSchema.index({ soldCurrency: 1, createdAt: -1 });
CurrencySaleSchema.index({ partyId: 1, createdAt: -1 });
