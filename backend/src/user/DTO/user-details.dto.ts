import { IsString, IsArray, IsUrl } from 'class-validator';

export class UserDetailsDto {
  @IsString()
  firstName: string; // Required field

  @IsString()
  lastName: string; // Required field

  @IsString()
  description: string; // Required field

  @IsUrl()
  imageUrl: string; // Required field

  @IsArray()
  interests: string[]; // Required field
}

