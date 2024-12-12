import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { CreateUserService } from './create-user.service';
import { GetUserByIdService } from './get-user-by-id.service';

describe('get user by id service', () => {
  let repository: UserMemoryRepository;
  let getUserByIdService: GetUserByIdService;
  let createUserService: CreateUserService;

  beforeAll(() => {
    repository = new UserMemoryRepository();
    createUserService = new CreateUserService(repository);
    getUserByIdService = new GetUserByIdService(repository);
  });

  beforeEach(() => {
    repository.reset();
  });

  it('should return the user', async () => {
    const created = await createUserService.execute({ password: '123456', name: 'test', email: 'test@gmail.com' });
    const getted = await getUserByIdService.execute(created.id);
    expect(getted).toEqual(created);
  });

  it('should return user not found exception', async () => {
    try {
      await getUserByIdService.execute(1);
      expect(true).toBe(false);
    } catch (e) {
      const err = e as HttpException;
      expect(err.getStatus()).toEqual(HttpStatus.NOT_FOUND);
    }
  });
});
