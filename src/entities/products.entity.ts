import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { categories } from './categories.entity';
import { product_types } from './product_types.entity';
import { promotions } from './promotions.entity';

@Entity('products')
export class products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'real' })
  pricepublic: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relación con categoría
  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => categories, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: categories;

  // Relación con tipo de producto
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
