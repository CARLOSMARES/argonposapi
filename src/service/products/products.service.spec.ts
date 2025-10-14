import { ProductsService } from './products.service';

describe('ProductsService', () => {
    const repoMock = () => ({
        create: jest.fn((p) => ({ id: 1, ...p })),
        save: jest.fn((e) => Promise.resolve(e)),
        find: jest.fn().mockResolvedValue([{ id: 1 }]),
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
    });

    it('create, findAll, findOne, update, remove happy path', async () => {
        const repo = repoMock();
        const svc = new ProductsService(repo as any);
        const created = await svc.create({ name: 'p' } as any);
        expect(created).toHaveProperty('id');

        const all = await svc.findAll();
        expect(all).toEqual([{ id: 1 }]);

        const one = await svc.findOne(1);
        expect(one).toEqual({ id: 1 });

        repo.findOne.mockResolvedValue({ id: 1, name: 'p' });
        const updated = await svc.update(1, { name: 'x' } as any);
        expect(updated).toHaveProperty('name');

        await expect(svc.remove(1)).resolves.toBeUndefined();
    });

    it('findOne throws NotFoundException', async () => {
        const repo = repoMock();
        repo.findOne.mockResolvedValue(null);
        const svc = new ProductsService(repo as any);
        await expect(svc.findOne(99)).rejects.toThrow();
    });
});
