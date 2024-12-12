import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { CreateUserService } from './create-user.service';
import { ListUsersService } from './list-users.service';
import { ListUsersParamsDTO } from '../dtos/list-users-params.dto';

describe('list users service', () => {
  let repository: UserMemoryRepository;
  let listUsersService: ListUsersService;
  let createUserService: CreateUserService;

  beforeAll(() => {
    repository = new UserMemoryRepository();
    createUserService = new CreateUserService(repository);
    listUsersService = new ListUsersService(repository);
  });

  beforeEach(() => {
    repository.reset();
  });

  it('should return an empty list', async () => {
    const dto = new ListUsersParamsDTO();
    dto.page = 1;
    dto.limit = 20;

    const res = await listUsersService.execute(dto);

    expect(res.data).toEqual([]);
    expect(res.page).toEqual(1);
    expect(res.limit).toEqual(20);
    expect(res.totalPages).toEqual(1);
    expect(res.totalRecords).toEqual(0);
  });

  it('should return a list with 4 users', async () => {
    await createUserService.execute({ password: '123456', name: 'test1', email: 'test1@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test2', email: 'test2@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test3', email: 'test3@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test4', email: 'test4@gmail.com' });

    const dto = new ListUsersParamsDTO();
    dto.page = 1;
    dto.limit = 20;

    const res = await listUsersService.execute(dto);

    expect(res.data.length).toEqual(4);
    expect(res.page).toEqual(1);
    expect(res.limit).toEqual(20);
    expect(res.totalPages).toEqual(1);
    expect(res.totalRecords).toEqual(4);
  });

  it('should return a list with 2 users', async () => {
    await createUserService.execute({ password: '123456', name: 'test1', email: 'test1@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test2', email: 'test2@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test3', email: 'test3@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test4', email: 'test4@gmail.com' });

    const dto = new ListUsersParamsDTO();
    dto.page = 2;
    dto.limit = 2;

    const res = await listUsersService.execute(dto);

    expect(res.data.length).toEqual(2);
    expect(res.page).toEqual(2);
    expect(res.limit).toEqual(2);
    expect(res.totalPages).toEqual(2);
    expect(res.totalRecords).toEqual(4);
  });

  it('should return an empty list if the page is greater than the total', async () => {
    await createUserService.execute({ password: '123456', name: 'test1', email: 'test1@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test2', email: 'test2@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test3', email: 'test3@gmail.com' });
    await createUserService.execute({ password: '123456', name: 'test4', email: 'test4@gmail.com' });

    const dto = new ListUsersParamsDTO();
    dto.page = 10;
    dto.limit = 20;

    const res = await listUsersService.execute(dto);

    expect(res.data.length).toEqual(0);
    expect(res.page).toEqual(10);
    expect(res.limit).toEqual(20);
    expect(res.totalPages).toEqual(1);
    expect(res.totalRecords).toEqual(4);
  });
});
