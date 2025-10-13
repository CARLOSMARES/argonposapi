import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import {
  Counter,
  Gauge,
  Histogram,
  collectDefaultMetrics,
  register,
} from 'prom-client';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// ============================================================================
// MÉTRICAS HTTP - Sistema POS Argon
// ============================================================================

/**
 * 📊 TOTAL DE REQUESTS HTTP
 *
 * Descripción: Cuenta todos los requests procesados por el sistema POS
 * Útil para:
 *   - Monitorear tráfico en tiempo real
 *   - Detectar picos de uso (Black Friday, promociones)
 *   - Identificar endpoints más utilizados
 *   - Detectar patrones de uso por tipo de usuario
 *
 * Labels:
 *   - method: GET, POST, PUT, DELETE
 *   - endpoint: /facturas, /products, /auth/login, etc.
 *   - status_code: 200, 400, 401, 500, etc.
 *   - user_type: authenticated, anonymous, admin
 */
const httpRequestsTotal = new Counter({
  name: 'argon_pos_http_requests_total',
  help: '📊 Total de requests HTTP procesados en el sistema POS Argon',
  labelNames: ['method', 'endpoint', 'status_code', 'user_type'],
});

/**
 * ⏱️ DURACIÓN DE REQUESTS HTTP
 *
 * Descripción: Mide el tiempo de respuesta de cada request
 * Útil para:
 *   - Detectar APIs lentas que afectan la experiencia del usuario
 *   - Optimizar endpoints con mayor latencia
 *   - Configurar timeouts apropiados
 *   - Monitorear SLA de respuesta
 *
 * Buckets optimizados para POS:
 *   - 0.1s: Excelente (instantáneo)
 *   - 0.5s: Bueno (aceptable para POS)
 *   - 1s: Regular (límite aceptable)
 *   - 2s: Lento (afecta experiencia)
 *   - 5s: Muy lento (problema serio)
 */
const httpRequestDuration = new Histogram({
  name: 'argon_pos_http_request_duration_seconds',
  help: '⏱️ Tiempo de respuesta de requests HTTP en el sistema POS',
  labelNames: ['method', 'endpoint', 'user_type'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

/**
 * 🔗 CONEXIONES HTTP ACTIVAS
 *
 * Descripción: Cuenta conexiones HTTP simultáneas en tiempo real
 * Útil para:
 *   - Monitorear carga actual del sistema
 *   - Detectar sobrecarga antes de que falle
 *   - Planificar capacidad de servidores
 *   - Identificar picos de concurrencia
 */
const activeConnections = new Gauge({
  name: 'argon_pos_http_active_connections',
  help: '🔗 Conexiones HTTP activas en el sistema POS',
});

/**
 * 🚫 INTENTOS BLOQUEADOS POR RATE LIMITING
 *
 * Descripción: Cuenta intentos bloqueados por límites de velocidad
 * Útil para:
 *   - Detectar ataques de fuerza bruta
 *   - Identificar usuarios con comportamiento anómalo
 *   - Ajustar límites de rate limiting
 *   - Monitorear seguridad del sistema
 *
 * Labels:
 *   - user_id: ID del usuario (si está autenticado)
 *   - ip_address: Dirección IP del cliente
 *   - reason: Razón del bloqueo (rate_limit, suspicious_activity)
 */
const rateLimitHits = new Counter({
  name: 'argon_pos_rate_limit_hits_total',
  help: '🚫 Total de intentos bloqueados por rate limiting',
  labelNames: ['user_id', 'ip_address', 'reason'],
});

/**
 * 💻 MÉTRICAS DEL SISTEMA
 *
 * Descripción: Métricas del servidor (CPU, memoria, GC, etc.)
 * Útil para:
 *   - Monitorear recursos del servidor
 *   - Detectar problemas de memoria
 *   - Optimizar garbage collection
 *   - Planificar escalamiento horizontal
 */
collectDefaultMetrics({
  prefix: 'argon_pos_system_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// ============================================================================
// INTERCEPTOR PRINCIPAL
// ============================================================================

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const rawReq = context.switchToHttp().getRequest<unknown>();
    const reqObj = rawReq as Record<string, unknown> | undefined;
    const method = typeof reqObj?.method === 'string' ? reqObj.method : 'GET';

    // Determinar tipo de usuario
    const user = (reqObj?.user as { role?: string } | undefined) ?? undefined;
    const userType = this.getUserType(user);

    // Normalizar endpoint (remover IDs dinámicos)
    const maybeRoute = reqObj?.route as { path?: unknown } | undefined;
    const rawPath =
      typeof maybeRoute?.path === 'string'
        ? maybeRoute.path
        : typeof reqObj?.url === 'string'
          ? reqObj.url
          : '/';
    const endpoint = this.normalizeEndpoint(rawPath);
    const startTime = Date.now();

    // Incrementar conexiones activas
    activeConnections.inc();

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - startTime) / 1000;
        const statusCode = response.statusCode;

        // Registrar métricas de éxito
        httpRequestsTotal.inc({
          method,
          endpoint,
          status_code: statusCode.toString(),
          user_type: userType,
        });

        httpRequestDuration.observe(
          { method, endpoint, user_type: userType },
          duration,
        );

        // Decrementar conexiones activas
        activeConnections.dec();
      }),
      catchError((error) => {
        const duration = (Date.now() - startTime) / 1000;
        const maybeStatus = (error as unknown as { status?: unknown })?.status;
        let statusCode = 500;
        if (typeof maybeStatus === 'number') statusCode = maybeStatus;
        else if (typeof maybeStatus === 'string')
          statusCode = Number(maybeStatus) || 500;

        // Registrar métricas de error
        httpRequestsTotal.inc({
          method,
          endpoint,
          status_code: statusCode.toString(),
          user_type: userType,
        });

        httpRequestDuration.observe(
          { method, endpoint, user_type: userType },
          duration,
        );

        // Decrementar conexiones activas
        activeConnections.dec();

        throw error;
      }),
    );
  }

  /**
   * Determina el tipo de usuario para las métricas
   */
  private getUserType(user?: { role?: string }): string {
    if (!user) return 'anonymous';
    if (user.role === 'admin') return 'admin';
    if (user.role === 'cashier') return 'cashier';
    if (user.role === 'manager') return 'manager';
    return 'authenticated';
  }

  /**
   * Normaliza endpoints para agrupar métricas similares
   * Ejemplo: /facturas/123 -> /facturas/:id
   */
  private normalizeEndpoint(path: string): string {
    return path
      .replace(/\/\d+/g, '/:id') // IDs numéricos
      .replace(/\/[a-f0-9-]{36}/g, '/:uuid') // UUIDs
      .replace(/\/[a-f0-9-]{24}/g, '/:objectId') // ObjectIds
      .replace(/\?.*$/, ''); // Remover query params
  }
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Registra un hit de rate limiting
 * @param userId ID del usuario
 * @param ip Dirección IP
 * @param reason Razón del bloqueo
 */
export function recordRateLimitHit(
  userId: string,
  ip: string,
  reason: string = 'rate_limit',
) {
  rateLimitHits.inc({
    user_id: userId,
    ip_address: ip,
    reason,
  });
}

/**
 * Obtiene todas las métricas en formato Prometheus
 */
export function getMetrics() {
  return register.metrics();
}
