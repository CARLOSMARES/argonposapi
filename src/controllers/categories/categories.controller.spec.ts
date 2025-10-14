import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CategoriesService } from '../../service/categories/categories.service';
import { CategoriesController } from './categories.controller';

describe('CategoriesController', () => {
    let controller: CategoriesController;

    const mockService = {
        create: jest.fn().mockResolvedValue({ id: 1 }),
        findAll: jest.fn().mockResolvedValue([]),
        findActive: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        update: jest.fn().mockResolvedValue({ id: 1 }),
        remove: jest.fn().mockResolvedValue(undefined),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [CategoriesController],
            providers: [
                {
                    provide: CategoriesService,
                    useValue: mockService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = moduleRef.get(CategoriesController);
    });

    afterEach(() => jest.clearAllMocks());

    it('create delega al service', async () => {
        const payload = { name: 'c' } as any;
        await expect(controller.create(payload)).resolves.toEqual({ id: 1 });
        expect(mockService.create).toHaveBeenCalledWith(payload);
    });

    it('findAll delega al service', async () => {
        await expect(controller.findAll()).resolves.toEqual([]);
        expect(mockService.findAll).toHaveBeenCalled();
    });

    it('findActive delega al service', async () => {
        await expect(controller.findActive()).resolves.toEqual([]);
        expect(mockService.findActive).toHaveBeenCalled();
    });

    it('findOne delega al service', async () => {
        await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
        expect(mockService.findOne).toHaveBeenCalledWith(1);
    });

    it('update delega al service', async () => {
        const payload = { name: 'x' } as any;
        await expect(controller.update(1, payload)).resolves.toEqual({ id: 1 });
        expect(mockService.update).toHaveBeenCalledWith(1, payload);
    });

    it('remove delega y retorna success true', async () => {
        await expect(controller.remove(1)).resolves.toEqual({ success: true });
        expect(mockService.remove).toHaveBeenCalledWith(1);
    });
});
