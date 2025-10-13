import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('facturas')
export class facturas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double' })
  amount: number;

  @Column()
  id_cliente: number;

  @Column()
  id_user: number;

  @Column()
  idfactura: string;
}
