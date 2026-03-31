import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateStepDto {
  @IsInt()
  stepOrder: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}