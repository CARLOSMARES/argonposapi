import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
    const repoMock = () => ({
        create: jest.fn((p) => ({ id: 1, ...p })),
        save: jest.fn((e) => Promise.resolve(e)),
        find: jest.fn().mockResolvedValue([{ id: 1 }]),
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
    });

    it('create, findAll, findActive, findOne, update, remove happy path', async () => {
        const repo = repoMock();
        const svc = new CategoriesService(repo as any);

        const created = await svc.create({ name: 'cat' } as any);
        expect(created).toHaveProperty('id');

        const all = await svc.findAll();
        expect(all).toEqual([{ id: 1 }]);

        const active = await svc.findActive();
        expect(active).toEqual([{ id: 1 }]);

        const one = await svc.findOne(1);
        expect(one).toEqual({ id: 1 });

        repo.findOne.mockResolvedValue({ id: 1, name: 'cat' });
        const updated = await svc.update(1, { name: 'x' } as any);
        expect(updated).toHaveProperty('name');

        await expect(svc.remove(1)).resolves.toBeUndefined();
    });

    it('findOne throws NotFoundException when not found', async () => {
        const repo = repoMock();
        repo.findOne.mockResolvedValue(null);
        const svc = new CategoriesService(repo as any);
        await expect(svc.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('remove throws NotFoundException when delete affected 0', async () => {
        const repo = repoMock();
        repo.delete.mockResolvedValue({ affected: 0 });
        const svc = new CategoriesService(repo as any);
        await expect(svc.remove(99)).rejects.toThrow(NotFoundException);
    });
});
