import { Test } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from 'src/service/company/company.service';


describe('CompanyController', () => {
  let controller: CompanyController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as CompanyService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        { provide: CompanyService, useValue: serviceMock },
      ],
    }).compile();

    controller = moduleRef.get(CompanyController);
    jest.clearAllMocks();
  });

  it('GET /company retorna lista', async () => {
    (serviceMock.findAll as any).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /company crea', async () => {
    (serviceMock.create as any).mockResolvedValue({ id: 1 });
    // @ts-ignore
    const res = await controller.create({ name: 'ACME' });
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
