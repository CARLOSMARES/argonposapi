import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { products } from "./products.entity";

@Entity("product_types")
export class product_types {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // Relación con productos
    @OneToMany(() => products, product => product.product_type)
    products: products[];
}
