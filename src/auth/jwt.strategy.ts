import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment');
    }

    super({
      // Extract token from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Read the secret securely from environment variables
      secretOrKey: jwtSecret,
    });
  }

  // This payload is the decoded JWT. What we return here becomes `request.user`
  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    const status = await this.usersService.getStatusById(payload.sub);
    if (!user || status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is inactive');
    }

    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role,
      status,
    };
  }
}
