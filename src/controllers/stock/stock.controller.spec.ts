import { Test } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from 'src/service/stock/stock.service';


describe('StockController', () => {
  let controller: StockController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as StockService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        { provide: StockService, useValue: serviceMock },
      ],
    }).compile();

    controller = moduleRef.get(StockController);
    jest.clearAllMocks();
  });

  it('GET /stock retorna lista', async () => {
    (serviceMock.findAll as any).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /stock crea', async () => {
    (serviceMock.create as any).mockResolvedValue({ id: 1 });
    // @ts-ignore
    const res = await controller.create({ name: 'Item' });
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
