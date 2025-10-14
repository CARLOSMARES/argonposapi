import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVentasDto } from '../../dto/ventas.dto';
import { ventas } from '../../entities/ventas.entity';
import { QueuesService } from '../../queues/queues.service';
import { VentasService } from './ventas.service';

describe('VentasService', () => {
    let service: VentasService;
    let repo: Repository<ventas>;
    const repoMock: Partial<Record<keyof Repository<ventas>, jest.Mock>> = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };
    const queuesMock: Partial<Record<keyof QueuesService, jest.Mock>> = {
        enqueueInvoice: jest.fn(),
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                VentasService,
                { provide: getRepositoryToken(ventas), useValue: repoMock },
                { provide: QueuesService, useValue: queuesMock },
            ],
        }).compile();

        service = moduleRef.get(VentasService);
        repo = moduleRef.get(getRepositoryToken(ventas));
        jest.clearAllMocks();
    });

    it('crea y encola notify-sale', async () => {
        const dto = { idventa: 'V-1', amount: 100 } as unknown as CreateVentasDto;
        const created = { id: 1, ...dto } as ventas;
        (repo.create as jest.Mock).mockReturnValue(created);
        (repo.save as jest.Mock).mockResolvedValue({ ...created });

        const saved = await service.create(dto);

        expect(repo.create as jest.Mock).toHaveBeenCalledWith(dto);
        expect(repo.save as jest.Mock).toHaveBeenCalledWith(created);
        expect(queuesMock.enqueueInvoice as jest.Mock).toHaveBeenCalledWith(
            'notify-sale',
            {
                id: 1,
            },
        );
        expect(saved).toEqual(created);
    });

    it('findAll retorna lista', async () => {
        (repo.find as jest.Mock).mockResolvedValue([{ id: 1 }] as ventas[]);
        const res = await service.findAll();
        expect(res).toEqual([{ id: 1 }]);
    });

    it('findOne retorna entidad existente', async () => {
        const item = { id: 5, idventa: 'V-5' } as ventas;
        (repo.findOne as jest.Mock).mockResolvedValue(item);
        const res = await service.findOne(5);
        expect(res).toEqual(item);
    });

    it('update aplica cambios y guarda', async () => {
        const item = { id: 7, idventa: 'V-7' } as ventas;
        (repo.findOne as jest.Mock).mockResolvedValue(item);
        (repo.save as jest.Mock).mockResolvedValue({ ...item, idventa: 'V-7B' });
        const res = await service.update(7, { idventa: 'V-7B' } as any);
        expect(repo.save as jest.Mock).toHaveBeenCalled();
        expect(res.idventa).toBe('V-7B');
    });

    it('findOne lanza NotFoundException si no existe', async () => {
        (repo.findOne as jest.Mock).mockResolvedValue(null);
        await expect(service.findOne(999)).rejects.toThrow('Venta not found');
    });

    it('remove lanza NotFoundException si no afecta filas', async () => {
        (repo.delete as jest.Mock).mockResolvedValue({ affected: 0 });
        await expect(service.remove(123)).rejects.toThrow('Venta not found');
    });
});
