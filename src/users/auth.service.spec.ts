import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    // Create a fake copy of the users service
    fakeUserService = {
      findOneByEmail: (email: string) => {
        const filterUser = users.find((user) => user.email === email);
        return Promise.resolve(filterUser);
      },

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999).toString(),
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.register({
      email: 'aaa@aaa.com',
      password: '123456',
    });
    // expect(user.password).not.toEqual('123456');
    expect(user.password.length).toEqual(81);

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user register with email that is in use', async () => {
    await service.register({
      email: 'bbb@bbb.com',
      password: '234234',
    });

    await expect(
      service.register({
        email: 'bbb@bbb.com',
        password: '234234',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if user login is called with an unused email', async () => {
    await expect(
      service.login({
        email: 'dkjsfljdslf@sdfsd.com',
        password: '123456',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.register({
      email: 'ccc@ccc.com',
      password: '123456',
    });

    await expect(
      service.login({
        email: 'ccc@ccc.com',
        password: '000000',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('return a user if correct password is provided', async () => {
    await service.register({
      email: 'ddd@ddd.com',
      password: '123456',
    });

    const user = await service.login({
      email: 'ddd@ddd.com',
      password: '123456',
    });

    expect(user).toBeDefined();
  });
});
