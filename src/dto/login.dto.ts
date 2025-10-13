import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateLoginDto {
  @ApiProperty({ description: 'Id del usuario', example: 1 })
  userId: number;

  @ApiProperty({
    description: 'IP de la solicitud',
    example: '127.0.0.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ip?: string;
}
