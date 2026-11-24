import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BranchType, SystemStatus } from '@erp/types';

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true, collection: 'branches' })
export class Branch {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LegalEntity', required: true, index: true })
  legalEntityId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: BranchType, default: BranchType.RETAIL_BRANCH })
  type: BranchType;

  @Prop({ type: Object, required: true })
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    countryCode: string;
  };

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE })
  status: SystemStatus;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
