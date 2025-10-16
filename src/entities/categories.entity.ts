import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { products } from './products.entity';
import { promotions } from './promotions.entity';

@Entity('categories')
export class categories {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Bebidas' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ required: false, example: 'Refrescos, jugos y agua' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ example: '2025-10-15T12:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ example: '2025-10-15T12:00:00.000Z' })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relación con productos
  @OneToMany(() => products, (product) => product.category)
  products: products[];

  // Relación con promociones
  @OneToMany(() => promotions, (promotion) => promotion.category)
  promotions: promotions[];
}
