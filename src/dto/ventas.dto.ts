import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateVentasDto {
    @ApiProperty({ type: Number, format: 'double', example: 200.0 })
    @IsNumber()
    amount: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    id_cliente: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    id_user: number;

    @ApiProperty({ example: 'V-2025-001' })
    @IsString()
    idventa: string;
}

export class UpdateVentasDto extends PartialType(CreateVentasDto) { }
