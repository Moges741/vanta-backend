import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(['USER', 'OWNER'], { message: 'Role must be either USER or OWNER' })
  role: 'USER' | 'OWNER';
}