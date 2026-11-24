import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true, collection: 'user_sessions' })
export class Session {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, index: true })
  refreshTokenHash: string;

  @Prop({ required: true })
  tokenFamily: string; // Used for refresh token rotation & reuse detection

  @Prop()
  device?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: true, index: { expires: 0 } })
  expiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
