import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthSessionPayload } from '@erp/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'enterprise-money-exchange-jwt-secret-key-2026'),
    });
  }

  async validate(payload: any): Promise<AuthSessionPayload> {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Malformed or expired token payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
      allowedBranches: payload.allowedBranches || [],
      permissions: payload.permissions || [],
    };
  }
}
