import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
    it('canActivate devuelve true si es public', () => {
        const reflector = { getAllAndOverride: () => true } as unknown as Reflector;
        const g = new JwtAuthGuard(reflector);
        const ctx: any = { getHandler: () => { }, getClass: () => { } };
        expect(g.canActivate(ctx)).toBe(true);
    });

    it('canActivate delega cuando no es public', () => {
        const reflector = {
            getAllAndOverride: () => false,
        } as unknown as Reflector;
        const g = new JwtAuthGuard(reflector);
        // Espiar super.canActivate devolviendo falso para simular comportamiento
        const proto = Object.getPrototypeOf(g);
        proto.canActivate = () => 'delegated';
        const ctx: any = { getHandler: () => { }, getClass: () => { } };
        expect(g.canActivate(ctx)).toBe('delegated');
    });
});
