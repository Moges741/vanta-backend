import { IsInt, IsString } from 'class-validator';

export class ReorderStepItemDto {
  @IsString()
  id: string;

  @IsInt()
  stepOrder: number;
}