import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';


describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const userRepoMock = {
    findOne: jest.fn(),
  };
  const jwtMock = { signAsync: jest.fn().mockResolvedValue('token') } as unknown as JwtService;
  const configMock = { get: jest.fn().mockReturnValue('secret') } as unknown as ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtMock },
        { provide: ConfigService, useValue: configMock },
        { provide: getRepositoryToken(User), useValue: userRepoMock },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
    service = moduleRef.get(AuthService);
    jest.clearAllMocks();
  });

  it('POST /auth/login retorna access_token', async () => {
    (userRepoMock.findOne as any).mockResolvedValue({ id: 1, username: 'u', password: await Promise.resolve('$2b$10$K4Y8Jx.MOCKEDHASH...............') });
    // mockear validateUser por simplicidad
    jest.spyOn(service as any, 'validateUser').mockResolvedValue({ id: 1, username: 'u' } as any);
    jest.spyOn(service as any, 'login');
    const res = await controller.login({ username: 'u', password: 'p' });
    expect(res).toEqual({ access_token: 'token', refresh_token: 'token' });
  });
});
