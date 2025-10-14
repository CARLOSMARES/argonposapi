import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

describe('PromotionsService', () => {
    const repoMock = () => ({
        create: jest.fn((p) => ({ id: 1, ...p })),
        save: jest.fn((e) => Promise.resolve(e)),
        find: jest.fn().mockResolvedValue([{ id: 1 }]),
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
        createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
        })),
    });

    it('create validates dates and works', async () => {
        const repo = repoMock();
        const svc = new PromotionsService(repo as any);

        const payload = { start_date: '2025-01-01', end_date: '2025-01-02' } as any;
        const created = await svc.create(payload);
        expect(created).toHaveProperty('id');
    });

    it('create throws BadRequestException for invalid dates', async () => {
        const repo = repoMock();
        const svc = new PromotionsService(repo as any);
        const payload = { start_date: '2025-01-02', end_date: '2025-01-01' } as any;
        await expect(svc.create(payload)).rejects.toThrow(BadRequestException);
    });

    it('findAll, findActive, findOne, update, remove happy path', async () => {
        const repo = repoMock();
        const svc = new PromotionsService(repo as any);

        const all = await svc.findAll();
        expect(all).toEqual([{ id: 1 }]);

        const active = await svc.findActive();
        expect(active).toEqual([{ id: 1 }]);

        const one = await svc.findOne(1);
        expect(one).toEqual({ id: 1 });

        repo.findOne.mockResolvedValue({
            id: 1,
            start_date: '2025-01-01',
            end_date: '2025-01-02',
        });
        const updated = await svc.update(1, {
            start_date: '2025-01-01',
            end_date: '2025-01-03',
        } as any);
        expect(updated).toHaveProperty('start_date');

        await expect(svc.remove(1)).resolves.toBeUndefined();
    });

    it('findOne throws NotFoundException when not found', async () => {
        const repo = repoMock();
        repo.findOne.mockResolvedValue(null);
        const svc = new PromotionsService(repo as any);
        await expect(svc.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('remove throws NotFoundException when delete affected 0', async () => {
        const repo = repoMock();
        repo.delete.mockResolvedValue({ affected: 0 });
        const svc = new PromotionsService(repo as any);
        await expect(svc.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('findCurrentPromotions, findPromotionsByCategory, findPromotionsByProduct use queryBuilder', async () => {
        const repo = repoMock();
        const svc = new PromotionsService(repo as any);

        const current = await svc.findCurrentPromotions();
        expect(current).toEqual([{ id: 1 }]);

        const byCat = await svc.findPromotionsByCategory(5);
        expect(byCat).toEqual([{ id: 1 }]);

        const byProd = await svc.findPromotionsByProduct(6);
        expect(byProd).toEqual([{ id: 1 }]);
    });
});
