// src/likes/dto/create-like.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;
}
