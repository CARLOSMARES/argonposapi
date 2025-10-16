import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { categories } from './categories.entity';
import { products } from './products.entity';

@Entity('promotions')
export class promotions {
  @ApiProperty({ example: 1001 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Promo verano' })
  @Column()
  name: string;

  @ApiProperty({ required: false, example: '2x1 en bebidas' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed_amount', 'buy_x_get_y'] })
  @Column({ type: 'enum', enum: ['percentage', 'fixed_amount', 'buy_x_get_y'] })
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';

  @ApiProperty({ example: 10 })
  @Column({ type: 'real' })
  discount_value: number;

  @ApiProperty({ required: false, example: 200 })
  @Column({ type: 'real', nullable: true })
  minimum_amount: number;

  @ApiProperty({ required: false, example: 100 })
  @Column({ type: 'real', nullable: true })
  maximum_discount: number;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z' })
  @Column({ type: 'timestamp' })
  start_date: Date;

  @ApiProperty({ example: '2025-06-30T23:59:59.000Z' })
  @Column({ type: 'timestamp' })
  end_date: Date;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ example: '2025-05-01T12:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ example: '2025-05-10T12:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación con categoría (opcional)
  @ApiProperty({ required: false, example: 5 })
  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => categories, (category) => category.promotions, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: categories;

  // Relación con productos (opcional)
  @ApiProperty({ required: false, example: 101 })
  @Column({ nullable: true })
  product_id: number;

  @ManyToOne(() => products, (product) => product.promotions, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: products;
}
