import { QueuesService } from './queues.service';

describe('QueuesService', () => {
    it('enqueueInvoice delega a queue.add', async () => {
        const q = { add: jest.fn().mockResolvedValue({ id: 'job1' }) } as any;
        const s = new QueuesService(q);
        const res = await s.enqueueInvoice('generate-pdf', { id: 1 });
        expect(q.add).toHaveBeenCalledWith('generate-pdf', { id: 1 });
        expect(res).toEqual({ id: 'job1' });
    });
});
