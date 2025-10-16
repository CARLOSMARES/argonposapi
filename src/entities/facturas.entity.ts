import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('facturas')
export class facturas {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1234.56 })
  @Column({ type: 'double' })
  amount: number;

  @ApiProperty({ example: 2001 })
  @Column()
  id_cliente: number;

  @ApiProperty({ example: 7 })
  @Column()
  id_user: number;

  @ApiProperty({ example: 'F-2025-000123' })
  @Column()
  idfactura: string;
}
