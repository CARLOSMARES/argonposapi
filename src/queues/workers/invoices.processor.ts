import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('invoices')
export class InvoicesProcessor extends WorkerHost {
  private readonly logger = new Logger(InvoicesProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'generate-pdf') {
      // Simulación de trabajo pesado
      await new Promise((res) => setTimeout(res, 500));
      return { ok: true, invoiceId: job.data.id };
    }
    return { skipped: true, name: job.name };
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job active: ${job.name} id=${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log(`Job completed: ${job.name} id=${job.id} result=${JSON.stringify(result)}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    const id = job?.id ?? 'unknown';
    const name = job?.name ?? 'unknown';
    this.logger.error(`Job failed: ${name} id=${id} error=${err.message}`);
  }
}


