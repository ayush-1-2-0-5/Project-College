// src/colleges/dto/create-college.dto.ts

import { IsString, IsOptional } from 'class-validator';

export class CreateCollegeDto {
  @IsString()
  name: string;

  @IsString()
  state: string;

  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  howToGetAdmission?: string;

  @IsOptional()
  @IsString()
  cutoff?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
