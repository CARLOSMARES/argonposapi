import { BullMQMetricsService } from './bullmq-metrics.service';

describe('BullMQMetricsService', () => {
    const makeQueue = (overrides: any = {}) => ({
        getWaiting: jest.fn().mockResolvedValue(overrides.waiting ?? []),
        getActive: jest.fn().mockResolvedValue(overrides.active ?? []),
        getFailed: jest.fn().mockResolvedValue(overrides.failed ?? []),
        getDelayed: jest.fn().mockResolvedValue(overrides.delayed ?? []),
    });

    it('getQueueStats devuelve conteos correctamente', async () => {
        const q = makeQueue({
            waiting: [1],
            active: [2, 3],
            failed: [],
            delayed: [4],
        });
        const srv = new BullMQMetricsService(q as any);
        const stats = await srv.getQueueStats();
        expect(stats).toEqual(
            expect.objectContaining({
                queue: 'invoices',
                waiting: 1,
                active: 2,
                failed: 0,
                delayed: 1,
                total: 4,
            }),
        );
    });

    it('getQueueStats retorna null en error', async () => {
        const q = makeQueue();
        q.getWaiting.mockRejectedValue(new Error('boom'));
        const srv = new BullMQMetricsService(q as any);
        const stats = await srv.getQueueStats();
        expect(stats).toBeNull();
    });

    it('recordJobDuration y recordJobEvent no lanzan errores', () => {
        const q = makeQueue();
        const srv = new BullMQMetricsService(q as any);
        expect(() => srv.recordJobDuration('invoices', 'job1', 0.5)).not.toThrow();
        expect(() =>
            srv.recordJobEvent('invoices', 'job1', 'active'),
        ).not.toThrow();
    });

    it('getQueueStats con colas vacías devuelve zeros', async () => {
        const q = makeQueue({ waiting: [], active: [], failed: [], delayed: [] });
        const srv = new BullMQMetricsService(q as any);
        const stats = await srv.getQueueStats();
        expect(stats).not.toBeNull();
        expect((stats as any).total).toBe(0);
    });

    it('recordJobEvent acepta diferentes estados', () => {
        const q = makeQueue();
        const srv = new BullMQMetricsService(q as any);
        expect(() =>
            srv.recordJobEvent('invoices', 'job2', 'completed'),
        ).not.toThrow();
        expect(() =>
            srv.recordJobEvent('invoices', 'job3', 'failed'),
        ).not.toThrow();
    });

    it('updateQueueMetrics actualiza gauges sin errores', async () => {
        const q = makeQueue({
            waiting: [1, 2],
            active: [3],
            failed: [],
            delayed: [4],
        });
        const srv = new BullMQMetricsService(q as any);
        // llamar al método privado por acceso vía any para cubrir la ruta
        await (srv as any).updateQueueMetrics();
        // Si llegó aquí sin lanzar, consideramos la cobertura satisfactoria
        expect(q.getWaiting).toHaveBeenCalled();
        expect(q.getActive).toHaveBeenCalled();
        expect(q.getFailed).toHaveBeenCalled();
        expect(q.getDelayed).toHaveBeenCalled();
    });

    it('updateQueueMetrics maneja errores y no lanza', async () => {
        const q = makeQueue();
        q.getWaiting.mockRejectedValue(new Error('boom'));
        const srv = new BullMQMetricsService(q as any);
        // ejecutar y esperar que no propague la excepción
        await expect((srv as any).updateQueueMetrics()).resolves.toBeUndefined();
    });
});
