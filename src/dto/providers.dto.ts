import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProvidersDto {
    @ApiProperty({
        description: 'Nombre del proveedor',
        example: 'Distribuidora ABC S.A.'
    })
    @IsString()
    name: string;
    
    @ApiProperty({
        description: 'Número de teléfono del proveedor',
        example: '5555-123-456'
    })
    @IsString()
    phone: string;
    
    @ApiProperty({
        description: 'Nombre del representante del proveedor',
        example: 'Juan Pérez'
    })
    @IsString()
    representante: string;
}

export class UpdateProvidersDto extends PartialType(CreateProvidersDto) {}


