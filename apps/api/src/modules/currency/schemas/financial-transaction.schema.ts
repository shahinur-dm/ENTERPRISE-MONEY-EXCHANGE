import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FinancialTransactionDocument = FinancialTransaction & Document;

@Schema({ timestamps: true, collection: 'financial_transactions' })
export class FinancialTransaction {
  @Prop({ required: true, unique: true, index: true })
  voucherNo: string;

  @Prop({ required: true, index: true })
  transactionType: string; // 'PURCHASE_PAYMENT' | 'SALE_RECEIPT' | 'CUSTOMER_PAYMENT' | 'BUYER_RECEIPT' | 'EXPENSE' | 'TRANSFER' | 'ADVANCE_RECEIPT' | 'ADVANCE_PAYMENT' | 'REVERSAL'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Party', index: true })
  partyId?: MongooseSchema.Types.ObjectId;

  @Prop({ trim: true, index: true })
  partyName?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FinancialAccount', index: true })
  sourceAccountId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FinancialAccount', index: true })
  destinationAccountId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  amountBDT: MongooseSchema.Types.Decimal128;

  @Prop({ index: true })
  relatedTransactionNo?: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, default: 0 })
  debit: MongooseSchema.Types.Decimal128; // In BDT

  @Prop({ type: MongooseSchema.Types.Decimal128, default: 0 })
  credit: MongooseSchema.Types.Decimal128; // In BDT

  @Prop({ type: MongooseSchema.Types.Decimal128, default: 0 })
  runningPartyBalance: MongooseSchema.Types.Decimal128;

  @Prop({ uppercase: true })
  currencyContext?: string; // Foreign currency if related to trade (e.g. MYR, USD)

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  foreignAmount?: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  rate?: MongooseSchema.Types.Decimal128;

  @Prop({ required: true })
  operatorId: string;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ required: true, default: Date.now, index: true })
  date: Date;
}

export const FinancialTransactionSchema = SchemaFactory.createForClass(FinancialTransaction);
FinancialTransactionSchema.index({ partyId: 1, date: -1 });
FinancialTransactionSchema.index({ transactionType: 1, date: -1 });
