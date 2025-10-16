import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsHexColor, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

export class UpdateSettingsDto {
    @ApiProperty({ required: false, description: 'Nombre de la empresa' })
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiProperty({ required: false, description: 'URL del logo' })
    @IsOptional()
    @IsUrl()
    logoUrl?: string;

    @ApiProperty({ required: false, description: 'Color primario (hex)' })
    @IsOptional()
    @IsHexColor()
    primaryColor?: string;

    @ApiProperty({ required: false, description: 'Color secundario (hex)' })
    @IsOptional()
    @IsHexColor()
    secondaryColor?: string;

    @ApiProperty({ required: false, description: 'Color de acento (hex)' })
    @IsOptional()
    @IsHexColor()
    accentColor?: string;

    @ApiProperty({ required: false, description: 'Color de fondo (hex)' })
    @IsOptional()
    @IsHexColor()
    backgroundColor?: string;

    @ApiProperty({ required: false, description: 'Color de texto (hex)' })
    @IsOptional()
    @IsHexColor()
    textColor?: string;

    @ApiProperty({ required: false, description: 'Configuraciones para web' })
    @IsOptional()
    @IsObject()
    webConfig?: Record<string, unknown>;

    @ApiProperty({ required: false, description: 'Configuraciones para móvil' })
    @IsOptional()
    @IsObject()
    mobileConfig?: Record<string, unknown>;

    @ApiProperty({ required: false, description: 'Menú web con permisos por rol', type: () => [MenuItemDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MenuItemDto)
    menuWeb?: MenuItemDto[];

    @ApiProperty({ required: false, description: 'Menú móvil con permisos por rol', type: () => [MenuItemDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MenuItemDto)
    menuMobile?: MenuItemDto[];
}

export class PartialUpdateSettingsDto extends PartialType(UpdateSettingsDto) { }

export class MenuItemDto {
    @ApiProperty({ description: 'Clave única del item' })
    @IsString()
    key: string;

    @ApiProperty({ description: 'Etiqueta para mostrar' })
    @IsString()
    label: string;

    @ApiProperty({ required: false, description: 'Icono opcional' })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiProperty({ required: false, description: 'Roles permitidos para ver este item' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roles?: string[];

    @ApiProperty({ required: false, description: 'Si el item está habilitado' })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;
}


