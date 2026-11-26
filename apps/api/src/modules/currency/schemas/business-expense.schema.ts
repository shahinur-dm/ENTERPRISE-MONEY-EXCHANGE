import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BusinessExpenseDocument = BusinessExpense & Document;

@Schema({ timestamps: true, collection: 'business_expenses' })
export class BusinessExpense {
  @Prop({ required: true, unique: true, index: true })
  expenseNo: string;

  @Prop({ required: true, default: Date.now, index: true })
  date: Date;

  @Prop({ required: true, index: true })
  category: string; // Office Rent, Staff Salary, Electricity, Internet, Transport, Bank Charges, Miscellaneous

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  amountBDT: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FinancialAccount', required: true, index: true })
  paymentAccountId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  paymentAccountName: string;

  @Prop({ trim: true })
  paidTo?: string;

  @Prop({ required: true })
  operatorId: string;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ required: true, default: 'PAID', enum: ['PAID', 'CANCELLED'], index: true })
  status: string;
}

export const BusinessExpenseSchema = SchemaFactory.createForClass(BusinessExpense);
BusinessExpenseSchema.index({ category: 1, date: -1 });
