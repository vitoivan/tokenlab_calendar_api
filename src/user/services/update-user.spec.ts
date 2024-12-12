import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { CreateUserService } from './create-user.service';
import { UpdateUserService } from './update-user.service';

describe('update user service', () => {
  let repository: UserMemoryRepository;
  let updateUserService: UpdateUserService;
  let createUserService: CreateUserService;

  beforeAll(() => {
    repository = new UserMemoryRepository();
    createUserService = new CreateUserService(repository);
    updateUserService = new UpdateUserService(repository);
  });

  beforeEach(() => {
    repository.reset();
  });

  it('should return user not found error', async () => {
    try {
      await updateUserService.execute(1, { password: '123456', name: 'test', email: 'test@gmail.com' });
      expect(true).toBe(false);
    } catch (e) {
      const err = e as HttpException;
      expect(err.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should return conflict error', async () => {
    try {
      const first = await createUserService.execute({ password: '123456', name: 'test', email: 'test@gmail.com' });
      const second = await createUserService.execute({ password: '123456', name: 'test', email: 'test22@gmail.com' });
      await updateUserService.execute(second.id, { email: first.email });
      expect(true).toBe(false);
    } catch (e) {
      const err = e as HttpException;
      expect(err.getStatus()).toBe(HttpStatus.CONFLICT);
    }
  });

  it('should return the updated user', async () => {
    const created = await createUserService.execute({ password: '123456', name: 'test', email: 'test@gmail.com' });
    const updated = await updateUserService.execute(created.id, { name: 'JHOOOONY', email: 'bravo@gmail.com' });

    expect(updated).toEqual({
      createdAt: created.createdAt,
      updatedAt: expect.any(Date),
      email: 'bravo@gmail.com',
      name: 'JHOOOONY',
      id: created.id,
      password: created.password,
    });
  });
});
