// src/student/dto/loginstudent.dto.ts
import { IsString, IsEmail } from 'class-validator';

export class LoginStudentDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
