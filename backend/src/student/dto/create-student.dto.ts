import { IsString, IsArray, IsEmail, IsMongoId, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @IsString()
  current_state: string;

  @IsString()
  current_city: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paidMentorIds?: string[];
}
