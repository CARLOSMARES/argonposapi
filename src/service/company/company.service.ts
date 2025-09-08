import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/dto/company.dto';
import { company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(company)
        private readonly companyRepository: Repository<company>
    ) {}

    async create(payload: CreateCompanyDto): Promise<company> {
        const entity = this.companyRepository.create(payload);
        return this.companyRepository.save(entity);
    }

    async findAll(): Promise<company[]> {
        return this.companyRepository.find();
    }

    async findOne(id: number): Promise<company> {
        const entity = await this.companyRepository.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Company not found');
        return entity;
    }

    async update(id: number, payload: UpdateCompanyDto): Promise<company> {
        const entity = await this.findOne(id);
        Object.assign(entity, payload);
        return this.companyRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.companyRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Company not found');
    }
}
