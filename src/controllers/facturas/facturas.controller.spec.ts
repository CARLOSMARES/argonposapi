import { Test } from '@nestjs/testing';
import { FacturasController } from './facturas.controller';
import { FacturasService } from 'src/service/facturas/facturas.service';
import { QueuesService } from 'src/queues/queues.service';

describe('FacturasController', () => {
  let controller: FacturasController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as FacturasService;
  const queuesMock = { enqueueInvoice: jest.fn() } as unknown as QueuesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FacturasController],
      providers: [
        { provide: FacturasService, useValue: serviceMock },
        { provide: QueuesService, useValue: queuesMock },
      ],
    }).compile();

    controller = moduleRef.get(FacturasController);
    jest.clearAllMocks();
  });

  it('GET /facturas retorna lista', async () => {
    (serviceMock.findAll as any).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /facturas/enqueue-test/:id encola job', async () => {
    (queuesMock.enqueueInvoice as any).mockResolvedValue({ id: 'job1' });
    // @ts-ignore acceso directo al método
    const res = await controller.enqueueTest(1);
    expect(queuesMock.enqueueInvoice).toHaveBeenCalledWith('generate-pdf', { id: 1 });
    expect(res).toEqual({ id: 'job1' });
  });
});


