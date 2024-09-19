import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';
import Stripe from 'stripe';
import { UserService } from '../user/user.service'; 

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    private readonly userService: UserService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  }

  async createPaymentIntent(amount: number, currency: string = 'inr'): Promise<Stripe.PaymentIntent> {
    const MIN_AMOUNT_INR = 50; 

    if (currency === 'inr') {
      if (amount < MIN_AMOUNT_INR) {
        throw new BadRequestException(`Amount must be at least ₹${MIN_AMOUNT_INR}`);
      }

      amount *= 100;
    }

    console.log("Creating payment intent with amount:", amount);

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
      });
      // console.log('Payment Intent:', paymentIntent);
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async recordPayment(paymentIntentId: string, amount: number, paidBy: string, receivedTo: string): Promise<Payment> {
    const payment = new this.paymentModel({
      paymentIntentId,
      amount,
      createdAt: new Date(),
      paidBy,
      receivedTo,
    });
    return payment.save();
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }
}
