import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { CreateUserService } from './create-user.service';
import { DeleteUserByIdService } from './delete-user-by-id.service';

describe('delete user by id servick', () => {
  let repository: UserMemoryRepository;
  let deleteUserByIdService: DeleteUserByIdService;
  let createUserService: CreateUserService;

  beforeAll(() => {
    repository = new UserMemoryRepository();
    createUserService = new CreateUserService(repository);
    deleteUserByIdService = new DeleteUserByIdService(repository);
  });

  beforeEach(() => {
    repository.reset();
  });

  it('should return the deleted user', async () => {
    await createUserService.execute({ password: '123456', name: 'test', email: 'test@gmail.com' });
    const deleted = await deleteUserByIdService.execute(1);
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
      await deleteUserByIdService.execute(1);
      expect(true).toBe(false);
    } catch (e) {
      const err = e as HttpException;
      expect(err.getStatus()).toEqual(HttpStatus.NOT_FOUND);
    }
  });
});
