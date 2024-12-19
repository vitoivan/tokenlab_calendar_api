import { EVENTS_REPOSITORY } from '@/common/constants/inject-tokens';
import { Inject, Injectable } from '@nestjs/common';
import { EventsRepository } from '../ports/event-repository';
import { GetEventByIdService } from './get-event-by-id.service';
import { EventModel } from '../models/event.model';

@Injectable()
export class SetEventUsersService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepo: EventsRepository,
    private readonly getEventByIdService: GetEventByIdService,
  ) {}

  async execute(eventId: number, userIds: number[]): Promise<EventModel> {
    const event = await this.getEventByIdService.execute(eventId);

    const ids = new Set([event.ownerId, ...userIds]);

    const updated = await this.eventsRepo.setUsers(event.id, Array.from(ids));
    return updated;
  }
}
