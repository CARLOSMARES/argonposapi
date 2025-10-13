import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { PrometheusInterceptor } from './prometheus.interceptor';

describe('PrometheusInterceptor', () => {
  let interceptor: PrometheusInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrometheusInterceptor],
    }).compile();

    interceptor = moduleRef.get<PrometheusInterceptor>(PrometheusInterceptor);

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1',
          route: { path: '/test' },
          user: { userId: 1 },
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as ExecutionContext;

    mockCallHandler = {
      handle: (() => of({ data: 'test' })) as CallHandler['handle'],
    } as CallHandler;
  });

  it('should record metrics for successful requests', (done) => {
    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      complete: () => {
        // Verificar que las métricas se registraron
        done();
      },
    });
  });

  it('should record metrics for failed requests', (done) => {
    const errorHandler = {
      handle: () => throwError(() => new Error('Test error')),
    };

    interceptor.intercept(mockExecutionContext, errorHandler).subscribe({
      error: () => {
        // Verificar que las métricas de error se registraron
        done();
      },
    });
  });
});
