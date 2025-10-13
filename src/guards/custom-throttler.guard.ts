import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { recordRateLimitHit } from '../interceptors/prometheus.interceptor';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(
    req: Request & { user?: { userId?: number } },
  ): Promise<string> {
    // Usar userId si está autenticado, sino IP
    const userId = req.user?.userId;
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);

    // Si el rate limit fue alcanzado, registrar métrica
    if (!result) {
      try {
        const request = context
          .switchToHttp()
          .getRequest<Request & { user?: { userId?: number } }>();
        const userId = request.user?.userId?.toString() ?? 'anonymous';
        const ip = request.ip ?? 'unknown';
        recordRateLimitHit(userId, ip, 'rate_limit');
      } catch {
        // Si no podemos obtener el request, usar valores por defecto
        recordRateLimitHit('unknown', 'unknown', 'error');
      }
    }

    return result;
  }
}
