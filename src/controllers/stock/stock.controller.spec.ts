import { Test } from '@nestjs/testing';
import { StockService } from '../../service/stock/stock.service';
import { StockController } from './stock.controller';

describe('StockController', () => {
  let controller: StockController;

  const serviceMock: Partial<Record<keyof StockService, jest.Mock>> = {
    create: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findAll: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findOne: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    update: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    remove: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StockController],
      providers: [{ provide: StockService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(StockController);
    jest.clearAllMocks();
  });

  it('GET /stock retorna lista', async () => {
    (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /stock crea', async () => {
    (serviceMock.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await controller.create({ name: 'Item' } as Partial<
      import('../../dto/stock.dto').CreateStockDto
    >);
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
