import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../ports/event-repository';
import { EventModel } from '../models/event.model';
import { UserModel } from '@/user/models/user.model';

@Injectable()
export class EventsMemoryRepository implements EventsRepository {
  public events: EventModel[] = [];
  private currentIndex = 0;
  private userIds = 0;

  reset() {
    this.currentIndex = 0;
    this.events = [];
  }

  async create(event: EventModel): Promise<EventModel> {
    ++this.currentIndex;
    const now = new Date();
    const owner = event.owner || null;
    const toCreate = new EventModel({
      ...event,
      id: this.currentIndex,
      owner,
      createdAt: now,
      updatedAt: now,
    });
    this.events.push(toCreate);
    return new EventModel(toCreate);
  }

  async getById(id: number): Promise<EventModel | null> {
    const found = this.events.find((event) => event.id === id) || null;
    if (!found) {
      return null;
    }
    return new EventModel(found);
  }

  async update(event: EventModel): Promise<EventModel> {
    const index = this.events.findIndex((e) => e.id === event.id);
    if (index === -1) {
      throw new Error('Event not found');
    }
    this.events[index] = event;
    return event;
  }

  async delete(id: number): Promise<EventModel> {
    const index = this.events.findIndex((event) => event.id === id);
    const event = this.events[index];
    this.events.splice(index, 1);
    return event;
  }

  async getUserEvents(userId: number, start: Date, end: Date): Promise<EventModel[]> {
    return this.events.filter((event) => event.ownerId === userId && event.start >= start && event.end <= end);
  }

  async setUsers(id: number, users: number[]): Promise<EventModel> {
    const index = this.events.findIndex((event) => event.id === id);
    if (index === -1) {
      return null;
    }

    const usersObj = users.map(
      (u) => new UserModel({ id: u, name: 'asdklsljk', email: `test${u}@gmail.com`, password: '123123' }),
    );
    const newEvt = new EventModel({ ...this.events[index], users: usersObj });
    this.events[index] = newEvt;

    return new EventModel(newEvt);
  }
}
