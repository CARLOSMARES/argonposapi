import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    rfc: string;
    @ApiProperty()
    @IsString()
    direction: string;
    @ApiProperty()
    @IsNumber()
    phone: number;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}


