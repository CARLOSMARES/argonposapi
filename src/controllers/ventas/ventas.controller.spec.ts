import { Test } from '@nestjs/testing';
import { QueuesService } from '../../queues/queues.service';
import { VentasService } from '../../service/ventas/ventas.service';
import { VentasController } from './ventas.controller';

describe('VentasController', () => {
    let controller: VentasController;

    const serviceMock: Partial<Record<keyof VentasService, jest.Mock>> = {
        create: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
        findAll: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
        findOne: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
        update: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
        remove: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    };
    const queuesMock: Partial<Record<keyof QueuesService, jest.Mock>> = {
        enqueueInvoice: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [VentasController],
            providers: [
                { provide: VentasService, useValue: serviceMock },
                { provide: QueuesService, useValue: queuesMock },
            ],
        }).compile();

        controller = moduleRef.get(VentasController);
        jest.clearAllMocks();
    });

    it('GET /ventas retorna lista', async () => {
        (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
        const res = await controller.findAll();
        expect(res).toEqual([{ id: 1 }]);
    });

    it('POST /ventas crea venta y encola', async () => {
        (serviceMock.create as jest.Mock).mockResolvedValue({ id: 2 });
        const res = await controller.create({ idventa: 'V-1' } as any);
        expect(serviceMock.create).toHaveBeenCalled();
        expect(res).toEqual({ id: 2 });
    });

    it('GET /ventas/:id retorna venta', async () => {
        (serviceMock.findOne as jest.Mock).mockResolvedValue({ id: 3 });
        const res = await controller.findOne(3 as any);
        expect(serviceMock.findOne).toHaveBeenCalledWith(3);
        expect(res).toEqual({ id: 3 });
    });

    it('PATCH /ventas/:id actualiza y retorna entidad', async () => {
        (serviceMock.update as jest.Mock).mockResolvedValue({
            id: 4,
            idventa: 'V-4B',
        });
        const res = await controller.update(4 as any, { idventa: 'V-4B' } as any);
        expect(serviceMock.update).toHaveBeenCalledWith(4, { idventa: 'V-4B' });
        expect(res).toEqual({ id: 4, idventa: 'V-4B' });
    });

    it('DELETE /ventas/:id llama al servicio y retorna success', async () => {
        (serviceMock.remove as jest.Mock).mockResolvedValue(undefined);
        const res = await controller.remove(10 as any);
        expect(serviceMock.remove).toHaveBeenCalledWith(10);
        expect(res).toEqual({ success: true });
    });
});
