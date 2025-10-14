import { DataSource } from 'typeorm';
import { TypeORMMetricsService } from './typeorm-metrics.service';

describe('TypeORMMetricsService', () => {
    let service: TypeORMMetricsService;

    const makeDataSource = (overrides?: any): DataSource => {
        // construir un objeto DataSource parcial con estructura driver.master.pool
        const pool = overrides?.pool ?? {
            numUsedConnections: () => 2,
            numConnections: () => 8,
        };

        const master = { pool };
        const driver = { master };

        const options = overrides?.options ?? {
            host: 'localhost',
            port: 3306,
            database: 'testdb',
        };

        // casteo a DataSource mínimo necesario
        return { driver, options } as unknown as DataSource;
    };

    beforeEach(() => {
        const ds = makeDataSource();
        service = new TypeORMMetricsService(ds);
    });

    describe('analyzeQuery', () => {
        it('detecta SELECT y extrae tabla FROM', () => {
            const q = 'SELECT * FROM `users` WHERE id = 1';
            const res = (service as any).analyzeQuery(q);
            expect(res.operation).toBe('SELECT');
            expect(res.table).toBe('users');
            expect(res.complexity).toBe('simple');
        });

        it('detecta INSERT y tabla INTO', () => {
            const q = 'INSERT INTO products (name) VALUES (?)';
            const res = (service as any).analyzeQuery(q);
            expect(res.operation).toBe('INSERT');
            expect(res.table).toBe('products');
        });

        it('marca join y group by como complex', () => {
            const q = 'SELECT a FROM table1 JOIN table2 ON ... GROUP BY a';
            const res = (service as any).analyzeQuery(q);
            // la implementación prioriza 'JOIN' y devuelve 'join'
            expect(res.complexity).toBe('join');
        });
    });

    describe('getErrorType', () => {
        it('mapea ER_DUP_ENTRY a duplicate_key', () => {
            const e = { code: 'ER_DUP_ENTRY' };
            const res = (service as any).getErrorType(e);
            expect(res).toBe('duplicate_key');
        });

        it('retorna unknown para error sin code', () => {
            const res = (service as any).getErrorType(null);
            expect(res).toBe('unknown');
        });
    });

    describe('getPoolFunctions and getDatabaseStats', () => {
        it('extrae funciones del pool y calcula stats', () => {
            const ds = makeDataSource({
                pool: { numUsedConnections: () => 3, numConnections: () => 6 },
                options: { host: 'h', port: 1234, database: 'db' },
            });
            const srv = new TypeORMMetricsService(ds as unknown as DataSource);
            const pf = (srv as any).getPoolFunctions();
            expect(typeof pf?.numUsedConnections).toBe('function');
            expect(typeof pf?.numConnections).toBe('function');

            const stats = srv.getDatabaseStats();
            expect(stats).not.toBeNull();
            // ahora podemos acceder con seguridad
            expect(stats).toHaveProperty('activeConnections');
            expect((stats as any).totalConnections).toBe(6);
            expect((stats as any).host).toBe('h');
            expect(typeof (stats as any).connectionUtilization).toBe('number');
        });

        it('retorna null si no hay pool', () => {
            const ds = { driver: {} } as unknown as DataSource;
            const srv = new TypeORMMetricsService(ds);
            const pf = (srv as any).getPoolFunctions();
            expect(pf).toBeUndefined();
            expect(srv.getDatabaseStats()).toBeNull();
        });
    });

    describe('setupDatabaseMetrics wrapping and updateConnectionMetrics', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('envuelve query y devuelve resultado incluso si la duración es > 1s', async () => {
            // controlamos Date.now para simular una duración larga
            let now = 0;
            jest.spyOn(Date, 'now').mockImplementation(() => now);

            const originalQuery = jest.fn(async () => {
                // avanzar el tiempo dentro de la query para simular ejecución lenta
                now = 2000; // 2 segundos después
                return { ok: true };
            });

            const ds: any = {
                query: originalQuery,
                driver: {
                    master: {
                        pool: { numUsedConnections: () => 1, numConnections: () => 2 },
                    },
                },
                options: { host: 'h', port: 1, database: 'db' },
            };

            const srv = new TypeORMMetricsService(ds as DataSource);
            // evitar crear un timer real en onModuleInit
            (global as any).setInterval = jest.fn().mockImplementation((cb: any) => {
                // ejecutar inmediatamente una vez y devolver un handle falso
                cb();
                return 1;
            });
            // onModuleInit configura el wrapper
            srv.onModuleInit();

            // llamar a la query ahora ejecutará la función envuelta
            const res = await ds.query('SELECT 1');
            expect(res).toEqual({ ok: true });
            // originalQuery fue llamado
            expect(originalQuery).toHaveBeenCalledTimes(1);
        });

        it('la envoltura relanza errores del originalQuery', async () => {
            const originalQuery = jest.fn(async () => {
                throw new Error('boom');
            });

            const ds: any = {
                query: originalQuery,
                driver: {
                    master: {
                        pool: { numUsedConnections: () => 0, numConnections: () => 0 },
                    },
                },
                options: {},
            };

            const srv = new TypeORMMetricsService(ds as DataSource);
            (global as any).setInterval = jest.fn().mockImplementation((cb: any) => {
                cb();
                return 1;
            });
            srv.onModuleInit();

            await expect(ds.query('SELECT 1')).rejects.toThrow('boom');
            expect(originalQuery).toHaveBeenCalled();
        });

        it('updateConnectionMetrics captura errores y llama console.error', () => {
            const pool = {
                numUsedConnections: () => {
                    throw new Error('pool boom');
                },
                numConnections: () => 5,
            };

            const ds: any = { driver: { master: { pool } }, options: {} };
            const srv = new TypeORMMetricsService(ds as DataSource);

            const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
            // invocamos directamente
            (srv as any).updateConnectionMetrics();
            expect(spy).toHaveBeenCalled();
        });
    });
});
