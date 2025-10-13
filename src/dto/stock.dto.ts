import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsInt()
  id_product: number;

  @ApiProperty({
    description: 'Stock mínimo del producto',
    example: 10,
  })
  @IsInt()
  minstock: number;

  @ApiProperty({
    description: 'Cantidad actual en stock',
    example: 50,
  })
  @IsInt()
  stock: number;
}

export class UpdateStockDto extends PartialType(CreateStockDto) {}
