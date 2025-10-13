import { getQueueToken } from '@nestjs/bullmq';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { company } from '../../../entities/company.entity';
import { facturas } from '../../../entities/facturas.entity';
import { products } from '../../../entities/products.entity';
import { providers } from '../../../entities/providers.entity';
import { stock } from '../../../entities/stock.entity';
import { User } from '../../../entities/user.entity';
import { InvoicesProcessor } from '../../../queues/workers/invoices.processor';
import { AppModule } from '../src/app.module';

describe('App E2E', () => {
  let app: INestApplication;
  const repoMock = () =>
    ({
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
      .useValue({
        client: Promise.resolve({ ping: jest.fn(async () => 'PONG') }),
        add: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
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

  it('POST /auth/login', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test', password: 'test' })
      .expect(401); // Sin usuario válido en DB
  });

  it('POST /auth/refresh', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refresh_token: 'invalid' })
      .expect(401);
  });

  it('POST /user (registro público)', async () => {
    await request(app.getHttpServer())
      .post('/user')
      .send({
        name: 'Test',
        lastname: 'User',
        user: 'testuser',
        password: 'test123',
        email: 'test@example.com',
      })
      .expect(201);
  });

  it('GET /facturas sin token', async () => {
    await request(app.getHttpServer()).get('/facturas').expect(401);
  });

  it('GET /company sin token', async () => {
    await request(app.getHttpServer()).get('/company').expect(401);
  });

  it('GET /providers sin token', async () => {
    await request(app.getHttpServer()).get('/providers').expect(401);
  });

  it('GET /products sin token', async () => {
    await request(app.getHttpServer()).get('/products').expect(401);
  });

  it('GET /stock sin token', async () => {
    await request(app.getHttpServer()).get('/stock').expect(401);
  });

  it('GET /user sin token', async () => {
    await request(app.getHttpServer()).get('/user').expect(401);
  });
});
