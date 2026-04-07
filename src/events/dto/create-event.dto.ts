import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsISO8601 } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  duration!: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsString()
  categoryId!: string;

  @IsISO8601()
  @IsNotEmpty()
  startDate!: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}