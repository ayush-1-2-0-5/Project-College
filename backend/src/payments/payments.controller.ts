import { Controller, Post, Body, Param, NotFoundException,BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UserService } from '../user/user.service'; // Adjust the path as necessary

@Controller('api/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly userService: UserService,
  ) {}
  
  @Post('create-payment-intent/:userId')
  async createPaymentIntent(
    @Param('userId') userId: string,
    @Body() body: { amount: number }
  ) {
    const MIN_AMOUNT_INR = 50;
    if (body.amount < MIN_AMOUNT_INR) {
      throw new BadRequestException(`Amount must be at least ₹${MIN_AMOUNT_INR}`);
    }
    const user = await this.userService.getUserDetailsByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const paymentIntent = await this.paymentsService.createPaymentIntent(body.amount, 'inr');
    return { clientSecret: paymentIntent.client_secret };
  }
}
