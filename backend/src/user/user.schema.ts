import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  college: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop([String])
  interests: string[];

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: 'Other' })
  gender: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ default: 0, type: Number })
  earnedSoFar: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
