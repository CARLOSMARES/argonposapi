import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductTypesDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class UpdateProductTypesDto extends PartialType(CreateProductTypesDto) {}
