import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Extract token from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Read the secret securely from environment variables
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // This payload is the decoded JWT. What we return here becomes `request.user`
  async validate(payload: any) {
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}