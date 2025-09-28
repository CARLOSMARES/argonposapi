import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductTypesDto, UpdateProductTypesDto } from 'src/dto/product_types.dto';
import { product_types } from 'src/entities/product_types.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTypesService {

    constructor(
        @InjectRepository(product_types)
        private readonly productTypesRepository: Repository<product_types>
    ) {}

    async create(payload: CreateProductTypesDto): Promise<product_types> {
        const entity = this.productTypesRepository.create(payload);
        return this.productTypesRepository.save(entity);
    }

    async findAll(): Promise<product_types[]> {
        return this.productTypesRepository.find({
            where: { is_active: true },
            order: { name: 'ASC' }
        });
    }

    async findOne(id: number): Promise<product_types> {
        const entity = await this.productTypesRepository.findOne({ 
            where: { id },
            relations: ['products']
        });
        if (!entity) throw new NotFoundException('Product type not found');
        return entity;
    }

    async update(id: number, payload: UpdateProductTypesDto): Promise<product_types> {
        const entity = await this.findOne(id);
        Object.assign(entity, payload);
        return this.productTypesRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.productTypesRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Product type not found');
    }

    async findActive(): Promise<product_types[]> {
        return this.productTypesRepository.find({
            where: { is_active: true },
            order: { name: 'ASC' }
        });
    }
}
