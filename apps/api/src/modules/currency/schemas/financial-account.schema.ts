import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { SystemStatus, FinancialAccountType } from '@erp/types';

export type FinancialAccountDocument = FinancialAccount & Document;

@Schema({ timestamps: true, collection: 'financial_accounts' })
export class FinancialAccount {
  @Prop({ required: true, unique: true, index: true })
  accountNo: string;

  @Prop({ required: true, trim: true })
  accountName: string;

  @Prop({ required: true, enum: FinancialAccountType, default: FinancialAccountType.CASH_REGISTER, index: true })
  accountType: FinancialAccountType;

  @Prop({ trim: true })
  bankName?: string;

  @Prop({ trim: true })
  branchName?: string;

  @Prop({ required: true, uppercase: true, default: 'BDT' })
  currency: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  currentBalance: MongooseSchema.Types.Decimal128;

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE, index: true })
  status: SystemStatus;
}

export const FinancialAccountSchema = SchemaFactory.createForClass(FinancialAccount);
