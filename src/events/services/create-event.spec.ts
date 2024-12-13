import { EventModel } from '../models/event.model';
import { EventsMemoryRepository } from '../repositories/event-memory.repository';
import { CreateEventService } from './create-event.service';

describe('create event service', () => {
  let eventRepo: EventsMemoryRepository;
  let createEventService: CreateEventService;

  beforeAll(async () => {
    eventRepo = new EventsMemoryRepository();
    createEventService = new CreateEventService(eventRepo);
  });

  beforeEach(async () => {
    eventRepo.reset();
  });

  it('should return the created event', async () => {
    const startDate = new Date();
    const endDate = new Date(Date.now() + 10_000);
    startDate.setUTCHours(startDate.getUTCHours(), startDate.getUTCMinutes(), 0, 0);
    endDate.setUTCHours(endDate.getUTCHours(), endDate.getUTCMinutes(), 0, 0);

    const toCreate = new EventModel({
      name: 'test',
      description: 'test',
      start: startDate,
      end: endDate,
      ownerId: 1,
    });

    const created = await createEventService.execute(toCreate.ownerId, toCreate);

    expect(created).toEqual({
      id: expect.any(Number),
      name: toCreate.name,
      description: toCreate.description,
      start: toCreate.start,
      end: toCreate.end,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      ownerId: 1,
      owner: null,
    });
  });
});
