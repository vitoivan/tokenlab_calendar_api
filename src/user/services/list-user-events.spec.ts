import { CreateUserService } from './create-user.service';
import { ListUserEventsService } from './list-user-events.service';
import { EventsMemoryRepository } from '@/events/repositories/event-memory.repository';
import { UserMemoryRepository } from '../repositories/user-memory.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateEventService } from '@/events/services/create-event.service';

describe('list user events service', () => {
  let eventsRepo: EventsMemoryRepository;
  let userRepo: UserMemoryRepository;
  let listUserEventsService: ListUserEventsService;
  let createUserService: CreateUserService;
  let createEventService: CreateEventService;

  beforeAll(() => {
    eventsRepo = new EventsMemoryRepository();
    userRepo = new UserMemoryRepository();
    createUserService = new CreateUserService(userRepo);
    listUserEventsService = new ListUserEventsService(eventsRepo);
    createEventService = new CreateEventService(eventsRepo);
  });

  beforeEach(() => {
    eventsRepo.reset();
    userRepo.reset();
  });

  it('should return not found error', async () => {
    try {
      await listUserEventsService.execute(1, { start: new Date(), end: new Date(Date.now() + 10_000) });
      expect(true).toBe(false);
    } catch (err) {
      if (err instanceof HttpException) {
        expect(err.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    }
  });

  it('should return an empty list', async () => {
    const user = await createUserService.execute({ name: 'test', email: 'test', password: 'test' });

    const events = await listUserEventsService.execute(user.id, {
      start: new Date(),
      end: new Date(Date.now() + 10_000),
    });

    expect(events.length).toBe(0);
  });

  it('should return the events', async () => {
    const user = await createUserService.execute({ name: 'test', email: 'test', password: 'test' });

    await createEventService.execute(user.id, {
      name: 'test',
      description: 'test',
      start: new Date(),
      end: new Date(Date.now() + 10_000),
    });

    const events = await listUserEventsService.execute(user.id, {
      start: new Date(),
      end: new Date(Date.now() + 10_000),
    });

    expect(events.length).toBe(1);
  });
});
