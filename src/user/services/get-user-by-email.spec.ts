import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { CreateUserService } from './create-user.service';
import { GetUserByEmailService } from './get-user-by-email.service';

describe('get user by email service', () => {
  let repository: UserMemoryRepository;
  let getUserByEmailService: GetUserByEmailService;
  let createUserService: CreateUserService;

  beforeAll(() => {
    repository = new UserMemoryRepository();
    createUserService = new CreateUserService(repository);
    getUserByEmailService = new GetUserByEmailService(repository);
  });

  beforeEach(() => {
    repository.reset();
  });

  it('should return the user', async () => {
    const created = await createUserService.execute({ password: '123456', name: 'test', email: 'test@gmail.com' });
    const getted = await getUserByEmailService.execute(created.email);
    expect(getted).toEqual(created);
  });

  it('should return user not found exception', async () => {
    try {
      await getUserByEmailService.execute('test@gmail.com');
      expect(true).toBe(false);
    } catch (e) {
      const err = e as HttpException;
      expect(err.getStatus()).toEqual(HttpStatus.NOT_FOUND);
    }
  });
});
