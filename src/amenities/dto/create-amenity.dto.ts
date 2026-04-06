import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAmenityDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Amenity name must be at least 2 characters long' })
  name!: string;
}