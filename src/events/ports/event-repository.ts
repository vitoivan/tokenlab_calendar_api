import { EventModel } from '../models/event.model';

export interface EventsRepository {
  getUserEvents(userId: number, start: Date, end: Date): Promise<EventModel[]>;
  getById(id: number): Promise<EventModel | null>;
  setUsers(id: number, users: number[]): Promise<EventModel>;
  create(event: EventModel): Promise<EventModel>;
  update(event: EventModel): Promise<EventModel>;
  delete(id: number): Promise<EventModel>;
}
