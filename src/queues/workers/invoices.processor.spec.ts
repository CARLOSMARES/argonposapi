import { InvoicesProcessor } from './invoices.processor';

describe('InvoicesProcessor', () => {
    const metricsMock = () => ({
        recordJobDuration: jest.fn(),
        recordJobEvent: jest.fn(),
    });

    it('process handles generate-pdf and records duration', async () => {
        const metrics = metricsMock();
        const proc = new InvoicesProcessor(metrics as any);

        const job: any = { name: 'generate-pdf', data: { id: 10 } };
        const res = await proc.process(job);
        expect(res).toEqual({ ok: true, invoiceId: 10 });
        expect(metrics.recordJobDuration).toHaveBeenCalled();
    });

    it('process skips unknown job and records duration', async () => {
        const metrics = metricsMock();
        const proc = new InvoicesProcessor(metrics as any);
        const job: any = { name: 'other', data: {} };
        const res = await proc.process(job);
        expect(res).toEqual({ skipped: true, name: 'other' });
        expect(metrics.recordJobDuration).toHaveBeenCalled();
    });

    it('onActive/onCompleted call recordJobEvent', () => {
        const metrics = metricsMock();
        const proc = new InvoicesProcessor(metrics as any);
        const job: any = { name: 'generate-pdf', id: 5 };
        proc.onActive(job);
        proc.onCompleted(job, { ok: true });
        expect(metrics.recordJobEvent).toHaveBeenCalledTimes(2);
    });

    it('onFailed handles missing job gracefully and records failed when job present', () => {
        const metrics = metricsMock();
        const proc = new InvoicesProcessor(metrics as any);
        const err = new Error('boom');
        proc.onFailed(undefined, err);
        expect(metrics.recordJobEvent).not.toHaveBeenCalled();

        const job: any = { name: 'generate-pdf', id: 6 };
        proc.onFailed(job, err);
        expect(metrics.recordJobEvent).toHaveBeenCalledWith(
            'invoices',
            'generate-pdf',
            'failed',
        );
    });
});
