import { Injectable, HttpException, HttpStatus, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
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
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    const token = this.generateToken(user);

    return { user, token };
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

    const { password, ...userWithoutPassword } = user;

    const token = this.generateToken(user);

    return { user: userWithoutPassword, token };
  }



// async forgotPassword(dto: ForgotPasswordDto) {
//   const user = await this.usersService.findByEmail(dto.email);

//   if (!user) {
//     return { 
//       success: true, 
//       message: 'If your email exists, you will receive a reset link.' 
//     };
//   }

//   const resetToken = crypto.randomBytes(32).toString('hex');
//   const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

//   await this.prisma.passwordResetToken.create({
//     data: { token: resetToken, userId: user.id, expiresAt },
//   });

//   const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
//   const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

//   console.log('\n🔗 FULL RESET LINK:');
//   console.log(resetLink);
//   console.log('=====================================\n');

//   // Try to send email and show clear error
//   try {
//     await this.emailService.sendPasswordResetEmail(user.email, resetLink);
//     console.log(`✅ Email successfully sent to: ${user.email}`);
//   } catch (err: any) {
//     console.error('❌ FAILED TO SEND EMAIL:', err.message);
//     console.error('Check your RESEND_API_KEY and EmailService');
//   }

//   return { 
//     success: true, 
//     message: 'Password reset link sent (check console for link)' 
//   };
// }
// async resetPassword(dto: ResetPasswordDto) {
//   const resetRecord = await this.prisma.passwordResetToken.findUnique({
//     where: { token: dto.token },
//   });

//   if (!resetRecord || resetRecord.expiresAt < new Date()) {
//     throw new BadRequestException('Invalid or expired reset token');
//   }

//   const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

//   await this.prisma.user.update({
//     where: { id: resetRecord.userId },
//     data: { password: hashedPassword },
//   });

//   // Delete used token
//   await this.prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });

//   return { success: true, message: 'Password reset successfully. You can now login.' };
// }

  async forgotPassword(email: string): Promise<void> {
    this.logger.log(`[ForgotPassword] Initiated for email: ${email}`);
    
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`[ForgotPassword] Email not found in DB: ${email}. Faking success for security.`);
      return; // Stop here, but controller will return 200 OK
    }

    // 1. Generate a secure, random 64-character token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // 2. Set expiration to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // 3. Delete any existing reset tokens for this user to prevent spam
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // 4. Save the new token in the database
    await this.prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    this.logger.log(`[ForgotPassword] Token generated for user ID: ${user.id}`);

    // 5. Send the email
    const emailSent = await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    
    if (!emailSent) {
      this.logger.error(`[ForgotPassword] Failed to send email to ${user.email}`);
      // We don't throw an error to the user here to maintain security, but we log it.
    }
  }

  /**
   * Validates the token and updates the user's password.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    this.logger.log(`[ResetPassword] Attempting to reset password with token`);

    // 1. Find the token in the database
    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // 2. Check if token exists
    if (!resetRecord) {
      this.logger.error(`[ResetPassword] Invalid token provided`);
      throw new BadRequestException('Invalid or expired password reset token');
    }

    // 3. Check if token is expired
    if (resetRecord.expiresAt < new Date()) {
      this.logger.error(`[ResetPassword] Token expired for user ID: ${resetRecord.userId}`);
      // Clean up expired token
      await this.prisma.passwordResetToken.delete({ where: { token } });
      throw new BadRequestException('Invalid or expired password reset token');
    }

    // 4. Hash the new password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update the user's password
    await this.prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    // 6. Delete the token so it can't be used again
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