import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductsDto, UpdateProductsDto } from 'src/dto/products.dto';
import { products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(products)
        private readonly productsRepository: Repository<products>
    ) {}

    async create(payload: CreateProductsDto): Promise<products> {
        const entity = this.productsRepository.create(payload);
        return this.productsRepository.save(entity);
    }

    async findAll(): Promise<products[]> {
        return this.productsRepository.find();
    }

    async findOne(id: number): Promise<products> {
        const entity = await this.productsRepository.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Product not found');
        return entity;
    }

    async update(id: number, payload: UpdateProductsDto): Promise<products> {
        const entity = await this.findOne(id);
        Object.assign(entity, payload);
        return this.productsRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.productsRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Product not found');
    }
}
