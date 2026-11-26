import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DailyClosingDocument = DailyClosing & Document;

@Schema({ _id: false })
export class CurrencyStockClosingItem {
  @Prop({ required: true, uppercase: true })
  currencyCode: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  systemStock: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  actualStock: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  difference: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  averageCost: MongooseSchema.Types.Decimal128;
}

export const CurrencyStockClosingItemSchema = SchemaFactory.createForClass(CurrencyStockClosingItem);

@Schema({ timestamps: true, collection: 'daily_closings' })
export class DailyClosing {
  @Prop({ required: true, unique: true, index: true })
  closingDate: string; // YYYY-MM-DD

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  totalPurchaseBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  totalSalesBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  grossProfitBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  totalExpensesBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  netProfitBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  systemExpectedCash: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  actualCashCounted: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  cashDifference: MongooseSchema.Types.Decimal128;

  @Prop({ type: [CurrencyStockClosingItemSchema], default: [] })
  currencyStockSummary: CurrencyStockClosingItem[];

  @Prop({ trim: true })
  differenceReasons?: string;

  @Prop({ default: true, index: true })
  isClosed: boolean;

  @Prop({ required: true })
  closedBy: string;

  @Prop({ required: true, default: Date.now })
  closedAt: Date;
}

export const DailyClosingSchema = SchemaFactory.createForClass(DailyClosing);
