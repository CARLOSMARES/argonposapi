import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueuesService {
  constructor(@InjectQueue('invoices') private readonly invoicesQueue: Queue) {}

  async enqueueInvoice(jobName: string, payload: Record<string, any>) {
    return this.invoicesQueue.add(jobName, payload);
  }
}
