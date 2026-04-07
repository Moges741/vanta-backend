import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get, Query, BadRequestException, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const data = await this.authService.signup(createUserDto);
    
    return {
      success: true,
      message: 'User registered successfully',
      data,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // Login should return 200 OK, not 201 Created
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);

    return {
      success: true,
      message: 'Login successful',
      data,
    };
  }
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    
      return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    
    return {
      success: true,
      message: 'Password has been successfully reset. You can now log in with your new password.',
    };
  }

  @Public()
@Get('verify-email')
async verifyEmail(@Query('token') token: string, @Query('email') email: string) {
  if (!token || !email) {
    throw new BadRequestException('Invalid verification link');
  }

  return this.authService.verifyEmail(token, email);
}
@UseGuards(JwtAuthGuard)
@Post('logout')
async logout() {
  return {
    success: true,
    message: 'Logged out successfully',
  };
}
}