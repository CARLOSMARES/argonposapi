import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePromotionsDto, UpdatePromotionsDto } from 'src/dto/promotions.dto';
import { promotions } from 'src/entities/promotions.entity';
import { Repository, Between } from 'typeorm';

@Injectable()
export class PromotionsService {

    constructor(
        @InjectRepository(promotions)
        private readonly promotionsRepository: Repository<promotions>
    ) {}

    async create(payload: CreatePromotionsDto): Promise<promotions> {
        // Validar fechas
        const startDate = new Date(payload.start_date);
        const endDate = new Date(payload.end_date);
        
        if (startDate >= endDate) {
            throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        const entity = this.promotionsRepository.create({
            ...payload,
            start_date: startDate,
            end_date: endDate
        });
        return this.promotionsRepository.save(entity);
    }

    async findAll(): Promise<promotions[]> {
        return this.promotionsRepository.find({
            where: { is_active: true },
            order: { start_date: 'DESC' },
            relations: ['category', 'product']
        });
    }

    async findOne(id: number): Promise<promotions> {
        const entity = await this.promotionsRepository.findOne({ 
            where: { id },
            relations: ['category', 'product']
        });
        if (!entity) throw new NotFoundException('Promotion not found');
        return entity;
    }

    async update(id: number, payload: UpdatePromotionsDto): Promise<promotions> {
        const entity = await this.findOne(id);
        
        // Validar fechas si se proporcionan
        if (payload.start_date && payload.end_date) {
            const startDate = new Date(payload.start_date);
            const endDate = new Date(payload.end_date);
            
            if (startDate >= endDate) {
                throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
            }
            
            payload.start_date = startDate.toISOString();
            payload.end_date = endDate.toISOString();
        }

        Object.assign(entity, payload);
        return this.promotionsRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.promotionsRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Promotion not found');
    }

    async findActive(): Promise<promotions[]> {
        const now = new Date();
        return this.promotionsRepository.find({
            where: { 
                is_active: true,
                start_date: Between(now, now) // Esto necesita ser corregido
            },
            order: { start_date: 'DESC' },
            relations: ['category', 'product']
        });
    }

    async findCurrentPromotions(): Promise<promotions[]> {
        const now = new Date();
        return this.promotionsRepository
            .createQueryBuilder('promotion')
            .leftJoinAndSelect('promotion.category', 'category')
            .leftJoinAndSelect('promotion.product', 'product')
            .where('promotion.is_active = :isActive', { isActive: true })
            .andWhere('promotion.start_date <= :now', { now })
            .andWhere('promotion.end_date >= :now', { now })
            .orderBy('promotion.start_date', 'DESC')
            .getMany();
    }

    async findPromotionsByCategory(categoryId: number): Promise<promotions[]> {
        const now = new Date();
        return this.promotionsRepository
            .createQueryBuilder('promotion')
            .leftJoinAndSelect('promotion.category', 'category')
            .leftJoinAndSelect('promotion.product', 'product')
            .where('promotion.is_active = :isActive', { isActive: true })
            .andWhere('promotion.start_date <= :now', { now })
            .andWhere('promotion.end_date >= :now', { now })
            .andWhere('promotion.category_id = :categoryId', { categoryId })
            .orderBy('promotion.start_date', 'DESC')
            .getMany();
    }

    async findPromotionsByProduct(productId: number): Promise<promotions[]> {
        const now = new Date();
        return this.promotionsRepository
            .createQueryBuilder('promotion')
            .leftJoinAndSelect('promotion.category', 'category')
            .leftJoinAndSelect('promotion.product', 'product')
            .where('promotion.is_active = :isActive', { isActive: true })
            .andWhere('promotion.start_date <= :now', { now })
            .andWhere('promotion.end_date >= :now', { now })
            .andWhere('promotion.product_id = :productId', { productId })
            .orderBy('promotion.start_date', 'DESC')
            .getMany();
    }
}
