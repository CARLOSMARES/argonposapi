import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("stock")
export class stock {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_product: number;

    @Column()
    minstock: number;

    @Column()
    stock: number;

}