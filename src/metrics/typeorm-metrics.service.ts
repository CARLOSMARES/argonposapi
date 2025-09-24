import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Counter, Histogram, Gauge, register } from 'prom-client';

// ============================================================================
// MÉTRICAS TYPEORM - Base de Datos POS Argon
// ============================================================================

/**
 * 🗄️ TOTAL DE QUERIES EJECUTADAS
 * 
 * Descripción: Cuenta todas las consultas SQL ejecutadas
 * Útil para:
 *   - Monitorear actividad de base de datos
 *   - Identificar tablas más consultadas
 *   - Detectar patrones de uso
 *   - Optimizar índices y consultas
 * 
 * Labels:
 *   - operation: SELECT, INSERT, UPDATE, DELETE
 *   - table: users, facturas, products, stock
 *   - complexity: simple, complex, join
 */
const queryCounter = new Counter({
  name: 'argon_pos_db_queries_total',
  help: '🗄️ Total de consultas SQL ejecutadas en la base de datos POS',
  labelNames: ['operation', 'table', 'complexity'],
  registers: [register],
});

/**
 * ⏱️ DURACIÓN DE QUERIES
 * 
 * Descripción: Mide el tiempo de ejecución de cada consulta
 * Útil para:
 *   - Identificar consultas lentas
 *   - Optimizar performance de DB
 *   - Detectar problemas de índices
 *   - Configurar timeouts apropiados
 * 
 * Buckets optimizados para DB POS:
 *   - 0.001s: Muy rápido (consultas simples)
 *   - 0.01s: Rápido (consultas con índices)
 *   - 0.1s: Normal (consultas complejas)
 *   - 0.5s: Lento (consultas sin índices)
 *   - 1s: Muy lento (necesita optimización)
 *   - 2s: Crítico (problema serio)
 */
