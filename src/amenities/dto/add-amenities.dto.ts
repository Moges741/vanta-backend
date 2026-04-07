import { IsArray, IsString } from 'class-validator';

export class AddAmenitiesDto {
  @IsArray()
  @IsString({ each: true })
  amenityIds: string[];
}