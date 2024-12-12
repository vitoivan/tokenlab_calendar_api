export class UserResponse {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<UserResponse>) {
    Object.assign(this, data);
  }
}
