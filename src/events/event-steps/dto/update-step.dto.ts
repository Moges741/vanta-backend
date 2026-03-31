import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateStepDto {
  @IsOptional()
  @IsInt()
  stepOrder?: number;

  @IsOptional()
  @IsString()
  content?: string;
}