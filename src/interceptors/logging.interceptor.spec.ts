import { Test } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = moduleRef.get<LoggingInterceptor>(LoggingInterceptor);
    
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1',
          get: jest.fn().mockReturnValue('test-agent'),
          user: { userId: 1 },
        }),
      }),
    } as ExecutionContext;

    mockCallHandler = {
      handle: () => of({ data: 'test' }),
    };
  });

  it('should log request and response', (done) => {
    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');
    
    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      complete: () => {
        expect(loggerSpy).toHaveBeenCalledTimes(2);
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('[GET] /test - User: 1 - IP: 127.0.0.1')
        );
        done();
      },
    });
  });
});
