/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacturasDto } from '../../dto/facturas.dto';
import { facturas } from '../../entities/facturas.entity';
import { QueuesService } from '../../queues/queues.service';
import { FacturasService } from './facturas.service';

describe('FacturasService', () => {
  let service: FacturasService;
  let repo: Repository<facturas>;
  const repoMock: Partial<Record<keyof Repository<facturas>, jest.Mock>> = {
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
        FacturasService,
        { provide: getRepositoryToken(facturas), useValue: repoMock },
        { provide: QueuesService, useValue: queuesMock },
      ],
    }).compile();

    service = moduleRef.get(FacturasService);
    repo = moduleRef.get(getRepositoryToken(facturas));
    jest.clearAllMocks();
  });
  it('crea y encola generate-pdf', async () => {
    const dto = { folio: 'F-1', amount: 100 } as unknown as CreateFacturasDto;
    const created = { id: 1, ...dto } as facturas;
    (repo.create as jest.Mock).mockReturnValue(created);
    (repo.save as jest.Mock).mockResolvedValue({ ...created });

    const saved = await service.create(dto);

    expect(repo.create as jest.Mock).toHaveBeenCalledWith(dto);
    expect(repo.save as jest.Mock).toHaveBeenCalledWith(created);
    expect(queuesMock.enqueueInvoice as jest.Mock).toHaveBeenCalledWith(
      'generate-pdf',
      {
        id: 1,
      },
    );
    expect(saved).toEqual(created);
  });

  it('findAll retorna lista', async () => {
    (repo.find as jest.Mock).mockResolvedValue([{ id: 1 }] as facturas[]);
    const res = await service.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });
});
