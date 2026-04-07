import { Controller, Get, NotFoundException, Patch, Param, Body, ForbiddenException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

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

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @CurrentUser() adminUser: any,
  ) {
    // Prevent admin from changing their own role
    if (userId === adminUser.id) {
      throw new ForbiddenException('You cannot change your own role');
    }

    const updatedUser = await this.usersService.updateUserRole(userId, updateUserRoleDto.role);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: `User role updated to ${updateUserRoleDto.role} successfully`,
      data: updatedUser,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    // Allow users to update their own data or admins to update any
    if (req.user.id !== userId && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own profile');
    }

    const updatedUser = await this.usersService.updateUser(userId, updateUserDto);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getUsersCount() {
    const totalUsers = await this.usersService.countUsers();
    return {
      success: true,
      message: 'Users count retrieved successfully',
      data: { totalUsers },
    };
  }
}
