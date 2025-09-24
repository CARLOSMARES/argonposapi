import { Test } from '@nestjs/testing';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from 'src/service/providers/providers.service';


describe('ProvidersController', () => {
  let controller: ProvidersController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as ProvidersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [
        { provide: ProvidersService, useValue: serviceMock },
      ],
    }).compile();

    controller = moduleRef.get(ProvidersController);
    jest.clearAllMocks();
  });

  it('GET /providers retorna lista', async () => {
    (serviceMock.findAll as any).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /providers crea', async () => {
    (serviceMock.create as any).mockResolvedValue({ id: 1 });
    // @ts-ignore
    const res = await controller.create({ name: 'Proveedor' });
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
