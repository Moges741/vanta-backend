import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { ReorderStepItemDto } from './reorder-step-item.dto';

export class ReorderStepsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderStepItemDto)
  steps: ReorderStepItemDto[];
}