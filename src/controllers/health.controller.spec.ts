import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { getQueueToken } from '@nestjs/bullmq';
import { DataSource } from 'typeorm';

describe('HealthController', () => {
  let controller: HealthController;
  const queueClientMock = { ping: jest.fn().mockResolvedValue('PONG') };
  const queueMock = { client: Promise.resolve(queueClientMock) };
  const dsMock = {
    query: jest.fn().mockResolvedValue([{ '1': 1 }]),
  } as unknown as DataSource;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: getQueueToken('invoices'), useValue: queueMock },
        { provide: DataSource, useValue: dsMock },
      ],
    }).compile();

    controller = moduleRef.get(HealthController);
    jest.clearAllMocks();
  });

  it('GET /health ok', async () => {
    const res = await controller.check();
    expect(res).toEqual({ status: 'ok', redis: 'PONG', db: true });
  });
});


