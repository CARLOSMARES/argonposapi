import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProvidersDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    phone: string;
    @ApiProperty()
    @IsString()
    representante: string;
}

export class UpdateProvidersDto extends PartialType(CreateProvidersDto) {}


