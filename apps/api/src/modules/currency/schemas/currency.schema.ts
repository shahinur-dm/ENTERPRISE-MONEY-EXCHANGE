import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SystemStatus } from '@erp/types';

export type CurrencyDocument = Currency & Document;

@Schema({ timestamps: true, collection: 'currencies' })
export class Currency {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string; // ISO 4217 (BDT, MYR, USD, EUR, GBP, AED, SAR, SGD)

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true, default: 2 })
  decimalPlaces: number;

  @Prop({ default: true })
  isFiat: boolean;

  @Prop({ default: false })
  isLocal: boolean;

  @Prop({ trim: true, default: 'symbol-prefix' })
  displayFormat: string;

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE })
  status: SystemStatus;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
