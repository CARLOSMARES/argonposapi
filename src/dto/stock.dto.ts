import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateStockDto {
    @ApiProperty()
    @IsInt()
    id_product: number;
    @ApiProperty()
    @IsInt()
    minstock: number;
    @ApiProperty()
    @IsInt()
    stock: number;
}

export class UpdateStockDto extends PartialType(CreateStockDto) {}


