import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company')
export class company {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Argon POS S.A. de C.V.' })
  @Column()
  name: string;

  @ApiProperty({ example: 'ARG123456789' })
  @Column()
  rfc: string;

  @ApiProperty({ example: 'Av. Principal 123, Col. Centro, CDMX' })
  @Column()
  direction: string;

  @ApiProperty({ example: 5555123456 })
  @Column()
  phone: number;
}
