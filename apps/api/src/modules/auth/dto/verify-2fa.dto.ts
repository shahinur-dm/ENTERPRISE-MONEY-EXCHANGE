import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FaDto {
  @ApiProperty({ example: 'usr_123...' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  token: string;
}
