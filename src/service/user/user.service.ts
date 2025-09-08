import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {

    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async findOne(id: number): Promise<User> {
        const entity = await this.userRepository.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('User not found');
        return entity;
    }

    async create(payload: CreateUserDto): Promise<User> {
        const entity = this.userRepository.create(payload);
        return this.userRepository.save(entity);
    }

    async update(id: number, payload: UpdateUserDto): Promise<User> {
        const entity = await this.findOne(id);
        Object.assign(entity, payload);
        return this.userRepository.save(entity);
    }

    async remove(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('User not found');
    }

}
