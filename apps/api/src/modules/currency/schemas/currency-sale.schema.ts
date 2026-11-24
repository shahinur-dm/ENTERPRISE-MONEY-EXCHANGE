import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TradeStatus } from '@erp/types';

export type CurrencySaleDocument = CurrencySale & Document;

@Schema({ timestamps: true, collection: 'currency_sales' })
export class CurrencySale {
  @Prop({ required: true, unique: true, index: true })
  saleNo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  legalEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true, index: true })
  branchId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true, uppercase: true })
  soldCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  quantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  sellingRate: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  grossProceeds: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  costBasisRate: MongooseSchema.Types.Decimal128; // Derived from WAC

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalCostBasis: MongooseSchema.Types.Decimal128; // quantity * WAC rate

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  realizedFxGain: MongooseSchema.Types.Decimal128; // grossProceeds - totalCostBasis

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  receivedAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  dueAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JournalEntry' })
  journalId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: TradeStatus, default: TradeStatus.SETTLED })
  status: TradeStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const CurrencySaleSchema = SchemaFactory.createForClass(CurrencySale);
