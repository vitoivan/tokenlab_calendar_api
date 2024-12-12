import { UserRepository } from '../ports/user-repository';
import { UserModel } from '../models/user.model';
import { ListUsersParamsDTO } from '../dtos/list-users-params.dto';

export class UserMemoryRepository implements UserRepository {
  public users: UserModel[] = [];
  private currentId = 0;

  reset() {
    this.users = [];
    this.currentId = 0;
  }

  private buildListQuery(dto: ListUsersParamsDTO): (user: UserModel) => boolean {
    return (user) => {
      if (!dto.email && !dto.name) {
        return true;
      }

      return user.email === dto.email || user.name.toLowerCase().startsWith(dto.name.toLowerCase());
    };
  }

  async getById(id: number): Promise<UserModel | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(user: UserModel): Promise<UserModel> {
    const id = ++this.currentId;
    const now = new Date();
    const created = new UserModel({ ...user, id, createdAt: now, updatedAt: now });
    this.users.push(created);
    return created;
  }

  async update(user: UserModel): Promise<UserModel> {
    const index = this.users.findIndex((user) => user.id === user.id);
    this.users[index] = user;
    return user;
  }

  async deleteById(id: number): Promise<UserModel> {
    const deleted = this.users.find((user) => user.id === id);
    this.users = this.users.filter((user) => user !== deleted);
    return deleted;
  }

  async deleteByEmail(email: string): Promise<UserModel> {
    const deleted = this.users.find((user) => user.email === email);
    this.users = this.users.filter((user) => user !== deleted);
    return deleted;
  }
  async list(dto: ListUsersParamsDTO): Promise<UserModel[]> {
    const users = this.users.filter(this.buildListQuery(dto));

    const page = dto.page || 1;
    const limit = dto.limit || 10;

    return users.slice((page - 1) * limit, page * limit);
  }

  async count(dto: ListUsersParamsDTO): Promise<number> {
    const users = this.users.filter(this.buildListQuery(dto));
    return users.length;
  }
}
