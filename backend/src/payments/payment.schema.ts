// src/payments/payment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop({ required: true })
  paymentIntentId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paidBy: string; 

  @Prop({ required: true })
  receivedTo: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
