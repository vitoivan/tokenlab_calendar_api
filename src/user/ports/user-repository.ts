import { ListUsersParamsDTO } from '../dtos/list-users-params.dto';
import { UserModel } from '../models/user.model';

export interface UserRepository {
  getByEmail(email: string): Promise<UserModel | null>;
  getById(id: number): Promise<UserModel | null>;
  create(user: UserModel): Promise<UserModel>;
  update(user: UserModel): Promise<UserModel>;
  deleteByEmail(email: string): Promise<UserModel>;
  deleteById(id: number): Promise<UserModel>;
  list(user: ListUsersParamsDTO): Promise<UserModel[]>;
  count(user: ListUsersParamsDTO): Promise<number>;
}
