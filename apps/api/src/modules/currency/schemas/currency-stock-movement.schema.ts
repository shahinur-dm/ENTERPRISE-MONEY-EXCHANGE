import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { StockMovementType } from '@erp/types';

export type CurrencyStockMovementDocument = CurrencyStockMovement & Document;

@Schema({ timestamps: true, collection: 'currency_stock_movements' })
export class CurrencyStockMovement {
  @Prop({ required: true, unique: true, index: true })
  movementNo: string;

  @Prop({ index: true })
  transactionId?: string;

  @Prop({ required: true, enum: StockMovementType, index: true })
  movementType: StockMovementType;

  @Prop({ required: true, uppercase: true, index: true })
  currencyCode: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  openingQuantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  inflowQuantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  outflowQuantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  closingQuantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  unitCostRate: MongooseSchema.Types.Decimal128; // Current WAC rate

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  bdtValuation: MongooseSchema.Types.Decimal128; // closingQuantity * unitCostRate

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  operatorId: string;

  @Prop({ trim: true })
  memo?: string;

  @Prop({ required: true, default: Date.now, index: true })
  timestamp: Date;
}

export const CurrencyStockMovementSchema = SchemaFactory.createForClass(CurrencyStockMovement);
CurrencyStockMovementSchema.index({ currencyCode: 1, timestamp: -1 });
