import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductsDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty({ type: Number, format: 'float' })
    @IsNumber()
    price: number;
    @ApiProperty({ type: Number, format: 'float' })
    @IsNumber()
    pricepublic: number;
    @ApiProperty()
    @IsString()
    description: string;
}

export class UpdateProductsDto extends PartialType(CreateProductsDto) {}


