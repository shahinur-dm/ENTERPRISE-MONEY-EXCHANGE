import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CurrencyCostPoolDocument = CurrencyCostPool & Document;

@Schema({ timestamps: true, collection: 'currency_cost_pools' })
export class CurrencyCostPool {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  legalEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true, index: true })
  branchId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, uppercase: true })
  currencyCode: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  totalQuantity: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  weightedAverageCostRate: MongooseSchema.Types.Decimal128; // Stored to 12 decimal places

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  totalCostValuation: MongooseSchema.Types.Decimal128; // totalQuantity * WAC
}

export const CurrencyCostPoolSchema = SchemaFactory.createForClass(CurrencyCostPool);
CurrencyCostPoolSchema.index({ legalEntityId: 1, branchId: 1, currencyCode: 1 }, { unique: true });
