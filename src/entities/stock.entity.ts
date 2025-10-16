import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock')
export class stock {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 101 })
  @Column()
  id_product: number;

  @ApiProperty({ example: 5 })
  @Column()
  minstock: number;

  @ApiProperty({ example: 25 })
  @Column()
  stock: number;
}
