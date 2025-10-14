import { LoginsController } from './logins.controller';

describe('LoginsController', () => {
    it('findAll parses query and delegates to service', async () => {
        const svc = {
            findAll: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0, page: 2, limit: 10 }),
        };
        const ctrl = new LoginsController(svc as any);
        const res = await ctrl.findAll('2', '10');
        expect(svc.findAll).toHaveBeenCalledWith(2, 10);
        expect(res.page).toBe(2);
    });

    it('findAll falls back to defaults on invalid query', async () => {
        const svc = {
            findAll: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0, page: 1, limit: 50 }),
        };
        const ctrl = new LoginsController(svc as any);
        const res = await ctrl.findAll('abc', 'def');
        expect(svc.findAll).toHaveBeenCalledWith(1, 50);
        expect(res.page).toBe(1);
    });
});
