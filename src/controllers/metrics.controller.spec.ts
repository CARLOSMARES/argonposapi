import { Test } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { Response } from 'express';
import { BullMQMetricsService } from 'src/metrics/bullmq-metrics.service';
import { TypeORMMetricsService } from 'src/metrics/typeorm-metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let mockResponse: Partial<Response>;

  const mockBullMQMetricsService = {
    getQueueStats: jest.fn().mockResolvedValue({
      queue: 'invoices',
      waiting: 0,
      active: 0,
      failed: 0,
      delayed: 0,
      total: 0,
    }),
  };

  const mockTypeORMMetricsService = {
    getDatabaseStats: jest.fn().mockResolvedValue({
      activeConnections: 5,
      totalConnections: 10,
      connectionUtilization: 50,
      database: 'argon_pos',
      host: 'localhost',
      port: 3306,
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: BullMQMetricsService,
          useValue: mockBullMQMetricsService,
        },
        {
          provide: TypeORMMetricsService,
          useValue: mockTypeORMMetricsService,
        },
      ],
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

  it('should return detailed stats', async () => {
    const stats = await controller.getDetailedStats();
    
    expect(stats).toHaveProperty('timestamp');
    expect(stats).toHaveProperty('system');
    expect(stats).toHaveProperty('queues');
    expect(stats).toHaveProperty('database');
    expect(stats).toHaveProperty('metrics');
    expect(mockBullMQMetricsService.getQueueStats).toHaveBeenCalled();
    expect(mockTypeORMMetricsService.getDatabaseStats).toHaveBeenCalled();
  });

  it('should return dashboard HTML', async () => {
    await controller.getDashboard(mockResponse as Response);
    
    expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', 'text/html');
    expect(mockResponse.send).toHaveBeenCalled();
    
    const htmlContent = (mockResponse.send as jest.Mock).mock.calls[0][0];
    expect(htmlContent).toContain('Argon POS Dashboard');
    expect(htmlContent).toContain('chart.js');
    expect(htmlContent).toContain('Chart.defaults');
    expect(htmlContent).toContain('new Chart(');
  });
});
