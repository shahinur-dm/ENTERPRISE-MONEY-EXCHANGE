import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PartyType, SystemStatus } from '@erp/types';

export type PartyDocument = Party & Document;

@Schema({ timestamps: true, collection: 'parties' })
export class Party {
  @Prop({ required: true, unique: true, index: true })
  partyNo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', index: true })
  organizationId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', index: true })
  legalEntityId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: PartyType, required: true, index: true, default: PartyType.CUSTOMER })
  partyType: PartyType;

  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ trim: true })
  businessName?: string;

  @Prop({ required: true, trim: true, index: true })
  phone: string;

  @Prop({ trim: true })
  alternativePhone?: string;

  @Prop({ trim: true })
  email?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  nationalId?: string;

  @Prop({ trim: true })
  passportNo?: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  openingBalanceBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  currentBalanceBDT: MongooseSchema.Types.Decimal128; // Positive = Receivable from party, Negative = Payable to party

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  advanceBalanceBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  totalPurchasedBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  totalSoldBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE })
  status: SystemStatus;

  @Prop()
  notes?: string;
}

export const PartySchema = SchemaFactory.createForClass(Party);
PartySchema.index({ partyType: 1, name: 1 });
