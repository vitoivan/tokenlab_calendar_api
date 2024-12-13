import { EVENTS_REPOSITORY } from '@/common/constants/inject-tokens';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventsRepository } from '../ports/event-repository';
import { EventModel } from '../models/event.model';

@Injectable()
export class GetEventByIdService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepo: EventsRepository,
  ) {}

  async execute(id: number): Promise<EventModel> {
    const eventFound = await this.eventsRepo.getById(id);

    if (!eventFound) {
      throw new NotFoundException('event not found');
    }

    return eventFound;
  }
}
