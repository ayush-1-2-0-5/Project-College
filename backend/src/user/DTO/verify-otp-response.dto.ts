import { IsBoolean } from 'class-validator';

export class VerifyOtpResponseDto {
  @IsBoolean()
  verified: boolean;
}
