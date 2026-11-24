import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExchangeRateDocument = ExchangeRate & Document;

@Schema({ timestamps: true, collection: 'exchange_rates' })
export class ExchangeRate {
  @Prop({ required: true, uppercase: true })
  pairSymbol: string; // e.g. "MYR/BDT", "EUR/USD", "EUR/GBP"

  @Prop({ required: true, uppercase: true })
  baseCurrency: string;

  @Prop({ required: true, uppercase: true })
  quoteCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  buyRate: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  sellRate: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  midRate?: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  spread?: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, default: Date.now })
  effectiveFrom: Date;

  @Prop()
  expiresAt?: Date;

  @Prop({ default: 1 })
  version: number;

  @Prop({ default: 'ACTIVE' })
  status: string; // ACTIVE, EXPIRED, SUPERSEDED

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: MongooseSchema.Types.ObjectId;
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);
ExchangeRateSchema.index({ pairSymbol: 1, status: 1 });
