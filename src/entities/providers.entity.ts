import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('providers')
export class providers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  representante: string;
}
