import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    lastname: string;
    @ApiProperty()
    @IsString()
    user: string;
    @ApiProperty()
    @IsString()
    password: string;
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}


