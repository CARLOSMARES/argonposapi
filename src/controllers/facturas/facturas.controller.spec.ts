import { Test } from '@nestjs/testing';
import { QueuesService } from '../../queues/queues.service';
import { FacturasService } from '../../service/facturas/facturas.service';
import { FacturasController } from './facturas.controller';

describe('FacturasController', () => {
  let controller: FacturasController;

  const serviceMock: Partial<Record<keyof FacturasService, jest.Mock>> = {
    create: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findAll: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findOne: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    update: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    remove: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
  };
  const queuesMock: Partial<Record<keyof QueuesService, jest.Mock>> = {
    enqueueInvoice: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
  };

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
    (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /facturas/enqueue-test/:id encola job', async () => {
    (queuesMock.enqueueInvoice as jest.Mock).mockResolvedValue({ id: 'job1' });
    const res = await controller.enqueueTest(1 as number);
    expect(queuesMock.enqueueInvoice).toHaveBeenCalledWith('generate-pdf', {
      id: 1,
    });
    expect(res).toEqual({ id: 'job1' });
  });
});
