import { Test } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { Response } from 'express';

describe('MetricsController', () => {
  let controller: MetricsController;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
    }).compile();

    controller = moduleRef.get<MetricsController>(MetricsController);
    
    mockResponse = {
      set: jest.fn(),
      send: jest.fn(),
    };
  });

  it('should return metrics', async () => {
    await controller.getMetrics(mockResponse as Response);
    
    expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    expect(mockResponse.send).toHaveBeenCalled();
  });
});
