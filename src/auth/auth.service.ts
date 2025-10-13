import { Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Login } from '../entities/login.entity';
import { User } from '../entities/user.entity';

interface JwtDecoded {
  sub: number | string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Optional()
    @InjectRepository(Login)
    private readonly loginRepo?: Repository<Login>,
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const storedPassword = (user as Partial<User>).password ?? '';
    // bcrypt may lack precise types in this project; cast compare to a typed function
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const compareFn = bcrypt.compare as unknown as (
      a: string,
      b: string,
    ) => Promise<boolean>;
    const ok = await compareFn(password, storedPassword);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(username: string, password: string, ip?: string) {
    const user = await this.validateUser(username, password);
    const payload = { sub: user.id, username };
    const access_token = await this.jwtService.signAsync(payload);
    const refreshExpires =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d';
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: refreshExpires,
    });

    // Guardar registro de login
    // Guardar registro de login si el repo está disponible (en tests puede no estarlo)
    if (this.loginRepo) {
      try {
        const login = this.loginRepo.create({ user, ip });
        await this.loginRepo.save(login);
      } catch (saveError: unknown) {
        // no bloquear login por fallo en registrar el acceso
        // solo loguear el error de forma segura
        // usar console.error deliberadamente aquí
        console.error('Failed to record login:', saveError);
      }
    }

    return { access_token, refresh_token };
  }

  async refresh(refreshToken: string) {
    try {
      const decodedUnknown = (await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })) as unknown;

      const isJwtDecoded = (d: unknown): d is JwtDecoded =>
        typeof d === 'object' && d !== null && 'sub' in d && 'username' in d;

      if (!isJwtDecoded(decodedUnknown)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = {
        sub: decodedUnknown.sub,
        username: decodedUnknown.username,
      };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
