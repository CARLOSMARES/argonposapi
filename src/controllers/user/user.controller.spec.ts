import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from 'src/service/user/user.service';


describe('UserController', () => {
  let controller: UserController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: serviceMock },
      ],
    }).compile();

    controller = moduleRef.get(UserController);
    jest.clearAllMocks();
  });

  it('GET /user retorna lista', async () => {
    (serviceMock.findAll as any).mockResolvedValue([{ id: 1 }]);
    const res = await controller.getAll();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('POST /user crea', async () => {
    (serviceMock.create as any).mockResolvedValue({ id: 1 });
    // @ts-ignore
    const res = await controller.create({ name: 'User' });
    expect(serviceMock.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
