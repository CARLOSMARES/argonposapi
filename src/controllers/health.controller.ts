import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { DataSource } from 'typeorm';
import { Public } from '../auth/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    @InjectQueue('invoices') private readonly invoicesQueue: Queue,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) { }

  @Public()
  @Get()
  async check() {
    const client = await this.invoicesQueue.client;
    const redisOk = await client.ping();

    try {
      await this.dataSource.query('SELECT 1');
    } catch (err: unknown) {
      const errorObj = err as { message?: unknown } | null;
      const errorMsg =
        errorObj && typeof errorObj.message === 'string'
          ? errorObj.message
          : typeof err === 'object' && err !== null
            ? JSON.stringify(err)
            : String(err);

      return {
        status: 'degraded',
        redis: redisOk,
        db: false,
        error: errorMsg,
      };
    }

    return { status: 'ok', redis: redisOk, db: true };
  }
}
