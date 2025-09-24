import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacturasService } from './facturas.service';
import { facturas } from 'src/entities/facturas.entity';
import { QueuesService } from 'src/queues/queues.service';

describe('FacturasService', () => {
  let service: FacturasService;
  let repo: Repository<facturas>;
  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  } as unknown as Repository<facturas>;
  const queuesMock = { enqueueInvoice: jest.fn() } as unknown as QueuesService;

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
    const dto: any = { folio: 'F-1' };
    const created = { id: 1, ...dto } as facturas;
    (repo.create as any).mockReturnValue(created);
    (repo.save as any).mockResolvedValue({ ...created });

    const saved = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(queuesMock.enqueueInvoice).toHaveBeenCalledWith('generate-pdf', { id: 1 });
    expect(saved).toEqual(created);
  });

  it('findAll retorna lista', async () => {
    (repo.find as any).mockResolvedValue([{ id: 1 }] as facturas[]);
    const res = await service.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });
});


