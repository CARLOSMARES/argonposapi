import { StockService } from './stock.service';

describe('StockService', () => {
    const repoMock = () => ({
        create: jest.fn((p) => ({ id: 1, ...p })),
        save: jest.fn((e) => Promise.resolve(e)),
        find: jest.fn().mockResolvedValue([{ id: 1 }]),
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
    });

    it('happy path', async () => {
        const repo = repoMock();
        const svc = new StockService(repo as any);
        const created = await svc.create({ id_product: 1, quantity: 5 } as any);
        expect(created).toHaveProperty('id');

        const all = await svc.findAll();
        expect(all).toEqual([{ id: 1 }]);

        await expect(svc.findOne(1)).resolves.toEqual({ id: 1 });
        await expect(svc.update(1, { quantity: 3 } as any)).resolves.toHaveProperty(
            'id',
        );
        await expect(svc.remove(1)).resolves.toBeUndefined();
    });

    it('findOne not found', async () => {
        const repo = repoMock();
        repo.findOne.mockResolvedValue(null);
        const svc = new StockService(repo as any);
        await expect(svc.findOne(99)).rejects.toThrow();
    });
});
