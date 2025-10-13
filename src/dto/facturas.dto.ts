import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateFacturasDto {
  @ApiProperty({
    type: Number,
    format: 'double',
    description: 'Monto total de la factura',
    example: 150.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'ID del cliente',
    example: 1,
  })
  @IsInt()
  id_cliente: number;

  @ApiProperty({
    description: 'ID del usuario que crea la factura',
    example: 1,
  })
  @IsInt()
  id_user: number;

  @ApiProperty({
    description: 'Número único de la factura',
    example: 'FAC-2024-001',
  })
  @IsString()
  idfactura: string;
}

export class UpdateFacturasDto extends PartialType(CreateFacturasDto) {}
