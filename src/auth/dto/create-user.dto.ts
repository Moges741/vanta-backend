import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}