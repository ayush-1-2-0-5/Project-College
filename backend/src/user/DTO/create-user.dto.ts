import { UserDetailsDto } from './user-details.dto';
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto extends UserDetailsDto {
  @IsString()
  @IsNotEmpty()
  college: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;


  
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean = false;

  @IsString()
  @IsOptional()
  @IsIn(['Male', 'Female', 'Other']) 
  gender?: string;
}
