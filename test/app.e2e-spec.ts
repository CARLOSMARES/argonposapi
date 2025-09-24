import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { company } from '../src/entities/company.entity';
import { facturas } from '../src/entities/facturas.entity';
import { products } from '../src/entities/products.entity';
import { providers } from '../src/entities/providers.entity';
import { stock } from '../src/entities/stock.entity';
import { DataSource, Repository } from 'typeorm';
import { getQueueToken } from '@nestjs/bullmq';
import { InvoicesProcessor } from '../src/queues/workers/invoices.processor';

describe('App E2E', () => {
  let app: INestApplication;
  const repoMock = () => ({
    create: jest.fn((x) => x),
    save: jest.fn(async (x) => ({ id: 1, ...x })),
    find: jest.fn(async () => []),
    findOne: jest.fn(async ({ where: { id } }: any) => ({ id })),
    delete: jest.fn(async () => ({ affected: 1 })),
  }) as unknown as Repository<any>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(InvoicesProcessor)
      .useValue({})
      .overrideProvider(getRepositoryToken(User))
      .useValue(repoMock())
      .overrideProvider(getRepositoryToken(company))
      .useValue(repoMock())
      .overrideProvider(getRepositoryToken(facturas))
      .useValue(repoMock())
      .overrideProvider(getRepositoryToken(products))
      .useValue(repoMock())
      .overrideProvider(getRepositoryToken(providers))
      .useValue(repoMock())
      .overrideProvider(getRepositoryToken(stock))
      .useValue(repoMock())
      .overrideProvider(DataSource)
      .useValue({ query: jest.fn(async () => [{ '1': 1 }]) })
      .overrideProvider(getQueueToken('invoices'))
      .useValue({ client: Promise.resolve({ ping: jest.fn(async () => 'PONG') }), add: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({ status: 'ok', redis: 'PONG', db: true });
      });
  });

  it('GET /facturas', async () => {
    await request(app.getHttpServer()).get('/facturas').expect(200);
  });

  it('POST /facturas', async () => {
    await request(app.getHttpServer())
      .post('/facturas')
      .send({ amount: 100, id_cliente: 1, id_user: 1, idfactura: 'F-1' })
      .expect(201);
  });

  it('POST /facturas/enqueue-test/1', async () => {
    await request(app.getHttpServer()).post('/facturas/enqueue-test/1').expect(201);
  });

  it('GET /providers', async () => {
    await request(app.getHttpServer()).get('/providers').expect(200);
  });

  it('GET /products', async () => {
    await request(app.getHttpServer()).get('/products').expect(200);
  });

  it('GET /stock', async () => {
    await request(app.getHttpServer()).get('/stock').expect(200);
  });

  it('GET /company', async () => {
    await request(app.getHttpServer()).get('/company').expect(200);
  });

  it('GET /user', async () => {
    await request(app.getHttpServer()).get('/user').expect(200);
  });
});


