import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectQueue('invoices') private readonly invoicesQueue: Queue,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @Get()
  async check() {
    const client = await this.invoicesQueue.client;
    const redisOk = await client.ping();

    try {
      await this.dataSource.query('SELECT 1');
    } catch (e) {
      return {
        status: 'degraded',
        redis: redisOk,
        db: false,
        error: String(e?.message ?? e),
      };
    }

    return { status: 'ok', redis: redisOk, db: true };
  }
}


