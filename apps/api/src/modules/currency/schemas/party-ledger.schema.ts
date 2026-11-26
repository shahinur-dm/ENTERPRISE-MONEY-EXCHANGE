import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PartyType } from '@erp/types';

export type PartyLedgerDocument = PartyLedger & Document;

@Schema({ timestamps: true, collection: 'party_ledgers' })
export class PartyLedger {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Party', required: true, index: true })
  partyId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  partyName: string;

  @Prop({ type: String, enum: PartyType, required: true, index: true })
  partyType: PartyType;

  @Prop({ required: true, index: true })
  date: string; // YYYY-MM-DD

  @Prop({ required: true, index: true })
  voucherNo: string;

  @Prop({ required: true, index: true })
  transactionType: string; // 'PURCHASE' | 'SALE' | 'PAYMENT' | 'RECEIPT' | 'ADVANCE' | 'REVERSAL' | 'OPENING'

  @Prop()
  currencyContext?: string; // Foreign currency code e.g. 'MYR', 'USD'

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  foreignQuantity?: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  rate?: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  debitBDT: MongooseSchema.Types.Decimal128; // Increases party balance (receivable from party)

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true, default: 0 })
  creditBDT: MongooseSchema.Types.Decimal128; // Decreases party balance (payable to party)

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  balanceBDT: MongooseSchema.Types.Decimal128;

  @Prop()
  notes?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  operatorId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: Date.now, index: true })
  timestamp: Date;
}

export const PartyLedgerSchema = SchemaFactory.createForClass(PartyLedger);
PartyLedgerSchema.index({ partyId: 1, timestamp: -1 });
