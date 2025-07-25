import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class products {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column({ type: "real" })
    price: number;

    @Column({ type: "real" })
    pricepublic: number;

    @Column()
    description: string;

}