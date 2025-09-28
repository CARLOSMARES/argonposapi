import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { products } from "./products.entity";
import { categories } from "./categories.entity";

@Entity("promotions")
export class promotions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'enum', enum: ['percentage', 'fixed_amount', 'buy_x_get_y'] })
    type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';

    @Column({ type: 'real' })
    discount_value: number;

    @Column({ type: 'real', nullable: true })
    minimum_amount: number;

    @Column({ type: 'real', nullable: true })
    maximum_discount: number;

    @Column({ type: 'timestamp' })
    start_date: Date;

    @Column({ type: 'timestamp' })
    end_date: Date;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // Relación con categoría (opcional)
    @Column({ nullable: true })
    category_id: number;

    @ManyToOne(() => categories, category => category.promotions, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category: categories;

    // Relación con productos (opcional)
    @Column({ nullable: true })
    product_id: number;

    @ManyToOne(() => products, product => product.promotions, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: products;
}
