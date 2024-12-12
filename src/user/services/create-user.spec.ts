import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { CreateUserService } from './create-user.service';

describe('create user service', () => {
  let repository: UserMemoryRepository;
  let createUserService: CreateUserService;

  beforeAll(() => {
    repository = new UserMemoryRepository();
    createUserService = new CreateUserService(new UserMemoryRepository());
  });

  beforeEach(() => {
    repository.reset();
  });

  it('should return the user created', async () => {
    const res = await createUserService.execute({ password: '123456', name: 'test', email: 'test' });

    expect(res).toEqual({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      email: 'test',
      name: 'test',
      id: expect.any(Number),
      password: expect.any(String),
    });
  });

  it('should return conflict exception', async () => {
    await createUserService.execute({ password: '123456', name: 'test', email: 'test@gmail.com' });
    await createUserService
      .execute({ password: '123456', name: 'test', email: 'test@gmail.com' })
      .catch((res: HttpException) => {
        expect(res.getStatus()).toEqual(HttpStatus.CONFLICT);
      });
  });
});
