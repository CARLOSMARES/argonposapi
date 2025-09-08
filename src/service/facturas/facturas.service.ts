import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFacturasDto, UpdateFacturasDto } from 'src/dto/facturas.dto';
import { facturas } from 'src/entities/facturas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacturasService {

    constructor(
        @InjectRepository(facturas)
        private readonly facturasRepository: Repository<facturas>
    ) {}

    async create(payload: CreateFacturasDto): Promise<facturas> {
        const entity = this.facturasRepository.create(payload);
        return this.facturasRepository.save(entity);
    }

    async findAll(): Promise<facturas[]> {
        return this.facturasRepository.find();
    }

    async findOne(id: number): Promise<facturas> {
        const entity = await this.facturasRepository.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Factura not found');
        return entity;
    }

    async update(id: number, payload: UpdateFacturasDto): Promise<facturas> {
        const entity = await this.findOne(id);
        Object.assign(entity, payload);
        return this.facturasRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.facturasRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Factura not found');
    }
}
