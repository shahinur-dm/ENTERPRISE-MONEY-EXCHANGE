import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { SystemStatus } from '@erp/types';

export type LegalEntityDocument = LegalEntity & Document;

@Schema({ timestamps: true, collection: 'legal_entities' })
export class LegalEntity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Country', required: true, index: true })
  countryId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  registrationNo: string;

  @Prop({ required: true })
  licenseNo: string;

  @Prop({ required: true, uppercase: true })
  functionalCurrency: string; // e.g. "MYR" or "BDT"

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE })
  status: SystemStatus;
}

export const LegalEntitySchema = SchemaFactory.createForClass(LegalEntity);
