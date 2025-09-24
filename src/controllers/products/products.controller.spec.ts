import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from 'src/service/products/products.service';


describe('ProductsController', () => {
  let controller: ProductsController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as ProductsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: serviceMock },
      ],
    }).compile();

    controller = moduleRef.get(ProductsController);
    jest.clearAllMocks();
  });

  it('GET /products retorna lista', async () => {
    (serviceMock.findAll as any).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /products crea', async () => {
    (serviceMock.create as any).mockResolvedValue({ id: 1 });
    // @ts-ignore
    const res = await controller.create({ name: 'Producto' });
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
