import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ventas')
export class ventas {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double' })
    amount: number;

    @Column()
    id_cliente: number;

    @Column()
    id_user: number;

    @Column()
    idventa: string;
}
