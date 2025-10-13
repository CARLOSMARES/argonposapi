import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const userRepoMock = {
    findOne: jest.fn() as jest.Mock<Promise<any>, [any]>,
  };
  const jwtMock: Partial<JwtService> = {
    signAsync: jest.fn().mockResolvedValue('token'),
  };
  const configMock: Partial<ConfigService> = {
    get: jest.fn().mockReturnValue('secret'),
  };

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
    userRepoMock.findOne.mockResolvedValue({
      id: 1,
      username: 'u',
      password: await Promise.resolve(
        '$2b$10$K4Y8Jx.MOCKEDHASH...............',
      ),
    });
    // mockear validateUser por simplicidad
    jest
      .spyOn(service as unknown as { validateUser: jest.Mock }, 'validateUser')
      .mockResolvedValue({ id: 1, username: 'u' });
    jest.spyOn(service as unknown as { login: jest.Mock }, 'login');
    const res = await controller.login({ username: 'u', password: 'p' });
    expect(res).toEqual({ access_token: 'token', refresh_token: 'token' });
  });
});
