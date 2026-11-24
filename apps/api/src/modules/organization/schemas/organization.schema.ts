import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SystemStatus } from '@erp/types';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true, collection: 'organizations' })
export class Organization {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, default: 'BDT' })
  baseCurrency: string;

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE })
  status: SystemStatus;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
