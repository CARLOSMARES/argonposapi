import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { categories } from './categories.entity';
import { product_types } from './product_types.entity';
import { promotions } from './promotions.entity';

@Entity('products')
export class products {
  @ApiProperty({ example: 101 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Coca-Cola 600ml' })
  @Column()
  name: string;

  @ApiProperty({ example: 15.5 })
  @Column({ type: 'real' })
  price: number;

  @ApiProperty({ example: 18.0 })
  @Column({ type: 'real' })
  pricepublic: number;

  @ApiProperty({ example: 'Refresco de cola en botella de 600ml' })
  @Column()
  description: string;

  @ApiProperty({ required: false, example: '/fotos/product_101_1700000000000.jpg' })
  @Column({ nullable: true })
  photo_url: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ example: '2025-10-15T12:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ example: '2025-10-15T12:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación con categoría
  @ApiProperty({ required: false, example: 5 })
  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => categories, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: categories;

  // Relación con tipo de producto
  @ApiProperty({ required: false, example: 2 })
  @Column({ nullable: true })
  product_type_id: number;

  @ManyToOne(() => product_types, (product_type) => product_type.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_type_id' })
  product_type: product_types;

  // Relación con promociones
  @OneToMany(() => promotions, (promotion) => promotion.product)
  promotions: promotions[];
}
