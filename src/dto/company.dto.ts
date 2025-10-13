import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Argon POS S.A. de C.V.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'RFC de la empresa',
    example: 'ARG123456789',
  })
  @IsString()
  rfc: string;

  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Av. Principal 123, Col. Centro, CDMX',
  })
  @IsString()
  direction: string;

  @ApiProperty({
    description: 'Número de teléfono de la empresa',
    example: 5555123456,
  })
  @IsNumber()
  phone: number;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
