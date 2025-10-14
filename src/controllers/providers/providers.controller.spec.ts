import { Test } from '@nestjs/testing';
import { ProvidersService } from '../../service/providers/providers.service';
import { ProvidersController } from './providers.controller';

describe('ProvidersController', () => {
  let controller: ProvidersController;

  const serviceMock: Partial<Record<keyof ProvidersService, jest.Mock>> = {
    create: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findAll: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findOne: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    update: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    remove: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [{ provide: ProvidersService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(ProvidersController);
    jest.clearAllMocks();
  });

  it('GET /providers retorna lista', async () => {
    (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /providers crea', async () => {
    (serviceMock.create as jest.Mock).mockResolvedValue({ id: 1 });
    // usar any para evitar cheques estrictos de tipos en tests
    const res = await controller.create({ name: 'Proveedor' } as any);
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
