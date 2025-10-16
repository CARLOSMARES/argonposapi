import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'jperez',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, description: 'Rol del usuario (admin, user, etc.)', example: 'admin' })
  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }
