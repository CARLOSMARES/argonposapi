import { Test } from '@nestjs/testing';
import { UserService } from '../../service/user/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  const serviceMock: Partial<Record<keyof UserService, jest.Mock>> = {
    create: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findAll: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    findOne: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    update: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
    remove: jest.fn() as unknown as jest.Mock<Promise<any>, any[]>,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(UserController);
    jest.clearAllMocks();
  });

  it('GET /user retorna lista', async () => {
    (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = await controller.getAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /user crea', async () => {
    (serviceMock.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await controller.create({ name: 'User' } as any);
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
