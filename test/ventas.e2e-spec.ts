import { getQueueToken } from '@nestjs/bullmq';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ventas } from '../src/entities/ventas.entity';

describe('Ventas E2E', () => {
    let app: INestApplication;
    const repoMock = () =>
        ({
            create: jest.fn((x) => ({ id: 1, ...x })),
            save: jest.fn(async (x) => ({ id: 1, ...x })),
            find: jest.fn(async () => []),
            findOne: jest.fn(async ({ where: { id } }: any) => ({ id })),
            delete: jest.fn(async () => ({ affected: 1 })),
        }) as any;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
            .overrideProvider(getRepositoryToken(ventas))
            .useValue(repoMock())
            .overrideProvider(getQueueToken('invoices'))
            .useValue({
                add: jest.fn(),
                client: Promise.resolve({ ping: jest.fn(async () => 'PONG') }),
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

    it('POST /ventas crea venta', async () => {
        await request(app.getHttpServer())
            .post('/ventas')
            .send({ idventa: 'V-100', amount: 100, id_cliente: 1, id_user: 1 })
            .expect(201)
            .expect(({ body }) => {
                expect(body).toHaveProperty('id');
            });
    });
});
