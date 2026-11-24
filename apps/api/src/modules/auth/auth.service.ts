import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import * as crypto from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { Session, SessionDocument } from './schemas/session.schema';
import { LoginDto } from './dto/login.dto';
import { Verify2FaDto } from './dto/verify-2fa.dto';
import { UserRoleType, SystemStatus } from '@erp/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).select('+passwordHash +twoFactorSecret');

    if (!user) {
      throw new UnauthorizedException('Invalid institutional credentials');
    }

    if (user.status === SystemStatus.LOCKED || user.status === SystemStatus.SUSPENDED) {
      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        const remainingMinutes = Math.ceil(
          (user.lockoutUntil.getTime() - Date.now()) / (60 * 1000)
        );
        throw new ForbiddenException(
          `Security lockout in effect due to repeated failed logins. Please retry in ${remainingMinutes} minutes.`
        );
      }
      if (user.status === SystemStatus.SUSPENDED) {
        throw new ForbiddenException('Account suspended. Contact institutional compliance.');
      }
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.status = SystemStatus.LOCKED;
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();
        throw new ForbiddenException(
          'Security lockout triggered: 5 failed login attempts. Account temporarily locked for 15 minutes.'
        );
      }
      await user.save();
      throw new UnauthorizedException('Invalid institutional credentials');
    }

    // Reset failed counter
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    if (user.status === SystemStatus.LOCKED) {
      user.status = SystemStatus.ACTIVE;
    }
    user.lastLoginAt = new Date();
    await user.save();

    // If 2FA is enabled, require TOTP verification
    if (user.twoFactorEnabled) {
      return {
        requires2fa: true,
        userId: user._id.toString(),
        message: 'Two-factor authentication required. Enter your 6-digit TOTP code.',
      };
    }

    // Otherwise directly generate tokens
    return this.createSessionAndTokens(user, ipAddress, userAgent);
  }

  async verify2Fa(dto: Verify2FaDto, ipAddress?: string, userAgent?: string) {
    const user = await this.userModel.findById(dto.userId).select('+twoFactorSecret');
    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('User or 2FA secret not configured');
    }

    const isValid = authenticator.verify({
      token: dto.token,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired 2FA TOTP code');
    }

    return this.createSessionAndTokens(user, ipAddress, userAgent);
  }

  async refreshTokens(refreshTokenStr: string, ipAddress?: string) {
    if (!refreshTokenStr) {
      throw new BadRequestException('Refresh token is required');
    }

    const tokenHash = this.hashToken(refreshTokenStr);
    const session = await this.sessionModel.findOne({ refreshTokenHash: tokenHash });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Detect Token Reuse
    if (session.isRevoked) {
      // Invalidate all tokens in this family (brute-force defense)
      await this.sessionModel.updateMany({ tokenFamily: session.tokenFamily }, { isRevoked: true });
      this.logger.warn(`Token reuse attack detected! Revoked family: ${session.tokenFamily}`);
      throw new UnauthorizedException('Token reuse detected. Session revoked. Please re-authenticate.');
    }

    // Mark current session token as consumed / revoked
    session.isRevoked = true;
    await session.save();

    const user = await this.userModel.findById(session.userId);
    if (!user || user.status !== SystemStatus.ACTIVE) {
      throw new UnauthorizedException('User account inactive or locked');
    }

    // Issue fresh pair in the same token family
    return this.createSessionAndTokens(user, ipAddress, undefined, session.tokenFamily);
  }

  async logout(userId: string) {
    await this.sessionModel.updateMany({ userId }, { isRevoked: true });
    return { success: true, message: 'Institutional session terminated successfully' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userModel.findById(userId).populate('allowedBranches');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private async createSessionAndTokens(
    user: UserDocument,
    ipAddress?: string,
    device?: string,
    existingFamily?: string
  ) {
    const permissions = this.resolveRolePermissions(user.role);
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?.toString(),
      allowedBranches: (user.allowedBranches || []).map((b) => b.toString()),
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const tokenFamily = existingFamily || crypto.randomUUID();

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.sessionModel.create({
      userId: user._id,
      refreshTokenHash: tokenHash,
      tokenFamily,
      device: device || 'Web Browser',
      ipAddress: ipAddress || '127.0.0.1',
      isRevoked: false,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 900, // 15 mins in seconds
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId?.toString(),
        allowedBranches: (user.allowedBranches || []).map((b) => b.toString()),
        permissions,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private resolveRolePermissions(role: UserRoleType): string[] {
    if (role === UserRoleType.MASTER_ADMIN) {
      return ['*'];
    }

    const perms: Record<UserRoleType, string[]> = {
      [UserRoleType.MASTER_ADMIN]: ['*'],
      [UserRoleType.COUNTRY_ADMIN]: [
        'DASHBOARD:VIEW', 'ORGANIZATION:VIEW', 'CURRENCY:VIEW', 'EXCHANGE_RATE:VIEW',
        'TRADING_BUY:VIEW', 'TRADING_BUY:CREATE', 'TRADING_BUY:APPROVE',
        'TRADING_SELL:VIEW', 'TRADING_SELL:CREATE', 'TRADING_SELL:APPROVE',
        'REMITTANCE:VIEW', 'REMITTANCE:CREATE', 'REMITTANCE:APPROVE',
        'FUND:VIEW', 'BANK:VIEW', 'CASH:VIEW', 'TRANSFERS:VIEW', 'TRANSFERS:APPROVE',
        'ACCOUNTING:VIEW', 'REPORTS:VIEW', 'COMPLIANCE:VIEW', 'CUSTOMER:VIEW', 'SUPPLIER:VIEW',
      ],
      [UserRoleType.BRANCH_ADMIN]: [
        'DASHBOARD:VIEW', 'TRADING_BUY:VIEW', 'TRADING_BUY:CREATE',
        'TRADING_SELL:VIEW', 'TRADING_SELL:CREATE',
        'REMITTANCE:VIEW', 'REMITTANCE:CREATE',
        'FUND:VIEW', 'BANK:VIEW', 'CASH:VIEW', 'TRANSFERS:VIEW',
        'CUSTOMER:VIEW', 'CUSTOMER:CREATE', 'BENEFICIARY:VIEW', 'SUPPLIER:VIEW',
      ],
      [UserRoleType.ACCOUNTANT]: [
        'DASHBOARD:VIEW', 'CURRENCY:VIEW', 'EXCHANGE_RATE:VIEW',
        'TRADING_BUY:VIEW', 'TRADING_SELL:VIEW', 'REMITTANCE:VIEW',
        'FUND:VIEW', 'BANK:VIEW', 'CASH:VIEW', 'TRANSFERS:VIEW',
        'ACCOUNTING:VIEW', 'ACCOUNTING:CREATE', 'ACCOUNTING:APPROVE',
        'RECEIVABLE_PAYABLE:VIEW', 'REPORTS:VIEW',
      ],
      [UserRoleType.AGENT]: [
        'DASHBOARD:VIEW', 'TRADING_BUY:VIEW', 'TRADING_BUY:CREATE',
        'TRADING_SELL:VIEW', 'TRADING_SELL:CREATE',
        'REMITTANCE:VIEW', 'REMITTANCE:CREATE', 'REMITTANCE:EDIT',
        'CUSTOMER:VIEW', 'CUSTOMER:CREATE', 'BENEFICIARY:VIEW', 'BENEFICIARY:CREATE',
      ],
      [UserRoleType.COMPLIANCE_OFFICER]: [
        'DASHBOARD:VIEW', 'REMITTANCE:VIEW', 'CUSTOMER:VIEW', 'BENEFICIARY:VIEW',
        'COMPLIANCE:VIEW', 'COMPLIANCE:APPROVE', 'AUDIT:VIEW', 'REPORTS:VIEW',
      ],
      [UserRoleType.AUDITOR]: [
        'DASHBOARD:VIEW', 'TRADING_BUY:VIEW', 'TRADING_SELL:VIEW', 'REMITTANCE:VIEW',
        'FUND:VIEW', 'BANK:VIEW', 'CASH:VIEW', 'ACCOUNTING:VIEW', 'AUDIT:VIEW', 'REPORTS:VIEW',
      ],
      [UserRoleType.CUSTOM]: ['DASHBOARD:VIEW'],
    };

    return perms[role] || ['DASHBOARD:VIEW'];
  }
}
