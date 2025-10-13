import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company')
export class company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rfc: string;

  @Column()
  direction: string;

  @Column()
  phone: number;
}
