import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProvidersDto,
  UpdateProvidersDto,
} from '../../dto/providers.dto';
import { providers } from '../../entities/providers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(providers)
    private readonly providersRepository: Repository<providers>,
  ) {}

  async create(payload: CreateProvidersDto): Promise<providers> {
    const entity = this.providersRepository.create(payload);
    return this.providersRepository.save(entity);
  }

  async findAll(): Promise<providers[]> {
    return this.providersRepository.find();
  }

  async findOne(id: number): Promise<providers> {
    const entity = await this.providersRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Provider not found');
    return entity;
  }

  async update(id: number, payload: UpdateProvidersDto): Promise<providers> {
    const entity = await this.findOne(id);
    Object.assign(entity, payload);
    return this.providersRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.providersRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Provider not found');
  }
}
