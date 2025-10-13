import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuesService } from '../../queues/queues.service';
import { Repository } from 'typeorm';
import { CreateFacturasDto, UpdateFacturasDto } from '../../dto/facturas.dto';
import { facturas } from '../../entities/facturas.entity';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(facturas)
    private readonly facturasRepository: Repository<facturas>,
    @Inject(QueuesService)
    private readonly queuesService: QueuesService,
  ) {}

  async create(payload: CreateFacturasDto): Promise<facturas> {
    const entity = this.facturasRepository.create(payload);
    const saved = await this.facturasRepository.save(entity);
    // Encolar un trabajo de ejemplo
    await this.queuesService.enqueueInvoice('generate-pdf', { id: saved.id });
    return saved;
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
