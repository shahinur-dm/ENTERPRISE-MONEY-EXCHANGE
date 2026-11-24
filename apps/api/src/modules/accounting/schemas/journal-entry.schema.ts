import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { JournalStatus } from '@erp/types';

export type JournalEntryDocument = JournalEntry & Document;

@Schema({ _id: false })
export class JournalLine {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChartOfAccount', required: true })
  coaId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  coaCode: string;

  @Prop({ required: true })
  coaName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FinancialAccount' })
  financialAccountId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, uppercase: true })
  currency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  nativeAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 1 })
  exchangeRate: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  debit: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  credit: MongooseSchema.Types.Decimal128;

  @Prop()
  memo?: string;
}

export const JournalLineSchema = SchemaFactory.createForClass(JournalLine);

@Schema({ timestamps: true, collection: 'journal_entries' })
export class JournalEntry {
  @Prop({ required: true, unique: true, index: true })
  entryNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  legalEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true, index: true })
  branchId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  postingDate: Date;

  @Prop({ required: true })
  businessDate: string;

  @Prop({ required: true, default: 'MANUAL' })
  sourceModule: string;

  @Prop()
  referenceId?: string;

  @Prop()
  referenceType?: string;

  @Prop({ required: true })
  narration: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalDebit: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalCredit: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, uppercase: true })
  functionalCurrency: string;

  @Prop({ type: String, enum: JournalStatus, default: JournalStatus.POSTED })
  status: JournalStatus;

  @Prop({ default: false })
  isReversal: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JournalEntry' })
  reversalOfJournalId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: [JournalLineSchema], required: true })
  lines: JournalLine[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  postedBy: MongooseSchema.Types.ObjectId;

  @Prop()
  auditHash?: string;
}

export const JournalEntrySchema = SchemaFactory.createForClass(JournalEntry);
JournalEntrySchema.index({ legalEntityId: 1, postingDate: -1 });
