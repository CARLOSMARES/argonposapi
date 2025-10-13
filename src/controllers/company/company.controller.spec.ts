import { Test } from '@nestjs/testing';
import { CompanyService } from '../../service/company/company.service';
import { CompanyController } from './company.controller';

describe('CompanyController', () => {
  let controller: CompanyController;

  const serviceMock: Partial<Record<keyof CompanyService, jest.Mock>> = {
    create: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findAll: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findOne: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    update: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    remove: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(CompanyController);
    jest.clearAllMocks();
  });

  it('GET /company retorna lista', async () => {
    (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /company crea', async () => {
    (serviceMock.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await controller.create({
      name: 'ACME',
    } as import('../../dto/company.dto').CreateCompanyDto);
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
