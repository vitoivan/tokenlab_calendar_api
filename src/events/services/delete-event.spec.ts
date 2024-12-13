import { HttpException, HttpStatus } from '@nestjs/common';
import { EventsMemoryRepository } from '../repositories/event-memory.repository';
import { CreateEventService } from './create-event.service';
import { DeleteEventService } from './delete-event.service';
import { GetEventByIdService } from './get-event-by-id.service';

describe('delete event service', () => {
  let eventRepo: EventsMemoryRepository;
  let createEventService: CreateEventService;
  let getEventByIdService: GetEventByIdService;
  let deleteEventService: DeleteEventService;

  beforeAll(async () => {
    eventRepo = new EventsMemoryRepository();
    createEventService = new CreateEventService(eventRepo);
    getEventByIdService = new GetEventByIdService(eventRepo);
    deleteEventService = new DeleteEventService(eventRepo, getEventByIdService);
  });

  beforeEach(async () => {
    eventRepo.reset();
  });

  it('should return a not found error', async () => {
    try {
      await deleteEventService.execute(1);
      expect(true).toBe(false);
    } catch (e) {
      if (e instanceof HttpException) {
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      }
    }
  });

  it('should return the deleted event', async () => {
    const created = await createEventService.execute(1, {
      name: 'test',
      description: 'test',
      start: new Date(),
      end: new Date(),
    });
    const deleted = await deleteEventService.execute(1);
    expect(created).toEqual(deleted);
  });
});
