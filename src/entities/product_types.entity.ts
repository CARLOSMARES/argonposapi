import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { products } from './products.entity';

@Entity('product_types')
export class product_types {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Bebida' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ required: false, example: 'Productos líquidos para consumo' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ example: '2025-10-15T12:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ example: '2025-10-15T12:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación con productos
  @OneToMany(() => products, (product) => product.product_type)
  products: products[];
}