const queryDuration = new Histogram({
  name: 'argon_pos_db_query_duration_seconds',
  help: '⏱️ Tiempo de ejecución de consultas SQL en la base de datos POS',
  labelNames: ['operation', 'table', 'complexity'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [register],
});

/**
 * 🐌 QUERIES LENTAS (>1 SEGUNDO)
 * 
 * Descripción: Cuenta consultas que tardan más de 1 segundo
 * Útil para:
 *   - Identificar consultas problemáticas
 *   - Priorizar optimizaciones
 *   - Detectar degradación de performance
 *   - Monitorear SLA de base de datos
 */
const slowQueries = new Counter({
  name: 'argon_pos_db_slow_queries_total',
  help: '🐌 Total de consultas SQL lentas (>1s) en la base de datos POS',
  labelNames: ['operation', 'table', 'complexity'],
  registers: [register],
});

/**
 * 🔗 CONEXIONES ACTIVAS
 * 
 * Descripción: Cuenta conexiones activas a la base de datos
 * Útil para:
 *   - Monitorear uso del pool de conexiones
 *   - Detectar saturación de conexiones
 *   - Optimizar tamaño del pool
 *   - Planificar capacidad de DB
 */
const activeConnections = new Gauge({
  name: 'argon_pos_db_active_connections',
  help: '🔗 Número de conexiones activas a la base de datos POS',
  registers: [register],
});

/**
 * 📊 TAMAÑO DEL POOL DE CONEXIONES
 * 
 * Descripción: Tamaño total del pool de conexiones
 * Útil para:
 *   - Monitorear configuración del pool
 *   - Calcular porcentaje de uso
 *   - Optimizar configuración
 *   - Detectar problemas de configuración
 */
const connectionPoolSize = new Gauge({
  name: 'argon_pos_db_connection_pool_size',
  help: '📊 Tamaño total del pool de conexiones a la base de datos POS',
  registers: [register],
});

/**
 * ❌ QUERIES FALLIDAS
 * 
 * Descripción: Cuenta consultas que han fallado
 * Útil para:
 *   - Detectar problemas de base de datos
 *   - Monitorear estabilidad del sistema
 *   - Identificar consultas problemáticas
 *   - Detectar problemas de conectividad
 */
const failedQueries = new Counter({
  name: 'argon_pos_db_failed_queries_total',
  help: '❌ Total de consultas SQL fallidas en la base de datos POS',
  labelNames: ['operation', 'table', 'error_type'],
  registers: [register],
});

// ============================================================================
// SERVICIO DE MÉTRICAS TYPEORM
// ============================================================================

@Injectable()
export class TypeORMMetricsService implements OnModuleInit {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.setupDatabaseMetrics();
  }

  /**
   * Configura las métricas de base de datos
   */
  private async setupDatabaseMetrics() {
    // Interceptar queries para medir performance
    const originalQuery = this.dataSource.query.bind(this.dataSource);
    
    this.dataSource.query = async (query: string, parameters?: any[]) => {
      const startTime = Date.now();
      
      try {
        const result = await originalQuery(query, parameters);
        const duration = (Date.now() - startTime) / 1000;
        
        // Analizar la query
        const analysis = this.analyzeQuery(query);
        
        // Registrar métricas de éxito
        queryCounter.inc({ 
          operation: analysis.operation, 
          table: analysis.table,
          complexity: analysis.complexity
        });
        
        queryDuration.observe(
          { 
            operation: analysis.operation, 
            table: analysis.table,
            complexity: analysis.complexity
          }, 
          duration
        );
        
        // Registrar queries lentas
        if (duration > 1) {
          slowQueries.inc({ 
            operation: analysis.operation, 
            table: analysis.table,
            complexity: analysis.complexity
          });
        }
        
        return result;
      } catch (error) {
        const duration = (Date.now() - startTime) / 1000;
        const analysis = this.analyzeQuery(query);
        
        // Registrar métricas de error
        queryCounter.inc({ 
          operation: analysis.operation, 
          table: analysis.table,
          complexity: analysis.complexity
        });
        
        queryDuration.observe(
          { 
            operation: analysis.operation, 
            table: analysis.table,
            complexity: analysis.complexity
          }, 
          duration
        );
        
        // Registrar query fallida
        failedQueries.inc({ 
          operation: analysis.operation, 
          table: analysis.table,
          error_type: this.getErrorType(error)
        });
        
        throw error;
      }
    };

    // Actualizar métricas de conexiones periódicamente
    setInterval(async () => {
      await this.updateConnectionMetrics();
    }, 10000); // Cada 10 segundos
  }

  /**
   * Actualiza las métricas de conexiones
   */
  private async updateConnectionMetrics() {
    try {
      const pool = (this.dataSource as any).driver?.master?.pool;
      if (pool) {
        activeConnections.set(pool.numUsedConnections());
        connectionPoolSize.set(pool.numConnections());
      }
    } catch (error) {
      console.error('❌ Error actualizando métricas de conexiones:', error);
    }
  }

  /**
   * Analiza una query SQL para extraer información
   */
  private analyzeQuery(query: string): { operation: string; table: string; complexity: string } {
    const trimmed = query.trim().toUpperCase();
    
    // Determinar operación
    let operation = 'OTHER';
    if (trimmed.startsWith('SELECT')) operation = 'SELECT';
    else if (trimmed.startsWith('INSERT')) operation = 'INSERT';
    else if (trimmed.startsWith('UPDATE')) operation = 'UPDATE';
    else if (trimmed.startsWith('DELETE')) operation = 'DELETE';
    else if (trimmed.startsWith('CREATE')) operation = 'CREATE';
    else if (trimmed.startsWith('DROP')) operation = 'DROP';
    else if (trimmed.startsWith('ALTER')) operation = 'ALTER';
    
    // Extraer tabla
    const tableMatch = query.match(/(?:FROM|INTO|UPDATE)\s+`?(\w+)`?/i);
    const table = tableMatch ? tableMatch[1] : 'unknown';
    
    // Determinar complejidad
    let complexity = 'simple';
    if (trimmed.includes('JOIN')) complexity = 'join';
    else if (trimmed.includes('GROUP BY') || trimmed.includes('ORDER BY')) complexity = 'complex';
    else if (trimmed.includes('WHERE') && trimmed.includes('AND')) complexity = 'complex';
    
    return { operation, table, complexity };
  }

  /**
   * Determina el tipo de error
   */
  private getErrorType(error: any): string {
    if (error.code === 'ER_DUP_ENTRY') return 'duplicate_key';
    if (error.code === 'ER_NO_SUCH_TABLE') return 'table_not_found';
    if (error.code === 'ER_BAD_FIELD_ERROR') return 'column_not_found';
    if (error.code === 'ER_CONNECTION_LOST') return 'connection_lost';
    if (error.code === 'ER_LOCK_WAIT_TIMEOUT') return 'lock_timeout';
    return 'unknown';
  }

  /**
   * Obtiene estadísticas detalladas de la base de datos
   */
  async getDatabaseStats() {
    try {
      const pool = (this.dataSource as any).driver?.master?.pool;
      if (!pool) return null;

      const options = this.dataSource.options as any;
      return {
        activeConnections: pool.numUsedConnections(),
        totalConnections: pool.numConnections(),
        connectionUtilization: (pool.numUsedConnections() / pool.numConnections()) * 100,
        database: options.database,
        host: options.host || 'localhost',
        port: options.port || 3306,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de DB:', error);
      return null;
    }
  }
}