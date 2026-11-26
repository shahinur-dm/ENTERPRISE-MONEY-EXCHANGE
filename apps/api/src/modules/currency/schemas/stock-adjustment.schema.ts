import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StockAdjustmentDocument = StockAdjustment & Document;

@Schema({ timestamps: true, collection: 'stock_adjustments' })
export class StockAdjustment {
  @Prop({ required: true, unique: true, index: true })
  adjustmentNo: string;

  @Prop({ required: true, default: Date.now, index: true })
  date: Date;

  @Prop({ required: true, uppercase: true, index: true })
  currencyCode: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  systemStock: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  physicalStock: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  differenceQty: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, enum: ['SURPLUS', 'SHORTAGE'], index: true })
  adjustmentType: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  unitCostRate: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  bdtValuationImpact: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, trim: true })
  reason: string;

  @Prop({ required: true })
  operatorId: string;

  @Prop({ trim: true })
  approvedBy?: string;

  @Prop({ required: true, default: 'APPROVED', enum: ['PENDING', 'APPROVED', 'REJECTED'], index: true })
  status: string;
}

export const StockAdjustmentSchema = SchemaFactory.createForClass(StockAdjustment);
