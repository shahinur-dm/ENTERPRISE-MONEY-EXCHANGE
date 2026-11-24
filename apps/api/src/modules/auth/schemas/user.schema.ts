import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRoleType, SystemStatus } from '@erp/types';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: String, enum: UserRoleType, default: UserRoleType.AGENT, index: true })
  role: UserRoleType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  customRoleId?: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop({ select: false })
  twoFactorSecret?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Branch' }], default: [] })
  allowedBranches: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String, enum: SystemStatus, default: SystemStatus.ACTIVE, index: true })
  status: SystemStatus;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop()
  lockoutUntil?: Date;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
