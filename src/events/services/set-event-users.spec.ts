import { HttpException, HttpStatus } from '@nestjs/common';
import { EventsMemoryRepository } from '../repositories/event-memory.repository';
import { CreateEventService } from './create-event.service';
import { GetEventByIdService } from './get-event-by-id.service';
import { SetEventUsersService } from './set-event-users.service';

describe('set event users service', () => {
  let eventRepo: EventsMemoryRepository;
  let createEventService: CreateEventService;
  let getEventByIdService: GetEventByIdService;
  let setEventUsersService: SetEventUsersService;

  beforeAll(async () => {
    eventRepo = new EventsMemoryRepository();
    createEventService = new CreateEventService(eventRepo);
    getEventByIdService = new GetEventByIdService(eventRepo);
    setEventUsersService = new SetEventUsersService(eventRepo, getEventByIdService);
  });

  beforeEach(async () => {
    eventRepo.reset();
  });

  it('should return a not found error', async () => {
    try {
      await setEventUsersService.execute(1, []);
      expect(true).toBe(false);
    } catch (e) {
      if (e instanceof HttpException) {
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      }
    }
  });

  it('should return the updated event', async () => {
    const created = await createEventService.execute(1, {
      name: 'test',
      description: 'test',
      start: new Date(),
      end: new Date(),
    });

    const updated = await setEventUsersService.execute(created.id, [1, 2, 3]);
    0;
    expect(updated.users.length).toEqual(3);
    expect(updated.users[0].id).toEqual(1);
  });
});
