import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('providers')
export class providers {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Distribuidora XYZ' })
  @Column()
  name: string;

  @ApiProperty({ example: '5555-123456' })
  @Column()
  phone: string;

  @ApiProperty({ example: 'María López' })
  @Column()
  representante: string;
}
