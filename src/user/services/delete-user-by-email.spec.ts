import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { CreateUserService } from './create-user.service';
import { DeleteUserByEmailService } from './delete-user-by-email.service';

describe('delete user by email service', () => {
  let repository: UserMemoryRepository;
  let deleteUserByEmailService: DeleteUserByEmailService;
  let createUserService: CreateUserService;

  beforeAll(() => {
    repository = new UserMemoryRepository();
    createUserService = new CreateUserService(repository);
    deleteUserByEmailService = new DeleteUserByEmailService(repository);
  });

  beforeEach(() => {
    repository.reset();
  });

  it('should return the deleted user', async () => {
    await createUserService.execute({ password: '123456', name: 'test', email: 'test@gmail.com' });
    const deleted = await deleteUserByEmailService.execute('test@gmail.com');
    expect(deleted).toEqual({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      email: 'test@gmail.com',
      name: 'test',
      id: 1,
      password: expect.any(String),
    });
  });

  it('should return user not found exception', async () => {
    try {
      await deleteUserByEmailService.execute('test@gmail.com');
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      const err = e as HttpException;
      expect(err.getStatus()).toEqual(HttpStatus.NOT_FOUND);
    }
  });
});
