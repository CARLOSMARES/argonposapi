import { Test } from '@nestjs/testing';
import { ProductsService } from '../../service/products/products.service';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  let controller: ProductsController;

  const serviceMock: Partial<Record<keyof ProductsService, jest.Mock>> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(ProductsController);
    jest.clearAllMocks();
  });

  it('GET /products retorna lista', async () => {
    (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /products crea', async () => {
    (serviceMock.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await controller.create({ name: 'Producto' } as Partial<
      import('../../dto/products.dto').CreateProductsDto
    >);
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });

  it('POST /products/upload-photo/:id sube foto', async () => {
    const mockFile = {
      filename: 'product_1_1234567890.jpg',
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
    } as Express.Multer.File;

    const mockUpdatedProduct = {
      id: 1,
      name: 'Producto',
      photo_url: '/fotos/product_1_1234567890.jpg',
    };

    (serviceMock.update as jest.Mock).mockResolvedValue(mockUpdatedProduct);

    const res = await controller.uploadPhoto(1, mockFile);

    expect(serviceMock.update).toHaveBeenCalledWith(1, {
      photo_url: '/fotos/product_1_1234567890.jpg',
    });
    expect(res).toEqual({
      success: true,
      message: 'Foto subida exitosamente',
      photo_url: '/fotos/product_1_1234567890.jpg',
      product: mockUpdatedProduct,
    });
  });
});
