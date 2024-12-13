import { UserResponse } from '@/user/dtos/get-user.response';

export class EventModel {
  id: number;
  name: string;
  description: string;
  start: Date;
  end: Date;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  owner?: UserResponse;
  users: UserResponse[];

  constructor(data: Partial<EventModel>) {
    Object.assign(this, data);
  }
}
