import { Injectable, HttpException, HttpStatus, UnauthorizedException,ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
@Injectable()
export class AuthService {
 private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

async signup(createUserDto: CreateUserDto) {
  const existingUser = await this.usersService.findByEmail(createUserDto.email);

  if (existingUser) {
    throw new HttpException(
      'This email is already registered. Please login instead.', 
      HttpStatus.CONFLICT
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

  const user = await this.usersService.createUser({
    name: createUserDto.name,
    email: createUserDto.email,
    password: hashedPassword,
  });

  const token = this.generateToken(user);

  return {
    success: true,
    message: 'Account created successfully',
    data: {
      user,
      token,
    },
  };
}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const status = await this.usersService.getStatusByEmail(loginDto.email);
    if (status !== 'ACTIVE') {
      throw new ForbiddenException('Your account is not active. Contact support.');
    }

    const { password, ...userWithoutPassword } = user;

    const token = this.generateToken(user);

    return { user: userWithoutPassword, token };
  }




  async forgotPassword(email: string): Promise<void> {
    this.logger.log(`[ForgotPassword] Initiated for email: ${email}`);
    
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`[ForgotPassword] Email not found in DB: ${email}. Faking success for security.`);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    this.logger.log(`[ForgotPassword] Token generated for user ID: ${user.id}`);

    const emailSent = await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    
    if (!emailSent) {
      this.logger.error(`[ForgotPassword] Failed to send email to ${user.email}`);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    this.logger.log(`[ResetPassword] Attempting to reset password with token`);

    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      this.logger.error(`[ResetPassword] Invalid token provided`);
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (resetRecord.expiresAt < new Date()) {
      this.logger.error(`[ResetPassword] Token expired for user ID: ${resetRecord.userId}`);
      await this.prisma.passwordResetToken.delete({ where: { token } });
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.delete({
      where: { token },
    });

    this.logger.log(`[ResetPassword] Password successfully changed for user ID: ${resetRecord.userId}`);
  }

  private generateToken(user: any): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}


async verifyEmail(token: string, email: string) {
  this.logger.log(`[VerifyEmail] Attempt for email: ${email}`);

  const user = await this.usersService.findByEmail(email);

  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (user.isVerified) {
    return {
      success: true,
      message: 'Your email is already verified.',
    };
  }

    await this.prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  this.logger.log(`[VerifyEmail] Success for user: ${email}`);

  return {
    success: true,
    message: 'Your email has been successfully verified! You can now login.',
  };
}
}
