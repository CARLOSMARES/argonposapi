import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullMQMetricsService } from '../metrics/bullmq-metrics.service';
import { QueuesService } from './queues.service';
import { InvoicesProcessor } from './workers/invoices.processor';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST') ?? '127.0.0.1',
          port: config.get<number>('REDIS_PORT') ?? 6379,
          username: config.get<string>('REDIS_username') ?? undefined,
          password: config.get<string>('REDIS_PASSWORD') ?? undefined,
          db: config.get<number>('REDIS_DB') ?? 0,
        },
        defaultJobOptions: {
          removeOnComplete: true,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: 'invoices' }),
  ],
  providers: [QueuesService, InvoicesProcessor, BullMQMetricsService],
  exports: [QueuesService, BullMQMetricsService, BullModule],
})
export class QueuesModule { }
