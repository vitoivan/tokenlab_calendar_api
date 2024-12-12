import { UserResponse } from '../dtos/get-user.response';

export class UserModel {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<UserModel>) {
    Object.assign(this, data);
  }

  toResponse(): UserResponse {
    return new UserResponse({
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
