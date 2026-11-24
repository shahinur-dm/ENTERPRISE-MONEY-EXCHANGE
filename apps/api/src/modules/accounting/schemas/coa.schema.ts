import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { COAAccountType, SystemStatus } from '@erp/types';

export type ChartOfAccountDocument = ChartOfAccount & Document;

@Schema({ timestamps: true, collection: 'chart_of_accounts' })
export class ChartOfAccount {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  legalEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: COAAccountType, required: true })
  accountType: COAAccountType;

  @Prop({ required: true, trim: true })
  classification: string;

  @Prop({ required: true, uppercase: true })
  currency: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChartOfAccount' })
  parentId?: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  isReconciliation: boolean;

  @Prop({ type: MongooseSchema.Types.Decimal128, default: 0 })
  balance: MongooseSchema.Types.Decimal128;

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE })
  status: SystemStatus;
}

export const ChartOfAccountSchema = SchemaFactory.createForClass(ChartOfAccount);
ChartOfAccountSchema.index({ legalEntityId: 1, code: 1 }, { unique: true });
