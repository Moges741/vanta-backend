import { IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @IsIn(['USER', 'OWNER', 'ADMIN'], { message: 'Role must be USER, OWNER, or ADMIN' })
  role: 'USER' | 'OWNER' | 'ADMIN';
}
