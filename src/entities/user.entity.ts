import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre', example: 'Juan' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Apellido', example: 'Pérez' })
  @Column()
  lastname: string;

  @ApiProperty({ description: 'Usuario', example: 'jperez' })
  @Column()
  username: string;

  @ApiProperty({ description: 'Contraseña', example: 'password123' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Correo', example: 'juan.perez@example.com' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'admin', default: 'user' })
  @Column({ default: 'user' })
  role: string;
}
