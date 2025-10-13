import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login } from '../entities/login.entity';

@Injectable()
export class LoginsService {
  constructor(
    @InjectRepository(Login)
    private readonly loginRepo: Repository<Login>,
  ) { }

  async findAll(page = 1, limit = 50) {
    const take = Math.min(limit, 100);
    const skip = (Math.max(page, 1) - 1) * take;
    const [data, total] = await this.loginRepo.findAndCount({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take,
      skip,
    });
    return { data, total, page, limit: take };
  }
}
