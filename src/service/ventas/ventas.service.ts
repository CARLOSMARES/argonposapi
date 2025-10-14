import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVentasDto, UpdateVentasDto } from '../../dto/ventas.dto';
import { ventas } from '../../entities/ventas.entity';
import { QueuesService } from '../../queues/queues.service';

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(ventas)
        private readonly ventasRepository: Repository<ventas>,
        @Inject(QueuesService)
        private readonly queuesService: QueuesService,
    ) { }

    async create(payload: CreateVentasDto): Promise<ventas> {
        const entity = this.ventasRepository.create(payload as any);
        const saved = (await this.ventasRepository.save(
            entity,
        )) as unknown as ventas;
        // ejemplo: encolar notificación o generación de reporte
        await this.queuesService.enqueueInvoice('notify-sale', { id: saved.id });
        return saved;
    }

    async findAll(): Promise<ventas[]> {
        return this.ventasRepository.find();
    }

    async findOne(id: number): Promise<ventas> {
        const entity = await this.ventasRepository.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Venta not found');
        return entity;
    }

    async update(id: number, payload: UpdateVentasDto): Promise<ventas> {
        const entity = await this.findOne(id);
        Object.assign(entity, payload);
        return this.ventasRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.ventasRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Venta not found');
    }
}
