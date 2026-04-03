import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

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

    // Consistent response structure
    return {
      success: true,
      message: 'Login successful',
      data,
    };
  }
}