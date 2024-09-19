import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency: string = 'inr'; // Default to INR

  @IsString()
  @IsNotEmpty()
  paidBy: string; // The ID or name of the user who is making the payment

  @IsString()
  @IsNotEmpty()
  receivedTo: string; // The ID or name of the user who is receiving the payment
}
