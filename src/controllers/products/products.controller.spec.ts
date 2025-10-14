import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ProductsService } from '../../service/products/products.service';
import {
  buildProductPhotoFilename,
  isAllowedImage, ProductsController
} from './products.controller';

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
    // pasar un objeto simple para evitar errores de tipos en tests
    const res = await controller.create({ name: 'Producto' } as any);
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });

  it('GET /products/:id retorna producto', async () => {
    (serviceMock.findOne as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await controller.findOne(1);
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });

  it('PATCH /products/:id delega update', async () => {
    const payload = { name: 'Updated' } as any;
    (serviceMock.update as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Updated',
    });
    const res = await controller.update(1, payload);
    expect(serviceMock.update).toHaveBeenCalledWith(1, payload);
    expect(res).toEqual({ id: 1, name: 'Updated' });
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

  it('uploadPhoto throws when no file provided', async () => {
    (serviceMock.update as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.uploadPhoto(1, undefined as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DELETE /products/:id returns success after remove', async () => {
    (serviceMock.remove as jest.Mock).mockResolvedValue(undefined);
    const res = await controller.remove(1);
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
    expect(res).toEqual({ success: true });
  });

  it('buildProductPhotoFilename genera un nombre con extension', () => {
    const name = buildProductPhotoFilename(5, 'photo.png');
    expect(name).toMatch(/^product_5_\d+\.png$/);
  });

  it('isAllowedImage detecta mime types válidos e inválidos', () => {
    const good = { mimetype: 'image/jpeg' } as Express.Multer.File;
    const bad = { mimetype: 'application/pdf' } as Express.Multer.File;
    expect(isAllowedImage(good)).toBe(true);
    expect(isAllowedImage(bad)).toBe(false);
  });
});
