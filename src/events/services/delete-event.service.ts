import { EVENTS_REPOSITORY } from '@/common/constants/inject-tokens';
import { Inject, Injectable } from '@nestjs/common';
import { EventsRepository } from '../ports/event-repository';
import { EventModel } from '../models/event.model';
import { GetEventByIdService } from './get-event-by-id.service';

@Injectable()
export class DeleteEventService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepo: EventsRepository,
    private readonly getEventByIdService: GetEventByIdService,
  ) {}

  async execute(id: number, userId: number): Promise<EventModel> {
    const eventFound = await this.getEventByIdService.execute(id);

    if (eventFound.ownerId !== userId) {
      await this.eventsRepo.eventUnsubscribe(eventFound.id, userId);
      return eventFound;
    }

    return await this.eventsRepo.delete(eventFound.id);
  }
}
