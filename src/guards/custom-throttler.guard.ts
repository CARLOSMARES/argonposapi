import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { recordRateLimitHit } from '../interceptors/prometheus.interceptor';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Usar userId si está autenticado, sino IP
    const userId = req.user?.userId;
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);
    
    // Si el rate limit fue alcanzado, registrar métrica
    if (!result) {
      try {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId || 'anonymous';
        const ip = request.ip || 'unknown';
        recordRateLimitHit(userId, ip, 'rate_limit');
      } catch (error) {
        // Si no podemos obtener el request, usar valores por defecto
        recordRateLimitHit('unknown', 'unknown', 'error');
      }
    }
    
    return result;
  }
}
