import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCategoriesDto,
  UpdateCategoriesDto,
} from '../../dto/categories.dto';
import { categories } from '../../entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(categories)
    private readonly categoriesRepository: Repository<categories>,
  ) { }

  async create(payload: CreateCategoriesDto): Promise<categories> {
    const entity = this.categoriesRepository.create(payload);
    return this.categoriesRepository.save(entity);
  }

  async findAll(): Promise<categories[]> {
    return this.categoriesRepository.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<categories> {
    const entity = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!entity) throw new NotFoundException('Category not found');
    return entity;
  }

  async update(id: number, payload: UpdateCategoriesDto): Promise<categories> {
    const entity = await this.findOne(id);
    Object.assign(entity, payload);
    return this.categoriesRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Category not found');
  }

  async findActive(): Promise<categories[]> {
    return this.categoriesRepository.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }
}
