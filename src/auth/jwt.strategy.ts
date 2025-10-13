import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, StrategyOptions } from 'passport-jwt';

interface JwtPayload {
  sub: number | string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET') ?? '';

    // jwtFromRequest reads the Authorization header from Express Request.
    // We keep the implementation small and assert types to avoid deep lib types.

    const jwtFromRequest = (req?: unknown): string | null => {
      // Narrow unknown -> Request safely
      const r = req as Request | undefined | null;
      const authHeader = r?.headers?.authorization ?? r?.headers?.Authorization;
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
      }
      return null;
    };

    // StrategyOptions typing is incompatible with jwtFromRequest narrow type from Express

    const options: StrategyOptions = {
      // force-cast here is safe: passport-jwt accepts the provided function at runtime
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: jwtFromRequest as unknown as any,
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    // super() expects a StrategyOptions-like value; runtime is fine
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(options as any);
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
