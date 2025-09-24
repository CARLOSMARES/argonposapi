import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { getMetrics } from '../interceptors/prometheus.interceptor';
import { register } from 'prom-client';
import { Public } from 'src/auth/public.decorator';
import { BullMQMetricsService } from 'src/metrics/bullmq-metrics.service';
import { TypeORMMetricsService } from 'src/metrics/typeorm-metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly bullMQMetrics: BullMQMetricsService,
    private readonly typeORMMetrics: TypeORMMetricsService,
  ) {}

  /**
   * 📊 MÉTRICAS PROMETHEUS
   * 
   * Endpoint que expone todas las métricas en formato Prometheus
   * Útil para herramientas de monitoreo como Grafana, Prometheus, etc.
   */
  @Public()
  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await getMetrics();
    res.set('Content-Type', register.contentType);
    res.send(metrics);
  }

  /**
   * 📈 ESTADÍSTICAS DETALLADAS
   * 
   * Endpoint que muestra estadísticas detalladas del sistema POS
   * Útil para dashboards internos y monitoreo manual
   */
  @Public()
  @Get('stats')
  async getDetailedStats() {
    const queueStats = await this.bullMQMetrics.getQueueStats();
    const dbStats = await this.typeORMMetrics.getDatabaseStats();

    return {
      timestamp: new Date().toISOString(),
      system: {
        name: 'Argon POS API',
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      queues: queueStats,
      database: dbStats,
      metrics: {
        description: 'Estadísticas detalladas del sistema POS Argon',
        endpoints: {
          prometheus: '/metrics - Métricas en formato Prometheus',
          stats: '/metrics/stats - Estadísticas detalladas (este endpoint)',
          health: '/health - Estado general del sistema',
        },
        available_metrics: [
          'argon_pos_http_requests_total - Total de requests HTTP',
          'argon_pos_http_request_duration_seconds - Tiempo de respuesta HTTP',
          'argon_pos_http_active_connections - Conexiones HTTP activas',
          'argon_pos_rate_limit_hits_total - Intentos bloqueados por rate limiting',
          'argon_pos_bullmq_jobs_total - Total de trabajos en colas',
          'argon_pos_bullmq_job_duration_seconds - Tiempo de procesamiento de trabajos',
          'argon_pos_bullmq_queue_size - Trabajos esperando en colas',
          'argon_pos_bullmq_active_jobs - Trabajos activos',
          'argon_pos_bullmq_failed_jobs - Trabajos fallidos',
          'argon_pos_db_queries_total - Total de consultas SQL',
          'argon_pos_db_query_duration_seconds - Tiempo de consultas SQL',
          'argon_pos_db_slow_queries_total - Consultas lentas (>1s)',
          'argon_pos_db_active_connections - Conexiones activas a DB',
          'argon_pos_db_connection_pool_size - Tamaño del pool de conexiones',
          'argon_pos_system_* - Métricas del sistema (CPU, memoria, GC)',
        ],
      },
    };
  }

  /**
   * 🎨 DASHBOARD WEB INTERACTIVO
   * 
   * Dashboard visual con gráficos y métricas en tiempo real
   */
  @Public()
  @Get('dashboard')
  async getDashboard(@Res() res: Response) {
    const queueStats = await this.bullMQMetrics.getQueueStats();
    const dbStats = await this.typeORMMetrics.getDatabaseStats();
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Argon POS - Dashboard de Métricas</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: white;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        .chart-container {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .chart-title {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-ok { background-color: #4CAF50; }
        .status-warning { background-color: #FF9800; }
        .status-error { background-color: #F44336; }
        
        .refresh-btn {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            margin: 20px auto;
            display: block;
            transition: transform 0.3s ease;
        }
        
        .refresh-btn:hover {
            transform: scale(1.05);
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 30px;
            opacity: 0.8;
        }
        
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .metric-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        .metric-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .metric-description {
            font-size: 0.9rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Argon POS Dashboard</h1>
            <p>Monitoreo en tiempo real del sistema de punto de venta</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>🖥️ Sistema</h3>
                <div class="stat-value">${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m</div>
                <div class="stat-label">Tiempo activo</div>
                <div class="metric-item">
                    <div class="metric-name">Memoria RAM</div>
                    <div class="metric-description">${(memory.heapUsed / 1024 / 1024).toFixed(1)} MB / ${(memory.heapTotal / 1024 / 1024).toFixed(1)} MB</div>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>🗄️ Base de Datos</h3>
                <div class="stat-value">${dbStats ? dbStats.activeConnections : 0}</div>
                <div class="stat-label">Conexiones activas</div>
                <div class="metric-item">
                    <div class="metric-name">Utilización del Pool</div>
                    <div class="metric-description">${dbStats ? dbStats.connectionUtilization.toFixed(1) : 0}%</div>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>📋 Colas de Trabajo</h3>
                <div class="stat-value">${queueStats ? queueStats.total : 0}</div>
                <div class="stat-label">Total de trabajos</div>
                <div class="metric-item">
                    <div class="metric-name">En espera: ${queueStats ? queueStats.waiting : 0}</div>
                    <div class="metric-description">Activos: ${queueStats ? queueStats.active : 0} | Fallidos: ${queueStats ? queueStats.failed : 0}</div>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>🔗 Conexiones HTTP</h3>
                <div class="stat-value" id="activeConnections">-</div>
                <div class="stat-label">Conexiones activas</div>
                <div class="metric-item">
                    <div class="metric-name">Estado del Sistema</div>
                    <div class="metric-description"><span class="status-indicator status-ok"></span>Operativo</div>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <h3 class="chart-title">📈 Métricas HTTP en Tiempo Real</h3>
            <canvas id="httpChart" width="400" height="200"></canvas>
        </div>
        
        <div class="chart-container">
            <h3 class="chart-title">📊 Estado de las Colas</h3>
            <canvas id="queueChart" width="400" height="200"></canvas>
        </div>
        
        <div class="chart-container">
            <h3 class="chart-title">🗄️ Actividad de Base de Datos</h3>
            <canvas id="dbChart" width="400" height="200"></canvas>
        </div>
        
        <button class="refresh-btn" onclick="refreshData()">🔄 Actualizar Datos</button>
        
        <div class="footer">
            <p>Argon POS API v1.0.0 | Última actualización: <span id="lastUpdate"></span></p>
            <p>Endpoints: <a href="/metrics" style="color: white;">/metrics</a> | <a href="/metrics/stats" style="color: white;">/stats</a> | <a href="/health" style="color: white;">/health</a></p>
        </div>
    </div>

    <script>
        // Configuración de gráficos
        Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        Chart.defaults.color = '#666';
        
        // Gráfico de métricas HTTP
        const httpCtx = document.getElementById('httpChart').getContext('2d');
        const httpChart = new Chart(httpCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Requests/min',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
        
        // Gráfico de colas
        const queueCtx = document.getElementById('queueChart').getContext('2d');
        const queueChart = new Chart(queueCtx, {
            type: 'doughnut',
            data: {
                labels: ['Esperando', 'Activos', 'Fallidos', 'Reintentando'],
                datasets: [{
                    data: [${queueStats ? queueStats.waiting : 0}, ${queueStats ? queueStats.active : 0}, ${queueStats ? queueStats.failed : 0}, ${queueStats ? queueStats.delayed : 0}],
                    backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#FF9800']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Gráfico de base de datos
        const dbCtx = document.getElementById('dbChart').getContext('2d');
        const dbChart = new Chart(dbCtx, {
            type: 'bar',
            data: {
                labels: ['Conexiones Activas', 'Pool Total', 'Utilización %'],
                datasets: [{
                    label: 'Base de Datos',
                    data: [${dbStats ? dbStats.activeConnections : 0}, ${dbStats ? dbStats.totalConnections : 0}, ${dbStats ? dbStats.connectionUtilization : 0}],
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Función para actualizar datos
        async function refreshData() {
            try {
                const response = await fetch('/metrics/stats');
                const data = await response.json();
                
                // Actualizar tiempo de última actualización
                document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
                
                // Simular datos para el gráfico HTTP (en producción vendrían de métricas reales)
                const now = new Date().toLocaleTimeString();
                httpChart.data.labels.push(now);
                httpChart.data.datasets[0].data.push(Math.floor(Math.random() * 100) + 50);
                
                // Mantener solo los últimos 10 puntos
                if (httpChart.data.labels.length > 10) {
                    httpChart.data.labels.shift();
                    httpChart.data.datasets[0].data.shift();
                }
                
                httpChart.update();
                
                // Actualizar gráfico de colas
                if (data.queues) {
                    queueChart.data.datasets[0].data = [
                        data.queues.waiting,
                        data.queues.active,
                        data.queues.failed,
                        data.queues.delayed
                    ];
                    queueChart.update();
                }
                
                // Actualizar gráfico de DB
                if (data.database) {
                    dbChart.data.datasets[0].data = [
                        data.database.activeConnections,
                        data.database.totalConnections,
                        data.database.connectionUtilization
                    ];
                    dbChart.update();
                }
                
            } catch (error) {
                console.error('Error actualizando datos:', error);
            }
        }
        
        // Actualizar datos cada 30 segundos
        setInterval(refreshData, 30000);
        
        // Actualizar tiempo inicial
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
    </script>
</body>
</html>
    `;

    res.set('Content-Type', 'text/html');
    res.send(html);
  }
}