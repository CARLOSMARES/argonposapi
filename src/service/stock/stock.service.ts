import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStockDto, UpdateStockDto } from 'src/dto/stock.dto';
import { stock } from 'src/entities/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockService {

    constructor(
        @InjectRepository(stock)
        private readonly stockRepository: Repository<stock>
    ) {}

    async create(payload: CreateStockDto): Promise<stock> {
        const entity = this.stockRepository.create(payload);
        return this.stockRepository.save(entity);
    }

    async findAll(): Promise<stock[]> {
        return this.stockRepository.find();
    }

    async findOne(id: number): Promise<stock> {
        const entity = await this.stockRepository.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Stock not found');
        return entity;
    }

    async update(id: number, payload: UpdateStockDto): Promise<stock> {
        const entity = await this.findOne(id);
        Object.assign(entity, payload);
        return this.stockRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.stockRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Stock not found');
    }
}
