import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      // register: () => {},
      // login: () => {},
    };

    fakeUserService = {
      findOne: (id: string) => {
        return Promise.resolve({
          id,
          email: '1234@sdfs.com',
          password: '123456',
        } as User);
      },

      findOneByEmail: (email: string) => {
        return Promise.resolve({
          id: '1324',
          email,
          password: '123456',
        } as User);
      },

      find: (email: string) => {
        return Promise.resolve([
          { id: '1234', email, password: '1234234' },
        ] as User[]);
      },

      remove: (id: string) => {
        return Promise.resolve({ id } as User);
      },

      update: (id: string, body) => {
        return Promise.resolve({ id, ...body } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find user throw an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
});
