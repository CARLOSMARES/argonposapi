import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Counter, Histogram, Gauge, register } from 'prom-client';

// ============================================================================
// MÉTRICAS BULLMQ - Sistema de Colas POS Argon
// ============================================================================

/**
 * 📋 TOTAL DE TRABAJOS PROCESADOS
 * 
 * Descripción: Cuenta todos los trabajos procesados por las colas
 * Útil para:
 *   - Monitorear volumen de trabajo asíncrono
 *   - Detectar picos en generación de PDFs
 *   - Identificar trabajos más frecuentes
 *   - Medir productividad del sistema
 * 
 * Labels:
 *   - queue: invoices, reports, notifications
 *   - job_name: generate-pdf, send-email, sync-data
 *   - status: active, completed, failed, retrying
 */
const jobCounter = new Counter({
  name: 'argon_pos_bullmq_jobs_total',
  help: '📋 Total de trabajos procesados en las colas del sistema POS',
  labelNames: ['queue', 'job_name', 'status'],
  registers: [register],
});

/**
 * ⏱️ DURACIÓN DE TRABAJOS
 * 
 * Descripción: Mide el tiempo que toma procesar cada trabajo
 * Útil para:
 *   - Optimizar trabajos lentos (generación de PDFs)
 *   - Configurar timeouts apropiados
 *   - Identificar trabajos que necesitan optimización
 *   - Monitorear SLA de procesamiento
 * 
 * Buckets optimizados para trabajos POS:
 *   - 0.1s: Muy rápido (cálculos simples)
 *   - 0.5s: Rápido (consultas DB)
 *   - 1s: Normal (generación de PDFs simples)
 *   - 2s: Lento (PDFs complejos)
 *   - 5s: Muy lento (reportes grandes)
 *   - 10s: Crítico (necesita optimización)
 */
const jobDuration = new Histogram({
  name: 'argon_pos_bullmq_job_duration_seconds',
  help: '⏱️ Tiempo de procesamiento de trabajos en las colas POS',
  labelNames: ['queue', 'job_name'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register],
});

/**
 * 📦 TRABAJOS EN COLA (ESPERANDO)
 * 
 * Descripción: Cuenta trabajos que están esperando ser procesados
 * Útil para:
 *   - Detectar acumulación de trabajos
 *   - Identificar cuellos de botella
 *   - Planificar capacidad de workers
 *   - Monitorear backlog del sistema
 */
const queueSize = new Gauge({
  name: 'argon_pos_bullmq_queue_size',
  help: '📦 Número de trabajos esperando en las colas POS',
  labelNames: ['queue'],
  registers: [register],
});

/**
 * 🔄 TRABAJOS ACTIVOS (PROCESÁNDOSE)
 * 
 * Descripción: Cuenta trabajos que están siendo procesados actualmente
 * Útil para:
 *   - Monitorear carga actual de workers
 *   - Detectar trabajos colgados
 *   - Optimizar número de workers
 *   - Identificar trabajos que tardan mucho
 */
const activeJobs = new Gauge({
  name: 'argon_pos_bullmq_active_jobs',
  help: '🔄 Número de trabajos activos en las colas POS',
  labelNames: ['queue'],
  registers: [register],
});

/**
 * ❌ TRABAJOS FALLIDOS
 * 
 * Descripción: Cuenta trabajos que han fallado
 * Útil para:
 *   - Detectar problemas en el procesamiento
 *   - Monitorear calidad del sistema
 *   - Identificar trabajos problemáticos
 *   - Configurar políticas de reintento
 */
const failedJobs = new Gauge({
  name: 'argon_pos_bullmq_failed_jobs',
  help: '❌ Número de trabajos fallidos en las colas POS',
  labelNames: ['queue'],
  registers: [register],
});

/**
 * 🔁 TRABAJOS REINTENTANDO
 * 
 * Descripción: Cuenta trabajos que están siendo reintentados
 * Útil para:
 *   - Monitorear trabajos inestables
 *   - Identificar problemas temporales
 *   - Optimizar políticas de reintento
 *   - Detectar problemas de infraestructura
 */
const retryingJobs = new Gauge({
  name: 'argon_pos_bullmq_retrying_jobs',
  help: '🔁 Número de trabajos reintentando en las colas POS',
  labelNames: ['queue'],
  registers: [register],
});

// ============================================================================
// SERVICIO DE MÉTRICAS BULLMQ
// ============================================================================

@Injectable()
export class BullMQMetricsService implements OnModuleInit {
  constructor(
    @InjectQueue('invoices') private readonly invoicesQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.setupQueueMetrics();
  }

  /**
   * Configura las métricas de la cola
   */
  private async setupQueueMetrics() {
    // Actualizar métricas de estado de cola periódicamente
    setInterval(async () => {
      await this.updateQueueMetrics();
    }, 5000); // Cada 5 segundos
  }

  /**
   * Actualiza las métricas de estado de la cola
   */
  private async updateQueueMetrics() {
    try {
      const waiting = await this.invoicesQueue.getWaiting();
      const active = await this.invoicesQueue.getActive();
      const failed = await this.invoicesQueue.getFailed();
      const delayed = await this.invoicesQueue.getDelayed();

      // Actualizar métricas
      queueSize.set({ queue: 'invoices' }, waiting.length);
      activeJobs.set({ queue: 'invoices' }, active.length);
      failedJobs.set({ queue: 'invoices' }, failed.length);
      retryingJobs.set({ queue: 'invoices' }, delayed.length);
    } catch (error) {
      console.error('❌ Error actualizando métricas de cola:', error);
    }
  }

  /**
   * Registra la duración de un trabajo
   * @param queueName Nombre de la cola
   * @param jobName Nombre del trabajo
   * @param duration Duración en segundos
   */
  recordJobDuration(queueName: string, jobName: string, duration: number) {
    jobDuration.observe(
      { queue: queueName, job_name: jobName },
      duration,
    );
  }

  /**
   * Registra un evento de trabajo
   * @param queueName Nombre de la cola
   * @param jobName Nombre del trabajo
   * @param status Estado del trabajo
   */
  recordJobEvent(queueName: string, jobName: string, status: string) {
    jobCounter.inc({
      queue: queueName,
      job_name: jobName,
      status,
    });
  }

  /**
   * Obtiene estadísticas detalladas de la cola
   */
  async getQueueStats() {
    try {
      const waiting = await this.invoicesQueue.getWaiting();
      const active = await this.invoicesQueue.getActive();
      const failed = await this.invoicesQueue.getFailed();
      const delayed = await this.invoicesQueue.getDelayed();

      return {
        queue: 'invoices',
        waiting: waiting.length,
        active: active.length,
        failed: failed.length,
        delayed: delayed.length,
        total: waiting.length + active.length + failed.length + delayed.length,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de cola:', error);
      return null;
    }
  }
}