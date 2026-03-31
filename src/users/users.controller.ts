import { Controller, Get, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() jwtUser: any) {
    const user = await this.usersService.findById(jwtUser.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    };
  }
}