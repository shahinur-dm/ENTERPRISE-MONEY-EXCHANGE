import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SystemStatus } from '@erp/types';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true, collection: 'countries' })
export class Country {
  @Prop({ required: true, unique: true, uppercase: true })
  isoCode: string; // e.g. "MYS", "BGD"

  @Prop({ required: true, unique: true, uppercase: true })
  iso2Code: string; // e.g. "MY", "BD"

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  defaultCurrency: string;

  @Prop({ required: true })
  timezone: string;

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE })
  status: SystemStatus;

  @Prop({ type: Object, default: {} })
  regulatorySettings: Record<string, unknown>;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
