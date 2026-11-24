import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { Verify2FaDto } from './dto/verify-2fa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthSessionPayload } from '@erp/types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Institutional login with email and password' })
  @ApiResponse({ status: 200, description: 'Authenticated or 2FA challenge triggered' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(loginDto, ip, userAgent);
  }

  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify TOTP Two-Factor Authentication' })
  @ApiResponse({ status: 200, description: 'Tokens issued upon successful 2FA code' })
  async verify2Fa(@Body() verify2FaDto: Verify2FaDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.verify2Fa(verify2FaDto, ip, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and obtain new access token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.authService.refreshTokens(refreshTokenDto.refreshToken, ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Terminate active user session' })
  async logout(@CurrentUser() user: AuthSessionPayload) {
    return this.authService.logout(user.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user session details and permissions' })
  async getMe(@CurrentUser() user: AuthSessionPayload) {
    return this.authService.getCurrentUser(user.userId);
  }
}
