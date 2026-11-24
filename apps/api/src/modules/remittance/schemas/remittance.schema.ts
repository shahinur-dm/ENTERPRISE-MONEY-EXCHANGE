import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RemittanceStatus } from '@erp/types';

export type RemittanceDocument = Remittance & Document;

@Schema({ _id: false })
export class RemittanceTimelineEvent {
  @Prop({ type: String, enum: RemittanceStatus, required: true })
  status: RemittanceStatus;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop()
  memo?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy?: MongooseSchema.Types.ObjectId;
}

export const RemittanceTimelineEventSchema = SchemaFactory.createForClass(RemittanceTimelineEvent);

@Schema({ timestamps: true, collection: 'remittances' })
export class Remittance {
  @Prop({ required: true, unique: true, index: true })
  transactionNo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  sourceEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true, index: true })
  sourceBranchId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  destinationEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  senderPhone: string;

  @Prop({ required: true })
  beneficiaryName: string;

  @Prop({ required: true })
  beneficiaryAccount: string;

  @Prop({ required: true })
  beneficiaryBank: string;

  @Prop({ required: true, uppercase: true })
  sourceCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  sourceAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  exchangeRate: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, uppercase: true })
  destinationCurrency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  destinationAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  serviceFee: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  providerCharge: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalCollectedAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: String, enum: RemittanceStatus, default: RemittanceStatus.DRAFT, index: true })
  status: RemittanceStatus;

  @Prop()
  quoteExpiresAt?: Date;

  @Prop()
  externalPayoutReference?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JournalEntry' })
  collectionJournalId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JournalEntry' })
  payoutJournalId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: [RemittanceTimelineEventSchema], default: [] })
  timeline: RemittanceTimelineEvent[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const RemittanceSchema = SchemaFactory.createForClass(Remittance);
RemittanceSchema.index({ sourceEntityId: 1, status: 1, createdAt: -1 });
