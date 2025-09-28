import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

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

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    photo_url?: string;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiProperty({ required: false, type: Number })
    @IsOptional()
    @IsNumber()
    category_id?: number;

    @ApiProperty({ required: false, type: Number })
    @IsOptional()
    @IsNumber()
    product_type_id?: number;
}

export class UpdateProductsDto extends PartialType(CreateProductsDto) {}


