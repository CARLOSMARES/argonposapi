import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateFacturasDto {
    @ApiProperty({ type: Number, format: 'double' })
    @IsNumber()
    amount: number;
    @ApiProperty()
    @IsInt()
    id_cliente: number;
    @ApiProperty()
    @IsInt()
    id_user: number;
    @ApiProperty()
    @IsString()
    idfactura: string;
}

export class UpdateFacturasDto extends PartialType(CreateFacturasDto) {}


