import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    const jwtMock: any = { signAsync: jest.fn(), verifyAsync: jest.fn() };
    const configMock: any = { get: jest.fn() };
    const userRepo: any = { findOne: jest.fn() };
    const loginRepo: any = { create: jest.fn(), save: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        service = new AuthService(jwtMock, configMock, userRepo, loginRepo);
    });

    describe('validateUser', () => {
        it('retorna usuario si credenciales correctas', async () => {
            const user = { id: 1, username: 'u', password: 'hash' };
            userRepo.findOne.mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);
            const res = await service.validateUser('u', 'p');
            expect(res).toBe(user);
        });

        it('lanza UnauthorizedException si usuario no existe', async () => {
            userRepo.findOne.mockResolvedValue(null);
            await expect(service.validateUser('x', 'y')).rejects.toThrow(
                'Invalid credentials',
            );
        });

        it('lanza UnauthorizedException si password incorrecto', async () => {
            const user = { id: 1, username: 'u', password: 'hash' };
            userRepo.findOne.mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as any);
            await expect(service.validateUser('u', 'bad')).rejects.toThrow(
                'Invalid credentials',
            );
        });
    });

    describe('login', () => {
        it('genera tokens y guarda login si repo presente', async () => {
            const user = { id: 2, username: 'me' } as any;
            jest.spyOn(service, 'validateUser' as any).mockResolvedValue(user);
            jwtMock.signAsync
                .mockResolvedValueOnce('access')
                .mockResolvedValueOnce('refresh');
            configMock.get.mockReturnValue('7d');
            loginRepo.create.mockReturnValue({ user: user, ip: '1.1.1.1' });
            loginRepo.save.mockResolvedValue({});

            const res = await service.login('me', 'pw', '1.1.1.1');
            expect(res).toEqual({ access_token: 'access', refresh_token: 'refresh' });
            expect(loginRepo.create).toHaveBeenCalled();
            expect(loginRepo.save).toHaveBeenCalled();
        });

        it('si guardar login falla no impide el login', async () => {
            const user = { id: 2, username: 'me' } as any;
            jest.spyOn(service, 'validateUser' as any).mockResolvedValue(user);
            jwtMock.signAsync.mockResolvedValueOnce('a').mockResolvedValueOnce('r');
            configMock.get.mockReturnValue('7d');
            loginRepo.create.mockReturnValue({});
            loginRepo.save.mockRejectedValue(new Error('boom'));

            const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const res = await service.login('me', 'pw', '1.1.1.1');
            expect(res).toEqual({ access_token: 'a', refresh_token: 'r' });
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    describe('refresh', () => {
        it('retorna nuevo access token con refresh válido', async () => {
            jwtMock.verifyAsync.mockResolvedValue({ sub: 5, username: 'u' });
            jwtMock.signAsync.mockResolvedValue('newtoken');
            configMock.get.mockReturnValue('secret');
            const res = await service.refresh('rtoken');
            expect(res).toEqual({ access_token: 'newtoken' });
        });

        it('lanza UnauthorizedException si refresh inválido', async () => {
            jwtMock.verifyAsync.mockRejectedValue(new Error('bad'));
            await expect(service.refresh('x')).rejects.toThrow(
                'Invalid refresh token',
            );
        });
    });
});
