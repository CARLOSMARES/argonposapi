import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ventas')
export class ventas {
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 299.99 })
    @Column({ type: 'double' })
    amount: number;

    @ApiProperty({ example: 2001 })
    @Column()
    id_cliente: number;

    @ApiProperty({ example: 7 })
    @Column()
    id_user: number;

    @ApiProperty({ example: 'V-2025-000321' })
    @Column()
    idventa: string;
}
