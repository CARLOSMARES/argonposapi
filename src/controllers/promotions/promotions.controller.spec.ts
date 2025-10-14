import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PromotionsService } from '../../service/promotions/promotions.service';
import { PromotionsController } from './promotions.controller';

describe('PromotionsController', () => {
    let controller: PromotionsController;

    const mockService = {
        create: jest.fn().mockResolvedValue({ id: 1 }),
        findAll: jest.fn().mockResolvedValue([]),
        findCurrentPromotions: jest.fn().mockResolvedValue([]),
        findPromotionsByCategory: jest.fn().mockResolvedValue([]),
        findPromotionsByProduct: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        update: jest.fn().mockResolvedValue({ id: 1 }),
        remove: jest.fn().mockResolvedValue(undefined),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [PromotionsController],
            providers: [
                {
                    provide: PromotionsService,
                    useValue: mockService,
                },
            ],
        })
            // bypass guards by overriding guard provider
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = moduleRef.get(PromotionsController);
    });

    afterEach(() => jest.clearAllMocks());

    it('create delega al service', async () => {
        const payload = { name: 'promo' } as any;
        await expect(controller.create(payload)).resolves.toEqual({ id: 1 });
        expect(mockService.create).toHaveBeenCalledWith(payload);
    });

    it('findAll delega al service', async () => {
        await expect(controller.findAll()).resolves.toEqual([]);
        expect(mockService.findAll).toHaveBeenCalled();
    });

    it('findCurrentPromotions delega al service', async () => {
        await expect(controller.findCurrentPromotions()).resolves.toEqual([]);
        expect(mockService.findCurrentPromotions).toHaveBeenCalled();
    });

    it('findPromotionsByCategory delega con parseInt', async () => {
        await expect(controller.findPromotionsByCategory(5)).resolves.toEqual([]);
        expect(mockService.findPromotionsByCategory).toHaveBeenCalledWith(5);
    });

    it('findPromotionsByProduct delega con parseInt', async () => {
        await expect(controller.findPromotionsByProduct(7)).resolves.toEqual([]);
        expect(mockService.findPromotionsByProduct).toHaveBeenCalledWith(7);
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
