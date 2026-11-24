import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@moneyexchange.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecureAdminPassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'd48e7183-...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
