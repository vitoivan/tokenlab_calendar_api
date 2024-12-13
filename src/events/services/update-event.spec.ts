import { HttpException, HttpStatus } from '@nestjs/common';
import { EventsMemoryRepository } from '../repositories/event-memory.repository';
import { CreateEventService } from './create-event.service';
import { GetEventByIdService } from './get-event-by-id.service';
import { UpdateEventService } from './update-event.service';

describe('update event service', () => {
  let eventRepo: EventsMemoryRepository;
  let createEventService: CreateEventService;
  let updateEventService: UpdateEventService;
  let getEventByIdService: GetEventByIdService;

  beforeAll(async () => {
    eventRepo = new EventsMemoryRepository();
    createEventService = new CreateEventService(eventRepo);
    getEventByIdService = new GetEventByIdService(eventRepo);
    updateEventService = new UpdateEventService(eventRepo, getEventByIdService);
  });

  beforeEach(async () => {
    eventRepo.reset();
  });

  it('should return a not found error', async () => {
    try {
      await getEventByIdService.execute(1);
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

    const updated = await updateEventService.execute(created.id, 1, {
      name: 'asdasd',
    });

    expect(updated).toEqual({ ...created, name: updated.name });
    expect(updated.name !== created.name).toBe(true);
  });
});
