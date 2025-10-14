import { LoginsService } from './logins.service';

describe('LoginsService', () => {
    const repoMock = () => ({
        findAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
    });

    it('findAll returns paginated result with defaults', async () => {
        const repo = repoMock();
        const svc = new LoginsService(repo as any);
        const res = await svc.findAll();
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('total', 1);
        expect(res.page).toBe(1);
    });

    it('findAll respects page and limit and caps limit to 100', async () => {
        const repo = repoMock();
        const svc = new LoginsService(repo as any);
        await svc.findAll(2, 200);
        expect(repo.findAndCount).toHaveBeenCalled();
    });
});
