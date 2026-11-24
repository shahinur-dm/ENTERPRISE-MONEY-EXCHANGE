import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TradeStatus } from '@erp/types';

export type CurrencyPurchaseDocument = CurrencyPurchase & Document;

@Schema({ timestamps: true, collection: 'currency_purchases' })
export class CurrencyPurchase {
  @Prop({ required: true, unique: true, index: true })
  purchaseNo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  legalEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true, index: true })
  branchId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  supplierName: string;

  @Prop({ required: true, uppercase: true })
  purchasedCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  quantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  purchaseRate: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, uppercase: true })
  settlementCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalSettlementAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  paidAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  dueAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JournalEntry' })
  journalId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: TradeStatus, default: TradeStatus.SETTLED })
  status: TradeStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const CurrencyPurchaseSchema = SchemaFactory.createForClass(CurrencyPurchase);
