import { Injectable, HttpException, HttpStatus, UnauthorizedException,ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

type PasswordResetTokenRow = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
};

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

    await this.prisma.$executeRaw`
      DELETE FROM "password_reset_tokens"
      WHERE "userId" = ${user.id}
    `;

    await this.prisma.$executeRaw`
      INSERT INTO "password_reset_tokens" ("id", "token", "userId", "expiresAt", "createdAt")
      VALUES (${crypto.randomUUID()}, ${resetToken}, ${user.id}, ${expiresAt}, NOW())
    `;

    this.logger.log(`[ForgotPassword] Token generated for user ID: ${user.id}`);

    const emailSent = await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    
    if (!emailSent) {
      this.logger.error(`[ForgotPassword] Failed to send email to ${user.email}`);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    this.logger.log(`[ResetPassword] Attempting to reset password with token`);

    const [resetRecord] = await this.prisma.$queryRaw<PasswordResetTokenRow[]>`
      SELECT "id", "token", "userId", "expiresAt", "createdAt"
      FROM "password_reset_tokens"
      WHERE "token" = ${token}
      LIMIT 1
    `;

    if (!resetRecord) {
      this.logger.error(`[ResetPassword] Invalid token provided`);
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (resetRecord.expiresAt < new Date()) {
      this.logger.error(`[ResetPassword] Token expired for user ID: ${resetRecord.userId}`);
      await this.prisma.$executeRaw`
        DELETE FROM "password_reset_tokens"
        WHERE "token" = ${token}
      `;
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.$executeRaw`
      DELETE FROM "password_reset_tokens"
      WHERE "token" = ${token}
    `;

    this.logger.log(`[ResetPassword] Password successfully changed for user ID: ${resetRecord.userId}`);
  }

  private generateToken(user: any): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async verifyEmail(token: string, email: string) {
    this.logger.log(`[VerifyEmail] Attempt for email: ${email}`);

    const [user] = await this.prisma.$queryRaw<Array<{ id: string; isVerified: boolean }>>`
      SELECT "id", "isVerified"
      FROM "users"
      WHERE "email" = ${email}
      LIMIT 1
    `;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      return {
        success: true,
        message: 'Your email is already verified.',
      };
    }

    await this.prisma.$executeRaw`
      UPDATE "users"
      SET "isVerified" = true
      WHERE "id" = ${user.id}
    `;

    this.logger.log(`[VerifyEmail] Success for user: ${email}`);

    return {
      success: true,
      message: 'Your email has been successfully verified! You can now login.',
    };
  }
}
